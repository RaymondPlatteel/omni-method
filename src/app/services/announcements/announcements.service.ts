import {Injectable, inject} from '@angular/core';
import {DocumentData, DocumentReference, Firestore, collection, collectionData} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Announcement} from '../../store/models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private firestore: Firestore = inject(Firestore);
  private userDocRef: DocumentReference<DocumentData>;

  constructor() {}

  getAnnouncements() {
    const announcementCollection = collection(this.firestore, "announcement");
    return collectionData(announcementCollection) as Observable<Announcement[]>;
  }
}
