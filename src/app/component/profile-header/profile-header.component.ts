import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {IonAccordionGroup, IonicModule} from '@ionic/angular';
import {Observable, of, take} from 'rxjs';
import {User} from '../../store/user/user.model';
import {UserAvatarComponent} from '../user-avatar/user-avatar.component';
import {UserService} from 'src/app/services/user/user.service';
import {CategoryChartComponent} from '../category-chart/category-chart.component';
import {AssessmentChartComponent} from '../assessment-chart/assessment-chart.component';
import {SwiperOptions} from 'swiper/types';
import {Pagination} from 'swiper/modules';
import {Score} from 'src/app/store/models/score.model';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    UserAvatarComponent,
    CategoryChartComponent,
    AssessmentChartComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileHeaderComponent implements OnInit {
  @Input() background: any;
  @ViewChild('swiper', {static: false}) swiper;
  @Input() athlete$: Observable<User>;
  @Input() scores$: Observable<Score[]>;
  public user$: Observable<User>;
  showChart = false;
  showPersonalData = false;

  public chartSlidesOptions: SwiperOptions = {
    slidesPerView: 1,
  };

  constructor(
    public userService: UserService,
    public element: ElementRef,
    public renderer: Renderer2
  ) {}

  ngOnInit() {
    //   this.user$ = this.store.select(UserSelectors.selectUser); //.pipe(delay(5000));
    this.athlete$.pipe(take(1)).subscribe((dsplUser) => {
      this.userService.getUser().pipe(take(1)).subscribe((curUser) => {
        this.showPersonalData = (dsplUser.id === curUser.id);
      })
    })
    this.user$ = this.athlete$;
    console.log("profile header ngOnInit scores$", this.scores$);
  }


  ngAfterViewInit() {
    console.log("set background", this.background);
    console.log("element", this.element);
    this.renderer.setStyle(this.element.nativeElement, 'background', this.background);
    console.log("ngAfterViewInit setTimeout");
    setTimeout(() => {
      console.log("timeout begin");
      this.swiper?.nativeElement.initialize(Pagination);
      console.log("timeout done");
    });
    console.log("ngAfterViewInit done");
  }

  toggleAccordion(event) {
    this.showChart = !this.showChart;
  }

}
