import {Component, Input, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import {IonModal, LoadingController, ModalController, Platform} from '@ionic/angular';
import {User} from '../../store/user/user.model';
import {UserService} from '../../services/user/user.service';
import {Assessment} from '../../store/assessments/assessment.model';
import {Score} from '../../store/models/score.model';
import {Subscription} from 'rxjs';
import {Pagination} from 'swiper/modules';
import {Swiper} from 'swiper';
import {SwiperOptions} from 'swiper/types';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {StorageService} from 'src/app/services/storage/storage.service';
import {Media, MediaAlbumResponse, MediaAsset} from '@capacitor-community/media';

@Component({
  selector: 'app-new-score',
  templateUrl: './new-score.page.html',
  styleUrls: ['./new-score.page.scss'],
})
export class NewScorePage implements OnInit, OnDestroy {
  activeField: string = 'score';
  @Input() assessment: Assessment;
  @Input() curScore: Score;
  @ViewChild('inputSwiper', {static: false}) swiperEl;
  private swiper: Swiper;
  private swiperOptions: SwiperOptions;
  private slideToSpeed = 500;
  private fieldNames = ['scoreDate', 'score', 'bodyWeight'];
  public newScore: Score = {} as Score;
  public today = new Date().toISOString();
  public user$ = this.userService.getUser();
  private user: User;
  // scoreDate: string;
  // rawScore: number;
  bodyWeight: number;
  numberPickerSubscription: Subscription;
  @ViewChild('videoOption') avatarOptionModal: IonModal;
  public isVideoOptionOpen = false;
  public videoUrl: string;
  public videoThumbnailPromise: Promise<MediaAsset> = undefined;
  public videoThumbnailUrl: string = undefined;
  public localVideoPath: string = undefined;

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    public storageService: StorageService,
    private platform: Platform
  ) {}

  async ngOnInit() {
    console.log("newScore ngOnInit assessment " + JSON.stringify(this.assessment));
    console.log("newScore ngOnInit curScore " + JSON.stringify(this.curScore));

    await this.user$
      .subscribe((value) => {
        this.user = value;
        console.log("newScore page updated user", this.user);
        this.bodyWeight = this.user.weight;
        this.newScore = {
          aid: this.assessment.aid,
          uid: this.user.id,
          cid: this.assessment.cid,
          rawScore: this.curScore?.rawScore,
          scoreDate: this.today,
          currentWeight: this.bodyWeight,
          expired: false,
          notes: '',
        } as Score;
      }).unsubscribe();

    // this.platform.ready().then((val) => {
    //   console.log("platform ready", val);
    //   document.addEventListener("deviceready", this.onDeviceReady, false);
    // });

  }

  // onDeviceReady() {
  //   console.log("deviceready navigator.device.capture", (navigator as any).device?.capture);
  // }

  ngOnDestroy(): void {
    if (this.numberPickerSubscription) {
      this.numberPickerSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log("timeout begin");
      this.swiperEl?.nativeElement.initialize(Pagination);
      this.swiper = this.swiperEl.nativeElement.swiper;
      // create event listener
      this.swiperEl.nativeElement.addEventListener('swiperslidechange', (event) => {
        this.activate(this.fieldNames[this.swiper.activeIndex]);
      });
      // this.swiperOptions.
      this.activate(this.activeField);
      console.log("timeout done");
    });
  }

  gotUpdate(val: Score) {
    if (Object.keys(val).length > 1 && val.aid === this.assessment.aid) {
      console.log("gotUpdate Score from picker", val);
      this.newScore = val;
      if (this.numberPickerSubscription) {
        this.numberPickerSubscription.unsubscribe();
      }
    }
  }

  activate(tab: string): void {
    console.log("activate", tab);
    this.activeField = tab;
    this.swiper.slideTo(this.fieldNames.indexOf(tab), this.slideToSpeed, false);
  }

  tabClass(tab: string) {
    return (this.activeField === tab ? "active-tab" : "");
  }

  setScore(val) {
    this.newScore.rawScore = val;
  }

  setWeight(val) {
    this.newScore.currentWeight = val;
  }

  setNotes(val) {
    this.newScore.notes = val;
  }

  direction(assessment: Assessment) {
    const reverse = ["PSPR", "AGLTY"];
    if (reverse.includes(assessment.aid)) {
      return -1;
    }
    return 1;
  }

  useDistancePicker(assessment: Assessment): boolean {
    const distancePicker = ["TWOMDST"]; //, "ONEHRDST"];
    if (distancePicker.includes(assessment.aid)) {
      return true;
    }
    return false;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {
    this.userService.saveScoreWithVideo(this.videoThumbnailUrl,
      this.localVideoPath, this.newScore);
    this.dismiss();
  }

  inputMode(assessment: Assessment): string {
    if (assessment.min < 0) {
      return 'text';
    }
    return 'decimal';
  }

  setVideoOptionOpen(isOpen: boolean) {
    console.log("setVideoOptionOpen", isOpen);
    this.isVideoOptionOpen = isOpen;
  }

  onDidDismiss(ev: Event) {
    this.setVideoOptionOpen(false);
  }

  async chooseVideo() {
    if (!await this.checkPermissions()) {
      alert("Access to videos blocked");
    }
    this.videoThumbnailPromise = this.storageService.openVideoPicker();
    console.log("newScorePage videoPicker done", this.videoThumbnailPromise);
    await this.videoThumbnailPromise.then(async (mediaAsset) => {
      console.log("selected video", mediaAsset.identifier);
      // save thumbnail 
      this.videoThumbnailUrl = "data:image/jpeg;base64," + mediaAsset.data;
      // default score date to video creation date
      this.newScore.scoreDate = mediaAsset.creationDate;
      // get video local path
      await Media.getMediaByIdentifier({identifier: mediaAsset.identifier}).then(
        (mediaPath) => {
          console.log("localVideoPath", mediaPath.path);
          this.localVideoPath = mediaPath.path;
        },
        (err) => {
          console.log("getMediaByIdentifile error", err);
          console.log("Unable to get video, ", err);
        }
      );

    })
  }

  // camera plugin
  checkPermissions() {
    console.log("call Camera.checkPermissions");
    return Camera.checkPermissions().then((status) => {
      console.log("Camera.checkPermissions status.camera", status.camera);
      console.log("Camera.checkPermissions status.photos", status.photos);
      switch (status.photos) {
        case 'prompt':
          console.log("Photos state prompt");
          this.requestPermissions();
          break;

        case 'limited':
          console.log("Photos state limited");
          break;

        case 'granted':
          console.log("Photos state granted");
          break;

        case 'denied':
          console.log("Photos state denied");
          alert("Please update settings to allow access to photos and videos from Omni Method");
          return false;
          break;

        default:
          console.log("Photos state unhandled: ", status.photos);
          break;
      }
      return true;
    });
  }

  requestPermissions() {
    console.log("call Camera.requestPermissions");
    Camera.requestPermissions().then((status) => {
      console.log("Camera.requestPermissions status.camera", status.camera);
      console.log("Camera.requestPermissions status.photos", status.photos);
    });
  }

  getLimitedLibraryPhotos() {
    // close modal draw
    this.setVideoOptionOpen(false);
    // 
    // this.getPhoto(CameraSource.Photos);
    Camera.getLimitedLibraryPhotos().then((photos) => {
      console.log("getLimitedLibraryPhotos", photos.photos);
    })
  }

  async getPhoto(cameraSource: CameraSource = CameraSource.Photos) {
    const video = await Camera.getPhoto({
      quality: 50,
      resultType: CameraResultType.DataUrl,
      source: cameraSource
    });
    const loading = await this.loadingCtrl.create();
    await loading.present();
    console.log("picture selected, open editor");
    // this.isEditAvatarOpen = true;
    this.videoUrl = video.dataUrl;
    console.log("videoUrl", this.videoUrl);
  }

  // Media.getAlbumsPath(); // Android only
  // Media.getMedias();  // iOS only
  // Media.getMediaByIdentifier(); // iOS only

  getAlbums() {
    Media.getAlbums().then((albums: MediaAlbumResponse) => {
      // console.log("albums", albums.albums);
      for (let index = 0; index < albums.albums.length; index++) {
        const album = albums.albums[index];
        console.log(" album name", album.name, ", type", album.type, " identifier", album.identifier);
      }

    });
  }

  getMedias() {
    console.log("call Media.getMedias()");
    Media.getMedias({quantity: 3, types: "videos"}).then((medias) => {
      // Media.getMedias({quantity: 1, types: "photos"}).then((medias) => {
      console.log("got medias", medias);
      console.log("medias.medias.length", medias.medias.length);
      console.log("medias.medias[0].location", medias.medias[0].location);
      console.log("medias.medias[0].location", medias.medias[0].fullHeight, ", width", medias.medias[0].fullWidth);
      Media.getMediaByIdentifier({identifier: medias[0].identifier}).then((path) => {
        console.log("video path", path);
      }, (err) => {
        console.log("getMediaByIdentifier error", err);
      });
      console.log("done");
    });

  }


}
