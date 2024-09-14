import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Media, MediaAsset} from '@capacitor-community/media';
import {ModalController} from '@ionic/angular';
import {OmniScoreService} from 'src/app/services/omni-score.service';

@Component({
  selector: 'app-video-picker',
  templateUrl: './video-picker.page.html',
  styleUrls: ['./video-picker.page.scss'],
})
export class VideoPickerPage implements OnInit {
  @Output() pickerValueChange = new EventEmitter<MediaAsset>();
  public medias: MediaAsset[] = [];

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getMedias();
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  getMedias() {
    console.log("call Media.getMedias()");
    Media.getMedias({
      quantity: 72,
      thumbnailQuality: 60,
      types: "videos",
      sort: "creationDate"
    }).then((medias) => {
      this.medias = medias.medias;
      console.log("got medias.length", this.medias.length);
      if (this.medias.length == 0) {
        // no videos available
        alert("No videos found on device.");
        this.cancel();
      } else {
        // get video lengths
        console.log("video identifier", this.medias[0].identifier);
        console.log("video creation date", OmniScoreService.scoreDate(this.medias[0].creationDate));
      }
    });

    // this.storageService.recordVideo();
  }

  selectVideo(video: MediaAsset) {
    this.modalCtrl.dismiss(video, 'select');
    console.log("selectVideo", video.identifier);
    // Media.getMediaByIdentifier({identifier: video.identifier}).then(
    //   (path) => {
    //     console.log("video path", path.path);
    //   },
    //   (err) => {
    //     console.log("getMediaByIdentifier error", err);
    //   }
    // );
    this.pickerValueChange.emit(video);
  }
}
