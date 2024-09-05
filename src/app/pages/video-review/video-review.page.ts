import {LocationStrategy} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CommunityService} from '../../services/community/community.service';
import {User} from '../../store/user/user.model';
import {Score} from '../../store/models/score.model';
import {Assessment} from '../../store/assessments/assessment.model';
import {AssessmentService} from 'src/app/services/assessments/assessment.service';

@Component({
  selector: 'app-video-review',
  templateUrl: './video-review.page.html',
  styleUrls: ['./video-review.page.scss']
})
export class VideoReviewPage implements OnInit {
  private uid: string;
  private aid: string;
  public user$: Observable<User>;
  public curScore$: Observable<Score>;
  public assessment$: Observable<Assessment>;

  constructor(
    private route: ActivatedRoute,
    private locationStrategy: LocationStrategy,
    private communityService: CommunityService,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log("videoReviewPage.ngOnInit", params);
      this.uid = params.uid;
      this.aid = params.aid;
      // read score object from ngrx store
      this.curScore$ = this.communityService.getSelectedScore(this.aid);
      this.assessment$ = this.assessmentService.getAssessmentById(this.aid);
    });
    this.user$ = this.communityService.getSelectedUser();
  }

  goBack() {
    // this.navController.navigateBack('/home/profile');
    this.locationStrategy.back();
  }
}
