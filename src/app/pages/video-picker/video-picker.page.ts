import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Media, MediaAsset} from '@capacitor-community/media';
import {ModalController} from '@ionic/angular';

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
    Media.getMedias({quantity: 240, types: "videos"}).then((medias) => {
      // Media.getMedias({quantity: 1, types: "photos"}).then((medias) => {
      // console.log("got medias", medias);
      this.medias = medias.medias;
      console.log("got medias.length", this.medias.length);
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
