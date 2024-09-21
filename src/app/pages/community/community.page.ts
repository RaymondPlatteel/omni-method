import {Component, OnInit, ViewChild, inject} from '@angular/core';
import {User} from '../../store/user/user.model';
import {Observable} from 'rxjs';
import {StatusBar, Style} from '@capacitor/status-bar';
import {Capacitor} from '@capacitor/core';
import {CommunityService} from '../../services/community/community.service';
import {Router} from '@angular/router';
import {InAppReview} from '@capacitor-community/in-app-review';
import {UserService} from 'src/app/services/user/user.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  public type: string = 'rankings';
  public ranking$: Observable<User[]>;
  private curUserId: string;

  constructor(
    private communityService: CommunityService,
    private userService: UserService,
    private router: Router,
  ) {
    // loadAllUsers
    communityService.loadAllUsers();
  }

  async ngOnInit() {
    // getAllUsersByScore
    this.ranking$ = this.communityService.getAllUsersByScore();
    this.userService.getUser().subscribe(user => this.curUserId = user.id);

    // InAppReview.requestReview();

    await Notification.requestPermission();
    console.log("permission", Notification.permission);
  }

  ionViewWillEnter() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({style: Style.Dark});
    }
  }

  highlightUser(athlete: User) {
    // highlight current user
    return athlete.id == this.curUserId ? "highlight" : "";
  }

  openDetails(athlete: User) {
    // load selected user
    this.communityService.loadSelectedUser(athlete.id);
    // go to detail page
    this.router.navigate(['/home/community/athlete']);
  }

  userLevel(athlete: User): number {
    return Math.trunc(athlete.omniScore / 100);
  }

}