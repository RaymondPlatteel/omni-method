import {Injectable, inject} from '@angular/core';
import {DocumentData, DocumentReference, Firestore, collection, collectionData} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Announcement} from '../../store/models/announcement.model';
import {ModalController} from '@ionic/angular';
import {AnnouncementsPage} from '../../pages/announcements/announcements.page';
import {Browser} from '@capacitor/browser';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private firestore: Firestore = inject(Firestore);
  private userDocRef: DocumentReference<DocumentData>;

  constructor(
    private modalCtrl: ModalController
  ) {}

  getAnnouncements() {
    const announcementCollection = collection(this.firestore, "announcement");
    return collectionData(announcementCollection) as Observable<Announcement[]>;
  }

  async openAnnouncements(event) {
    event?.stopPropagation();
    const modal = await this.modalCtrl.create({
      component: AnnouncementsPage,
      cssClass: 'edit-user-modal',
      // presentingElement: document.querySelector('ion-router-outlet'),
      canDismiss: true,
    });
    await modal.present();
    modal.onDidDismiss().then(() => {
      // this.loadUserData();
    });
  }

  async openDiscord() {
    await Browser.open({url: environment.discordLink});
  }

}
