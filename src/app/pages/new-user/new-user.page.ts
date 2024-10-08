import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {UserService, usernameMinLength, usernameMaxLength} from '../../services/user/user.service';
import {AuthService} from '../../services/auth.service';
import {User} from '../../store/user/user.model';
import {AssessmentService} from 'src/app/services/assessments/assessment.service';
import {ShowToastService} from 'src/app/services/show-toast.service';
import {Subscription} from 'rxjs';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
})
export class NewUserPage implements OnInit, OnDestroy {
  userId: string;
  userEmail: string;
  formData: FormGroup;// = new FormGroup({});
  userHeight: FormGroup;
  // numberPickerSubscription: Subscription;
  initDob: string;
  fitnessLevel: string = 'none';
  scoreDate = new Date().toISOString().split('T')[0];
  step = 1;
  // isApp = false;
  usernameMinLength = usernameMinLength;
  usernameMaxLength = usernameMaxLength;
  private loading: HTMLIonLoadingElement;
  private userLoadingSubscription: Subscription;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private assessmentService: AssessmentService,
    private showToastService: ShowToastService,
    private loadingCtrl: LoadingController
  ) {
    let calcDate = new Date();
    let curYear = calcDate.getFullYear();
    calcDate.setFullYear(curYear - 16);
    this.initDob = datePipe.transform(calcDate, 'yyyy-MM-dd');
    // https://stackoverflow.com/questions/65056918/reactive-form-date-picker-in-ionic-5
    console.log("newUser initDob", this.initDob);
    this.userId = this.auth.currUserId;
    this.userEmail = this.auth.currUserEmail;
  }

  async ngOnInit() {
    console.log("newUser ngOnInit", this.userId, this.userEmail);

    this.initFormData();

    this.formData.get('username').valueChanges.subscribe((event) => {
      this.formData.get('username').setValue(event.toLowerCase(), {emitEvent: false});
    });

    this.loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });

  }

  ngOnDestroy(): void {
    console.log("newUserPage ngOnDestroy unsubscribe");
    // this.numberPickerSubscription.unsubscribe();
    this.userLoadingSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    console.log("newUserPage ionViewWillEnter subscribe");

    this.userLoadingSubscription = this.userService.getLoadingStatus().subscribe((loading) => {
      if (loading) {
        console.log("newUserPage show loading");
        this.loading?.present();
      } else {
        console.log("newUserPage hide loading hidePopover");
        this.loading?.dismiss();
      }
    });
  }

  ionViewWillLeave() {
    console.log("newUserPage ionViewWillLeave unsubscribe");
    // this.numberPickerSubscription.unsubscribe();
    this.userLoadingSubscription.unsubscribe();
  }

  private initFormData() {
    console.log("initFormData()");
    this.userHeight = new FormGroup({
      feet: new FormControl(4, [
        Validators.required,
        Validators.pattern('[0-9]'),
      ]),
      inches: new FormControl(8, [
        Validators.required,
        Validators.pattern('[0-9]{1,2}'),
        Validators.min(0),
        Validators.max(11),
      ]),
    });
    this.formData = new FormGroup({
      id: new FormControl(this.userId, [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl(this.userEmail, [
        Validators.required,
        Validators.email,
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(usernameMinLength),
        Validators.maxLength(usernameMaxLength)
      ]),
      gender: new FormControl('', []),
      dob: new FormControl(this.initDob, [Validators.required]),
      height: this.userHeight,
      weight: new FormControl(95, [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.min(0),
        Validators.max(500),
      ]),
      // fitnessLevel: new FormControl('none', [Validators.required]),
    });
  }

  setFitnessLevel(ev) {
    this.fitnessLevel = ev.target.value;
    console.log("setFitnessLevel", this.fitnessLevel);
  }

  setGender(ev) {
    console.log("setGender", ev);
    this.formData.value.gender = ev.target.value;
  }

  onSubmit() {
    const newUser = this.formData.value as User;
    console.log('new user onSubmit', newUser);
    // create user in database
    this.userService.saveNewUser({
      ...(newUser),
      fitnessLevel: this.fitnessLevel,
      scoreDate: this.scoreDate,
      omniScore: 0,
      categoryScore: this.assessmentService.getNewCategoryScores(),
    });
  }

  async next() {
    console.log('next()', JSON.stringify(this.formData.value));
    if (this.step < 6) {
      if (this.step == 1) {
        const username = this.formData.value['username'];
        if (!username) {
          this.showToastService.showToast("You must select a username", "danger");
          return;
        }
        if (username.length < usernameMinLength) {
          this.showToastService.showToast("Username must be at least " + usernameMinLength + " characters", "danger");
          return;
        }
        if (username.length > usernameMaxLength) {
          this.showToastService.showToast("Username must be no more than " + usernameMaxLength + " characters", "danger");
          return;
        }
        console.log('check username', username);
        const isAvailable = await this.userService.isUsernameAvailable(username);
        console.log("username is available", isAvailable);
        if (!isAvailable) {
          this.showToastService.showToast("Sorry, a user already exists with that username", "danger");
          return;
        }
      }
      this.step = this.step + 1;
    } else {
      this.onSubmit();
    }
  }

  previous() {
    console.log('previous()', JSON.stringify(this.formData.value));
    this.step = this.step - 1;
  }

  get first() {
    return this.formData.get('firstName');
  }

  get last() {
    return this.formData.get('lastName');
  }

  get username() {
    return this.formData.get('username');
  }

  get gender() {
    return this.formData.get('gender');
  }

  get email() {
    return this.formData.get('email');
  }

  get dob() {
    return this.formData.get('dob');
  }

  get weight() {
    return this.formData.get('weight');
  }

}
