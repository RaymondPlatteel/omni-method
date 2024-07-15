import {Component, OnInit, ViewChild, inject} from '@angular/core';
// import {IonModal} from '@ionic/angular';
import {User} from '../../store/user/user.model';
import {Observable} from 'rxjs';
import {StatusBar, Style} from '@capacitor/status-bar';
import {Capacitor} from '@capacitor/core';
import {CommunityService} from '../../services/community/community.service';
import {Router} from '@angular/router';
import {getDownloadURL, getStorage, ref} from '@angular/fire/storage';
import {StorageService} from '../../services/storage/storage.service';
import {InAppReview} from '@capacitor-community/in-app-review';
import {AnnouncementsService} from 'src/app/services/announcements/announcements.service';

// export enum View {
//   Rankings = 'Rankings',
//   Announcements = 'Announcements',
//   People = 'People',
// }

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  public type: string = 'announcements';
  // public view: View = View.Rankings;
  public ranking$: Observable<User[]>;
  private curUserId: string;
  public announcements = [
    {
      "title": "Big Buck Bunny",
      "subtitle": "By Blender Foundation",
      "description": "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
      "filename": undefined,
      "url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      "title": "Elephant Dream",
      "subtitle": "By Blender Foundation",
      "description": "The first Blender Open Movie from 2006",
      "filename": undefined,
      "url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      "title": "For Bigger Blazes",
      "subtitle": "By Google",
      "description": "HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV. For when you want to settle into your Iron Throne to watch the latest episodes. For $35.\nLearn how to use Chromecast with HBO GO and more at google.com/chromecast.",
      "filename": undefined,
      "url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    }
  ];

  constructor(
    private communityService: CommunityService,
    private router: Router,
    private storageService: StorageService,
    private announcementService: AnnouncementsService,
  ) {
    // loadAllUsers
    communityService.loadAllUsers();
  }

  async ngOnInit() {
    // getAllUsersByScore
    this.ranking$ = this.communityService.getAllUsersByScore();

    this.announcementService.getAnnouncements().subscribe(annuncements => {
      if (annuncements) {
        console.log("announcements", annuncements)
        annuncements.forEach((a, i, arr) => {
          this.getVideoLink(a.filename).then(u => a.url = u)
        })
        this.announcements = annuncements;
      }
    })

    // InAppReview.requestReview();

    console.log("ngOnInit", JSON.stringify(this.announcements));

    await Notification.requestPermission();
    console.log("permission", Notification.permission);
  }

  ionViewWillEnter() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({style: Style.Dark});
    }
  }

  highlightUser(athlete: User) {
    // return athlete.id == this.curUserId ? "highlight" : "";
    return athlete.id == this.curUserId ? "tertiary" : "";
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

  getVideoLink(filename: string) {
    const filePath = "content/videos/announcements/" + filename;
    console.log("getVideoLink", filePath);
    return this.storageService.getVideoUrl(filePath);
  }

}