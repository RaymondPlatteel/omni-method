import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {RankingDetailPage} from './ranking-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RankingDetailPage
  },
  {
    path: 'review',
    title: 'Review',
    loadChildren: () =>
      import('../video-review/video-review.module').then(
        (m) => m.VideoReviewPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankingDetailPageRoutingModule {}
