import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NewWorkoutPageRoutingModule } from './new-workout-routing.module';

import { NewWorkoutPage } from './new-workout.page';
import { WorkoutSegmentCardComponent } from '../../component/workout-segment-card/workout-segment-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  // Add this line
    IonicModule,
    NewWorkoutPageRoutingModule
  ],
  declarations: [NewWorkoutPage, WorkoutSegmentCardComponent]
})
export class NewWorkoutPageModule {}
