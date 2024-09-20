import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewWorkoutPage } from './new-workout.page';

describe('NewWorkoutPage', () => {
  let component: NewWorkoutPage;
  let fixture: ComponentFixture<NewWorkoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWorkoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
