import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AnnouncementsService} from '../../services/announcements/announcements.service';
import {UserService} from '../../services/user/user.service';
import {AlertController, ModalController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertController: AlertController,
    public userService: UserService,
    public announcementService: AnnouncementsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // const info = this.router.getCurrentNavigation().extras.info;
    console.log("homePage ngOnInit navigation extras",
      this.router.getCurrentNavigation().extras);
    // if (Object.keys(info).includes("newUser")) {
    //   console.log("home page newUser");
    //   alert("Welcome consider adding profile picture");
    // }
  }

  async logout() {
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
          this.authService.logout();
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

}
