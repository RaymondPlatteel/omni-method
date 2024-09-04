import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoReviewPage } from './video-review.page';

const routes: Routes = [
  {
    path: '',
    component: VideoReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoReviewPageRoutingModule {}
