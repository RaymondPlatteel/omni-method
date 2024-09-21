import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoPickerPageRoutingModule } from './video-picker-routing.module';

import { VideoPickerPage } from './video-picker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoPickerPageRoutingModule
  ],
  declarations: [VideoPickerPage]
})
export class VideoPickerPageModule {}
