import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewWorkoutPage } from './new-workout.page';

const routes: Routes = [
  {
    path: '',
    component: NewWorkoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewWorkoutPageRoutingModule {}
