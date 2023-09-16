import {Component, OnInit} from '@angular/core';
import {AssessmentService} from './services/assessments/assessment.service';
import {ModalController, Platform} from '@ionic/angular';
import {EditProfilePage} from './pages/edit-profile/edit-profile.page';
import { TextZoom } from '@capacitor/text-zoom';
import { App } from '@capacitor/app';

// import { GoogleSigninService } from './google-signin.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Omni Method';

  // constructor(private readonly google: GoogleSigninService) {}
  // constructor(private store: Store<AppState>) {}

  constructor(
    private assessmentService: AssessmentService,
    private modalCtrl: ModalController,
    public platform: Platform
  ) {
    App.addListener('appStateChange', ({ isActive }) => {
      TextZoom.getPreferred().then(value => {
        TextZoom.set(value);
      })
    });
    assessmentService.load();
    this.initializeApp();
  }

  ngOnInit(): void {}

  initializeApp() {}



}
