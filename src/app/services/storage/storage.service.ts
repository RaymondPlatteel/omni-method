import {HttpClient, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import {FirebaseStorage, getBytes, getDownloadURL, getStorage, ref} from '@angular/fire/storage';
import {Capacitor, CapacitorHttp, HttpHeaders, HttpOptions} from '@capacitor/core';
import {Observable, from} from 'rxjs';
import {File} from '@awesome-cordova-plugins/file/ngx';
import {Platform} from '@ionic/angular';

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
    private file: File
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
    const storage = getStorage();

    return getDownloadURL(ref(storage, filePath)).then((url) => {
      console.log("return downloadURL", url);
      return url;
    }).catch((err) => {
      console.log("getFileUrl error", err);
      return undefined;
    });
  }

  async uploadFile(f: File) {
    // const path: string;
    // const type = this.getMimeType();
  }

  getMimeType(fileExt: string) {
    if (fileExt == 'wav') return {type: 'audio/wav'};
    else if (fileExt == 'jpg') return {type: 'image/jpg'};
    else if (fileExt == 'mp4') return {type: 'video/mp4'};
    else if (fileExt == 'MOV') return {type: 'video/quicktime'};
  }

}
