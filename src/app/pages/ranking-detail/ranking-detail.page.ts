import {Component, OnInit, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {filter, map, take, tap} from 'rxjs/operators';
import {AssessmentService} from 'src/app/services/assessments/assessment.service';
import {CommunityService} from '../../services/community/community.service';
import {OmniScoreService} from '../../services/omni-score.service';
import {Assessment} from '../../store/assessments/assessment.model';
import {Score} from '../../store/models/score.model';
import {Analytics, logEvent} from '@angular/fire/analytics';
import {UserService} from '../../services/user/user.service';
import {Browser} from '@capacitor/browser';
import {LocationStrategy} from '@angular/common';

@Component({
  selector: 'app-ranking-detail',
  templateUrl: './ranking-detail.page.html',
  styleUrls: ['./ranking-detail.page.scss'],
})
export class RankingDetailPage implements OnInit {
  private analytics: Analytics = inject(Analytics);
  private curUser$ = this.userService.getUser();
  public athlete$ = this.communityService.getSelectedUser();
  public categories$ = this.assessmentService.getAllCategories();
  public assessments$ = this.assessmentService.getAllAssessments();
  public isLoading$ = this.communityService.isLoading();
  public scores$ = this.communityService.getSelectedUserScores();
  // showChart = false; // toggle chart in profile header
  showVideo = false;

  constructor(
    private assessmentService: AssessmentService,
    private communityService: CommunityService,
    private navController: NavController,
    private userService: UserService,
    private router: Router,
  ) {}

  async ngOnInit() {
    console.log("RankingDetailPage.ngOnInit athlete$", this.athlete$);
    this.athlete$
      .pipe(filter(usr => usr !== undefined))
      .pipe(take(1))
      .subscribe(athlete => {
        console.log("view athlete", athlete.username);
        // log analytics event
        logEvent(this.analytics, "view_athlete", {username: athlete.username})
      });
    this.curUser$.subscribe((usr) => {
      this.showVideo = UserService.getAge(usr) >= 13;
    })
  }

  getCategoryAssessments(assessments: Assessment[], cid: string) {
    return assessments.filter(a => a.cid === cid);
  }

  scoreClass(scoreDate: string): string {
    // removed expired style on community tab for now
    // return OmniScoreService.scoreClass(scoreDate);
    return;
  }

  getScore(scores: Score[], aid: string) {
    let fl = scores?.filter(sc => sc.aid === aid).sort(function (a, b) {
      return Date.parse(b.scoreDate) - Date.parse(a.scoreDate);
    });
    return (fl?.length > 0) ? fl[0] : undefined;
  }

  goBack() {
    this.navController.navigateBack('/home/community');
    // this.navController.back();
  }

  async reviewVideo(s: Score) {
    if (this.showVideo && s.videoUrl) {
      console.log("rankingDetail playVideo", s.videoUrl);
      // await Browser.open({url: s.videoUrl});
      this.router.navigate(['/home/community/athlete/review']);
    }
  }

}