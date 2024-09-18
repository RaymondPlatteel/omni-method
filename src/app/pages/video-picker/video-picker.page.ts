import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Media, MediaAsset } from '@capacitor-community/media';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { OmniScoreService } from 'src/app/services/omni-score.service';

@Component({
  selector: 'app-video-picker',
  templateUrl: './video-picker.page.html',
  styleUrls: ['./video-picker.page.scss'],
})
export class VideoPickerPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Output() pickerValueChange = new EventEmitter<MediaAsset>();
  public medias: MediaAsset[] = [];
  private offset = 0;
  private batchSize = 36;

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadMedias();
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  loadMedias(event?: any) {
    console.log("call Media.getMedias()");
    Media.getMedias({
      quantity: this.batchSize,
      thumbnailQuality: 60,
      types: "videos",
      sort: "creationDate"
    }).then((result) => {
      this.medias = [...this.medias, ...result.medias.slice(this.offset, this.offset + this.batchSize)];
      this.offset += result.medias.length;
      console.log("got medias.length", this.medias.length);
      
      if (event) {
        event.target.complete();
      }
      
      if (result.medias.length < this.batchSize) {
        this.infiniteScroll.disabled = true;
      }

      if (this.medias.length === 0) {
        // no videos available
        alert("No videos found on device.");
        this.cancel();
      } else {
        // get video lengths
        console.log("video identifier", this.medias[0].identifier);
        console.log("video creation date", OmniScoreService.scoreDate(this.medias[0].creationDate));
      }
    });
  }

  loadMore(event: any) {
    this.loadMedias(event);
  }

  selectVideo(video: MediaAsset) {
    this.modalCtrl.dismiss(video, 'select');
    console.log("selectVideo", video.identifier);
    this.pickerValueChange.emit(video);
  }
}
