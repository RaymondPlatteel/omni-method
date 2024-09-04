import {LocationStrategy} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-video-review',
  templateUrl: './video-review.page.html',
  styleUrls: ['./video-review.page.scss'],
})
export class VideoReviewPage implements OnInit {

  constructor(
    private locationStrategy: LocationStrategy
    // private navController: NavController
  ) {}

  ngOnInit() {
  }

  goBack() {
    // this.navController.navigateBack('/home/profile');
    this.locationStrategy.back();
  }
}
