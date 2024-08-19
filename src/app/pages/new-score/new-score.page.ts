import {Component, Input, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import {IonModal, LoadingController, ModalController, Platform} from '@ionic/angular';
import {User} from '../../store/user/user.model';
import {UserService} from '../../services/user/user.service';
import {Assessment} from '../../store/assessments/assessment.model';
import {Score} from '../../store/models/score.model';
import {Subscription} from 'rxjs';
import {NumberPickerService} from 'src/app/services/number-picker.service';
import {Pagination} from 'swiper/modules';
import {Swiper} from 'swiper';
import {SwiperOptions} from 'swiper/types';
import {Camera, CameraDirection, CameraResultType, CameraSource} from '@capacitor/camera';
import {StorageService} from 'src/app/services/storage/storage.service';
import {Media, MediaAlbum, MediaAlbumResponse, MediaAlbumType} from '@capacitor-community/media';
import {Filesystem, FilesystemPlugin} from '@capacitor/filesystem';

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
  scoreDate: string;
  // rawScore: number;
  bodyWeight: number;
  numberPickerSubscription: Subscription;
  @ViewChild('videoOption') avatarOptionModal: IonModal;
  public isVideoOptionOpen = false;
  public videoUrl: string;

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private storageService: StorageService,
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

    // subscribe to number picker value update
    // this.numberPickerSubscription = this.numberPickerService.currentValue
    //   .subscribe((val) => this.gotUpdate(val as Score));

    this.platform.ready().then((val) => {
      console.log("platform ready", val);
      document.addEventListener("deviceready", this.onDeviceReady, false);

    });

  }

  onDeviceReady() {
    console.log("deviceready navigator.device.capture", (navigator as any).device?.capture);
  }

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

  // ionViewDidEnter() {
  //   console.log("newScore ionViewDidEnter scoreInput", this.scoreInput);
  //   setTimeout(() => {
  //     console.log("set form focus");
  //     this.scoreInput?.setFocus();
  //   }, 150);
  // }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    console.log('this.assessment.aid: ' + this.assessment.aid);
    console.log('this.user.id: ' + this.user.id);
    console.log('save new score: ', this.newScore);
    this.userService.saveScore(this.newScore);
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

  chooseFromLibrary() {
    // close modal draw
    this.setVideoOptionOpen(false);
    // 
    // this.getVideo(CameraSource.Photos);
    Camera.getLimitedLibraryPhotos().then((photos) => {
      console.log("getLimitedLibraryPhotos", photos.photos);
    })
  }


  takeVideo() {
    Media.getAlbums().then((albums: MediaAlbumResponse) => {
      console.log("albums", albums.albums);
      for (let index = 0; index < albums.albums.length; index++) {
        const album = albums.albums[index];
        console.log(" album name", album.name, ", type", album.type);
        console.log(" identifier", album.identifier);

        // Media.getAlbumsPath(); // Android only
        // Media.getMedias();  // iOS only
        // Media.getMediaByIdentifier(); // iOS only

        // Media.getMediaByIdentifier({identifier: album.identifier}).then((mediaPath) => {
        //   console.log(" mediaPath.path", mediaPath.path);
        // });
      }
    });

    // this.storageService.recordVideo();
  }

  // camera plugin
  getVideo = async (cameraSource: CameraSource) => {
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

}
