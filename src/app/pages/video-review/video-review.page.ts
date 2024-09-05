import {LocationStrategy} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {from, Observable} from 'rxjs';
import {CommunityService} from '../../services/community/community.service';
import {User} from '../../store/user/user.model';
import {UserAvatarComponent} from 'src/app/component/user-avatar/user-avatar.component';
import {Score} from 'src/app/store/models/score.model';
import {UserFirestoreService} from 'src/app/services/user-firestore.service';

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

  constructor(
    private route: ActivatedRoute,
    private locationStrategy: LocationStrategy,
    private communityService: CommunityService,
    private userFirestoreService: UserFirestoreService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log("videoReviewPage.ngOnInit", params);
      this.uid = params.uid;
      this.aid = params.aid;
      // this.category$ = this.assessmentService.getCategoryById(params.cid);
      // this.assessment$ = this.assessmentService.getAssessmentById(params.aid);
      // this.checklist$ = this.assessmentService.getChecklist(params.aid);
      // this.routerOutlet.swipeGesture = true;
      this.curScore$ = from(this.userFirestoreService.getUserAssessmentScore(this.uid, this.aid));
    });
    this.user$ = this.communityService.getSelectedUser();
  }

  goBack() {
    // this.navController.navigateBack('/home/profile');
    this.locationStrategy.back();
  }
}
