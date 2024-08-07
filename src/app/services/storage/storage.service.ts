import {HttpClient, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FirebaseApp} from '@angular/fire/app';
import {FirebaseStorage, getBytes, getDownloadURL, getStorage, ref} from '@angular/fire/storage';
import {Capacitor, CapacitorHttp, HttpHeaders, HttpOptions} from '@capacitor/core';
import {Observable, from} from 'rxjs';

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
    private http: HttpClient
    // private afStorage: AngularFireS
  ) {
    this.storage = getStorage();
  }

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
      // console.log("getDownloadURL json");
      // const jsonResp = getDownloadURL(fileRef).then((url) => {
      //   console.log("json URL", url);
      //   this.http.get(url).subscribe((resp) => {
      //     console.log("jsonResp", jsonResp);
      //     this.getUrls(jsonResp);
      //     return jsonResp;
      //   },
      //     (err) => {
      //       console.log("http get error", err);
      //       return undefined;
      //     })
      // }).catch((err) => {
      //   console.log("getDownloadURL error", err);
      //   return undefined;
      // })
      return undefined;
    });
    return resp;

    // getDownloadURL(fileRef).then((url) => {
    //   console.log("got url", url);

    // retrieve with Angular HttpClient (CORS error)
    // this.http.get(url).subscribe((resp) => {
    //   console.log("get url response", resp);
    // });

    // read directly (CORS error)
    // const xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    // xhr.onload = (event) => {
    //   console.log("onload event", event);
    //   const blob = xhr.response;
    //   console.log("blob", blob);
    // };
    // xhr.open('GET', url);
    // xhr.send();

    // firebase api (CORS error)
    // getBytes(fileRef).then((resp) => {
    //   console.log("getBytes response", resp);
    //   var enc = new TextDecoder("utf-8");
    //   const obj: Object = JSON.parse(enc.decode(resp));
    //   console.log("resp obj", obj);
    //   return obj;
    // }).catch((err) => {
    //   console.log("getBytes error", err);
    //   return undefined;
    // });

    // capacitor http client (empy response)
    // const headers: HttpHeaders = {
    //   'Access-Control-Allow-Origin': '*'
    // };
    // const options: HttpOptions = {
    //   url: url,
    //   method: "GET",
    //   headers: headers,
    //   responseType: "json",
    //   readTimeout: 2000,
    //   connectTimeout: 2000,
    //   webFetchExtra: {
    //     mode: "no-cors"
    //   }
    // };
    // console.log("CapacitorHttp get...");
    // CapacitorHttp.get(options).then((resp) => {
    //   console.log("response.status", resp.status);
    //   console.log("response.data", resp.data);
    //   console.log("response.url", resp.url);
    //   console.log("response.headers", resp.headers);
    // }).catch((err) => {
    //   console.log("CapacitorHttp get error", err);
    // });

    // }).catch((err) => {
    //   console.log("getAnnouncements error", err);
    // });

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

}
