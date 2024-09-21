import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoPickerPage } from './video-picker.page';

const routes: Routes = [
  {
    path: '',
    component: VideoPickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoPickerPageRoutingModule {}
