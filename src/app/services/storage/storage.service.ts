import {HttpClient, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import {FirebaseStorage, getBytes, getDownloadURL, getStorage, ref, uploadBytes, UploadMetadata, uploadString} from '@angular/fire/storage';
import {Capacitor, CapacitorHttp, HttpHeaders, HttpOptions} from '@capacitor/core';
import {Observable, from} from 'rxjs';
import {Filesystem, Directory, Encoding} from '@capacitor/filesystem';
import {ModalController, Platform} from '@ionic/angular';
import {Camera} from '@capacitor/camera';
import {VideoPickerPage} from '../../pages/video-picker/video-picker.page';
import {MediaAsset} from '@capacitor-community/media';
import {OmniScoreService} from '../omni-score.service';
import {Score} from '../../store/models/score.model';
import {deleteObject} from 'firebase/storage';

/*
* storage.googleapis.com/BUCKET_NAME
* BUCKET_NAME.storage.googleapis.com
*/

const ANNOUNCEMENTS_DIR = "content/videos/announcements/";

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log("loggingInterceptor", req.url);
  console.log("loggingInterceptor Origin", req.headers.get('Origin'));
  return next(req);
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: FirebaseStorage;

  constructor(
    private http: HttpClient,
    // private afStorage: AngularFireS
    private plt: Platform,
    private modalCtrl: ModalController
  ) {
    this.storage = getStorage();
  }

  // ngOnInit() {
  //   this.plt.ready().then(() => {
  //     let path = this.file.dataDirectory;
  //     this.file.checkDir(path, "media_temp").then(() => {


  //     }, err => {
  //       this.file.createDir(path, "media_temp");
  //     }

  //   })
  // }

  public getAnnouncements(): any {
    console.log("getAnnouncements");

    let filePath = ANNOUNCEMENTS_DIR + "announcements.json";
    console.log("filePath", filePath);

    const isNativePlatform = Capacitor.isNativePlatform();
    console.log("isNativePlatform", isNativePlatform);
    if (isNativePlatform) {
      filePath = encodeURIComponent(filePath);
      console.log("filePath", filePath);
    }

    const fileRef = ref(this.storage, filePath);
    console.log("fileRef fullPath", fileRef.fullPath);
    console.log("fileRef name", fileRef.name);

    console.log("fileRef bucket", fileRef.bucket);

    const resp = getBytes(fileRef).then((resp) => {
      console.log("getBytes response", resp);
      var enc = new TextDecoder("utf-8");
      const obj: Object = JSON.parse(enc.decode(resp));
      console.log("resp obj", obj);
      this.getUrls(obj);
      return obj;
    }).catch((err) => {
      console.log("StorageService getAnnouncements, getBytes error", err);
      return undefined;
    });

    return resp;
  }

  async getUrls(obj) {
    for (var entry of obj.videos) {
      console.log("getUrl for file", entry.filename);
      entry.url = await this.getFileUrl(ANNOUNCEMENTS_DIR + entry.filename);
    }
  }

  getFileUrl(filePath: string) {
    console.log("getFileUrl", filePath);
    const isNativePlatform = Capacitor.isNativePlatform();
    console.log("isNativePlatform", isNativePlatform);
    // if (isNativePlatform) {
    //   filePath = encodeURIComponent(filePath);
    //   console.log("filePath", filePath);
    // }
    // const storage = getStorage();

    return getDownloadURL(ref(this.storage, filePath)).then((url) => {
      console.log("return downloadURL", url);
      return url;
    }).catch((err) => {
      console.log("getFileUrl error", err);
      return undefined;
    });
  }

  public remoteScoreVideoPath(score: Score, ext: string = 'mp4') {
    const scoreDate = OmniScoreService.scoreDate(score.scoreDate);
    const dest = `users/${score.uid}/${score.aid}-${scoreDate}.${ext}`;
    return dest;
  }

  deleteFile(remotePath: string) {
    console.log("deleteFile", remotePath);
    const fileRef = ref(this.storage, remotePath);
    deleteObject(fileRef).then(
      () => {
        console.log("file deleted", remotePath);
      }, (err) => {
        console.log("failed to delete file", err);
      }
    )
  }

  async uploadFile(loaclPath: string, destPath: string, contentType: string = 'video/mp4') {
    console.log("uploadFile localPath", loaclPath);
    console.log("uploadFile destPath", destPath);

    const destFileRef = ref(this.storage, destPath);

    const metadata: UploadMetadata = {
      contentType: contentType
    };

    await Filesystem.readFile({path: loaclPath}).then(async (readResult) => {
      await uploadString(destFileRef, readResult.data.toString(), 'base64', metadata)
        .then(
          (snapshot) => {
            console.log("upload result", snapshot.ref.fullPath);
          },
          (err) => {
            console.log("upload video failed", err);
          }
        )
    })

    return getDownloadURL(ref(this.storage, destPath)).then((url) => {
      console.log("return downloadURL", url);
      return url;
    }).catch((err) => {
      console.log("getFileUrl error", err);
      return undefined;
    });

  }

  getMimeType(fileExt: string) {
    if (fileExt == 'wav') return {type: 'audio/wav'};
    else if (fileExt == 'jpg') return {type: 'image/jpg'};
    else if (fileExt == 'mp4') return {type: 'video/mp4'};
    else if (fileExt == 'MOV') return {type: 'video/quicktime'};
  }

  // recordVideo() {
  //   this.mediaCapture.captureVideo().then(
  //     (data: MediaFile[]) => {
  //       if (data.length > 0) {
  //         this.copyFile(data[0].fullPath);
  //       }
  //     },
  //     (err: CaptureError) => console.log("recordVideo capture err", err)
  //   );
  // }

  copyFile(path) {
    console.log("copyFile path", path);
  }

  async openVideoPicker(): Promise<MediaAsset> {
    const modal = await this.modalCtrl.create({
      component: VideoPickerPage,
      componentProps: {

      },
      cssClass: '',
      canDismiss: true,
    });

    modal.present();

    const {data, role} = await modal.onWillDismiss();

    return data;

  }

}
