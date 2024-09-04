import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoReviewPageRoutingModule } from './video-review-routing.module';

import { VideoReviewPage } from './video-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoReviewPageRoutingModule
  ],
  declarations: [VideoReviewPage]
})
export class VideoReviewPageModule {}
