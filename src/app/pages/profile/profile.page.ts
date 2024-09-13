import {Component, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import {IonAccordionGroup, IonRouterOutlet, ModalController, isPlatform} from '@ionic/angular';
import {Assessment} from '../../store/assessments/assessment.model';
import {Router} from '@angular/router';
import {StatusBar, Style} from '@capacitor/status-bar';

import {User} from '../../store/user/user.model';
import {Score} from '../../store/models/score.model';
import {Subscription} from 'rxjs';
import {NewScorePage} from '../new-score/new-score.page';
import {Store} from '@ngrx/store';
import {
  selectAllAssessments,
  selectAllCategories,
} from 'src/app/store/assessments/assessment.selector';
import * as UserSelectors from 'src/app/store/user/user.selectors';
import {delay, filter, tap} from 'rxjs/operators';
import {OmniScoreService, oneDay} from '../../services/omni-score.service';
import {UserService} from '../../services/user/user.service';
import {Capacitor} from '@capacitor/core';
import {AnnouncementsService} from '../../services/announcements/announcements.service';
// import {Analytics, logEvent} from '@angular/fire/analytics';
// import {AssessmentDetailPage} from '../assessment-detail/assessment-detail.page';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  // @ViewChild('accordionGroup') accordionGroup: IonAccordionGroup;
  // private analytics: Analytics = inject(Analytics);
  moreOpen: boolean = false;
  userSubscription: Subscription;
  userId: string;
  user: User;
  scores: Score[];
  omniScore: number = 0;
  unadjustedScore: number = 0;

  public newUserGreeting = "Your scores are being estimated based on the information you provided during your account setup. Please consider configuring a profile picture.";
  public newUser: boolean = false;
  alertButtons = [
    {
      text: 'Edit Profile',
      handler: () => {
        console.log('Edit profile');
        this.userService.openEditProfile(undefined, this.user)
      },
    },
    {
      text: 'Continue',
      role: 'cancel',
    }
  ];

  // using global ngrx store
  public categories$ = this.store.select(selectAllCategories);
  public assessments$ = this.store.select(selectAllAssessments);
  public user$ = this.store.select(UserSelectors.selectUser); //.pipe(delay(5000));
  public scores$ = this.store.select(UserSelectors.userScores);
  // public omniScore$ = this.store.select(selectOmniScore);

  constructor(
    private store: Store,
    private router: Router,
    private modalCtrl: ModalController,
    public userService: UserService,
    public announcementService: AnnouncementsService,
    private routerOutlet: IonRouterOutlet
  ) {}

  ngOnInit(): void {
    // console.log("profile page scores$", this.scores$);
    this.userSubscription = this.user$
      .pipe(filter(usr => usr !== null))
      .subscribe({
        next(user) {
          console.log("user$ next", user);
          this.user = user;
          // logEvent(this.analytics, "view_profile", {username: user.username});
        },
        error(message) {
          console.log("ERROR", message);
        },
      });
    // logEvent(this.analytics, "screen_view", {
    //   firebase_screen: "profile_page",
    //   firebase_screen_class: "ProfilePage"
    // });

    console.log("ngOnInit profilePage navigation extras",
      this.router.getCurrentNavigation()?.extras);
    const info = this.router.getCurrentNavigation().extras?.info;
    if (info && Object.keys(info).includes("newUser")) {
      this.newUser = true;
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (Capacitor.isNativePlatform()) {
      if (prefersDark.matches) {
        StatusBar.setStyle({style: Style.Dark});
      } else {
        StatusBar.setStyle({style: Style.Light});
      }
    }
  }

  // ionViewDidEnter() {
  //   console.log("ionViewDidEnter, disable swipe gesture");
  //   this.routerOutlet.swipeGesture = false;
  // }

  // ionViewWillLeave() {
  //   console.log("ionViewWillLeave, enable swipe gesture");
  //   this.routerOutlet.swipeGesture = true;
  // }

  getScores$(assessment: Assessment) {
    return this.store.select(UserSelectors.assessmentScores(assessment.aid)).pipe(
      tap((results) => {
        results?.sort(function (a, b) {
          return Date.parse(b.scoreDate) - Date.parse(a.scoreDate);
        });
      })
    );
  }

  openDetails(assessment: Assessment) {
    // this.router.navigate(['/home', 'profile', 'details'], {
    this.router.navigate(['/home/profile/details'], {
      queryParams: {aid: assessment.aid, cid: assessment.cid},
    });
  }

  isLoggedIn(): boolean {
    // return this.googleApi.isLoggedIn()
    return true;
  }

  // scoreClass(date: Date): string {
  scoreClass(scoreDate: string): string {
    return OmniScoreService.scoreClass(scoreDate);
  }

  getAge(user: User) {
    var today = new Date();
    var birthDate = new Date(user.dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async openNewScore(assessment, user, curScore) {

    if (assessment.checklist) {
      return this.openDetails(assessment);
    }
    const modal = await this.modalCtrl.create({
      component: NewScorePage,
      componentProps: {
        assessment: assessment,
        user: user,
        curScore: curScore,
      },
      cssClass: 'new-score-modal',
      // presentingElement: document.querySelector('ion-router-outlet'),
      canDismiss: true,
    });
    await modal.present();
    modal.onDidDismiss().then(() => {
    });
  }

}
