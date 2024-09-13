import {Component, OnInit} from '@angular/core';
import {AnnouncementsService} from '../../services/announcements/announcements.service';
import {StorageService} from '../../services/storage/storage.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
})
export class AnnouncementsPage implements OnInit {
  public announcements = [];

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private announcementService: AnnouncementsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.announcementService.getAnnouncements().subscribe(annuncements => {
      if (annuncements) {
        console.log("announcements", annuncements)
        annuncements.forEach(async (a, i, arr) => {
          await this.getVideoLink(a.filename).then(u => a.url = u);
          console.log("videoLink", a.url);
          const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(a.url);
          console.log("sanitizedUrl", sanitizedUrl);
          if (a.thumbnail) {
            this.getVideoLink(a.thumbnail).then(u => a.thumbnail = u)
          }
        })
        this.announcements = annuncements;
      }
    })

  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  getVideoLink(filename: string) {
    const filePath = "content/videos/announcements/" + filename;
    console.log("getVideoLink", filePath);
    return this.storageService.getFileUrl(filePath);
  }

}
