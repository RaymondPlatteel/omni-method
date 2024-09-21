import {Injectable, OnDestroy, Optional, inject} from '@angular/core';
import {Router} from '@angular/router';
import {
  Auth,
  user,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  sendPasswordResetEmail,
  // GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  // signInWithPopup,
  reauthenticateWithCredential,
  AuthCredential,
  EmailAuthProvider,
  updatePassword,
} from '@angular/fire/auth';

// import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {BehaviorSubject, from, Observable, Subscription} from 'rxjs';
// import { User } from '../store/user/user.model';
import * as OmniUser from '../store/user/user.model';
import {Store} from '@ngrx/store';
import * as UserActions from '../store/user/user.actions';
import {AppState} from '../store/app.state';
import {selectAuthError} from '../store/user/user.selectors';
import {AlertController, ModalController} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private auth: Auth = inject(Auth);
  // user$ = user(this.auth);
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;
  // userSubscription: Subscription;

  loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();
  currUserId: string;
  currUserEmail: string;
  currUser: OmniUser.User;

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private router: Router,
    private store: Store<AppState>
  ) {
    // angular/fire provided authState observer
    this.authStateSubscription = this.authState$.subscribe((user) => {
      if (user) {
        console.log("auth.service onAuthStateChanged user", user);
        console.log("auth.service onAuthStateChanged check user saved", this.currUserId, this.currUserEmail);
        this.saveUser(user);
        console.log("dispatch UserActions.userAuthenticated");
        this.store.dispatch(
          UserActions.userAuthenticated({payload: JSON.parse(JSON.stringify({user: user}))})
        );
      } else {
        console.log("auth.service onAuthStateChanged User is signed out");
        this.currUserId = this.currUserEmail = undefined;
        console.log("auth.service onAuthStateChanged check user saved", this.currUserId, this.currUserEmail);
        this.router.navigate(['/welcome']);
      }
    })
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
  }

  currentUser(): Promise<any> {
    return Promise.resolve(this.currUser);
    // return this.fireauth.currentUser;
  }

  // login method
  login(email: string, password: string) {
    console.log("auth.service login");
    this.store.dispatch(UserActions.userAuthenticationStart());
    console.log("signInWithEmailAndPassword");
    signInWithEmailAndPassword(this.auth, email, password).then(
      (res) => {
        // localStorage.setItem('userId', res.user.uid);
        console.log("auth.service login res", res.user);
        console.log("auth.service login check user saved", this.currUserId, this.currUserEmail);
        this.saveUser(res.user);
        // dispatch UserActions.userAuthenticated
        this.store.dispatch(
          UserActions.userAuthenticated({payload: JSON.parse(JSON.stringify(res.user))})
        );
        this.router.navigate(['home']);
      },
      (err) => {
        console.log(err);
        this.store.dispatch(
          UserActions.userAuthenticationFailed({error: "Your login is incorrect. Please try again"})
        );
      }
    );
  }

  authError() {
    return this.store.select(selectAuthError);
  }

  verifyPassword(password: string) {
    // console.log("verifyPassword", password);
    var credential = EmailAuthProvider.credential(this.auth.currentUser.email, password);
    return reauthenticateWithCredential(this.auth.currentUser, credential);
  }

  // register method
  register(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password).then(
      (res) => {
        console.log('register user success: '.concat(res.user.email));
        const clonedUser = JSON.parse(JSON.stringify(res.user));
        console.log(clonedUser);
        // this.store.dispatch(
        //   UserActions.registerUserSuccess({ payload: clonedUser })
        // );
        this.store.dispatch(
          UserActions.userAuthenticated({
            payload: JSON.parse(JSON.stringify(res)),
          })
        );
        this.saveUser(res);
        this.router.navigate(['/new-user']);
      },
      (err) => {
        console.log(err['code']);
        this.store.dispatch(
          UserActions.registerUserFailure({error: err['code']})
        );
        // alert(err.message);
        this.router.navigate(['/register']);
      }
    );
  }

  async promptLogout() {
    const confirmLogoutButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
        htmlAttributes: {
          'aria-label': 'cancel',
        }
      },
      {
        text: 'Log Out',
        cssClass: 'logout-button-confirm',
        role: 'confirm',
        handler: () => {
          this.modalCtrl.dismiss(null, 'logout');
          this.doLogout();
        },
        htmlAttributes: {
          'aria-label': 'logout',
        }
      }
    ];
    // present logout confirmation
    const alert = await this.alertController.create({
      header: 'Log out of your account?',
      id: 'logout',
      buttons: confirmLogoutButtons,
    });
    await alert.present();
  }

  // logout method
  doLogout() {
    signOut(this.auth).then(
      () => {
        // localStorage.removeItem('userId');
        this.store.dispatch(UserActions.logoutAction());
        // this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.verifyPassword(oldPassword)
      .then(async (userCred) => {
        console.log("updatePassword for userCred", userCred);
        return updatePassword(this.auth.currentUser, newPassword);
      })
      .catch(err => {
        console.log("verify old password failed", err);
        throw ("Verify old password failed");
      })
  }

  // forgot password method
  forgotPassword(email: string) {
    sendPasswordResetEmail(this.auth, email).then(
      () => {
        this.router.navigate(['/verify-email']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  deleteUser() {
    deleteUser(this.auth.currentUser).then(() => {
      console.log('auth user deleted');
    }).catch((error) => {
      console.log('failed to delete auth user', error);
    })
  }

  // email verification
  // sendVerificationMail() {
  //   return this.fireauth.currentUser
  //     .then((u) => u?.sendEmailVerification())
  //     .then(() => {
  //       // this.router.navigate(['verify-email']);
  //       alert('email verification link sent');
  //     });
  // }

  // googleSignIn_firebase() {
  //   const provider = new GoogleAuthProvider();
  //   if (provider) {
  //     console.log('signInWithRedirect');
  //     signInWithRedirect(this.auth, provider);
  //     return getRedirectResult(this.auth).then(
  //       (result) => {
  //         console.log('redirect successful, ', result);
  //       },
  //       (error) => {
  //         console.log('google redirect login failed, ', error);
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //       }
  //     );
  //   } else {
  //     console.log('signInWithPopup');
  //     return signInWithPopup(this.auth, provider).then(
  //       (result) => {
  //         console.log('logged in with google, ', result);
  //         const credential = GoogleAuthProvider.credentialFromResult(result);
  //         console.log('credential, ', credential);
  //         const token = credential.accessToken;
  //         const user = result.user;
  //         const additionaInfo = getAdditionalUserInfo(result);
  //         console.log('additionalInfo, ', additionaInfo);
  //       },
  //       (error) => {
  //         console.log('google popup login failed, ', error);
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         const credential = GoogleAuthProvider.credentialFromError(error);
  //       }
  //     );
  //   }
  // }

  // sign in with google method
  // googleSignIn() {
  //   // this is not supported in device only browser
  //   return (
  //     signInWithPopup(this.auth, new GoogleAuthProvider())
  //       // return this.fireauth.signInWithPopup(new GoogleAuthProvider())
  //       .then(
  //         (res) => {
  //           this.router.navigate(['/home']);
  //           this.saveUser(res);
  //           this.currUser = {
  //             id: res.user.uid,
  //             nickname: res.user.displayName,
  //             email: res.user.email,
  //             avatar: res.user.photoURL,
  //             firstName: 'first',
  //             lastName: 'last',
  //             dob: null, //'1976-07-04',
  //             weight: 100,
  //           };
  //         },
  //         (err) => {
  //           alert(err.message);
  //         }
  //       )
  //   );
  // }

  private saveUser(res) {
    console.log('auth.service saveUser', res);
    if (res) {
      if (res.user) {
        console.log('auth.service saveUser res.user');
        this.currUserId = res.user.uid;
        this.currUserEmail = res.user.email;
      } else {
        console.log('auth.service saveUser res');
        this.currUserId = res.uid;
        this.currUserEmail = res.email;
      }
      console.log("saveUser", this.currUserId, this.currUserEmail);
    } else {
      this.doLogout();
    }
  }
}
