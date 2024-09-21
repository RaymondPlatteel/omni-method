import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { IonContent, ActionSheetController, AlertController } from '@ionic/angular';
import { SegmentType } from '../../component/workout-segment-card/workout-segment-card.component';
import { interval, Subscription } from 'rxjs';

// Remove the import of WorkoutSegmentCard

@Component({
  selector: 'app-new-workout',
  templateUrl: './new-workout.page.html',
  styleUrls: ['./new-workout.page.scss'],
})
export class NewWorkoutPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  currentDate: string;
  workoutDuration: string = 'In Progress: 00:00';
  titleHeight: number = 200; // Initial height
  titleOffset: number = 0;
  workoutSegments: Array<{title: string, type: SegmentType, color: string, exerciseName: string}> = [
    {title: 'Warmup', type: SegmentType.Resistance, color: '#3880ff', exerciseName: ''},
    {title: 'Resistance', type: SegmentType.Resistance, color: '#3dc2ff', exerciseName: ''},
    {title: 'Cooldown', type: SegmentType.Resistance, color: '#5260ff', exerciseName: ''}
  ];
  maxTitleHeight: number = 250; // New property for maximum title height
  workoutTitle: string = 'New Workout'; // Add this line
  exerciseNotes: string = ''; // Add this line
  workoutStartTime: number | null = null;
  timerSubscription: Subscription | null = null;

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {
    this.currentDate = new Date().toLocaleDateString();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // Ensure the content is properly initialized
    if (this.content) {
      this.content.scrollEvents = true;
    }
  }

  ionViewDidEnter() {
    this.startWorkout();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onScroll(event: CustomEvent) {
    const scrollTop = event.detail.scrollTop;
    console.log('Scroll position:', scrollTop); // Add this line for debugging
    
    if (scrollTop < 0) {
      // Overscroll effect with maximum height limit
      this.titleOffset = Math.min(-scrollTop / 2, 50);
      this.titleHeight = Math.min(this.maxTitleHeight, 200 + this.titleOffset);
    } else if (scrollTop < 100) {
      // Shrink title until it reaches minimum size
      this.titleOffset = 0;
      this.titleHeight = Math.max(100, 200 - scrollTop);
    } else {
      // Keep title at minimum size and allow scrolling
      this.titleHeight = 100;
    }
  }

  onIonScrollEnd() {
    if (this.titleOffset > 0) {
      // Animate back to original position
      this.content.scrollToTop(300);
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Workout Options',
      buttons: [
        {
          text: 'Add Workout Module',
          handler: () => {
            this.addWorkoutModule();
          }
        },
        {
          text: 'Finish Workout',
          handler: () => {
            this.finishWorkout();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async addWorkoutModule() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Workout Type',
      buttons: [
        {
          text: 'Resistance',
          handler: () => this.createWorkoutSegment('Resistance')
        },
        {
          text: 'Cardio',
          handler: () => this.createWorkoutSegment('Cardio')
        },
        {
          text: 'Flexibility',
          handler: () => this.createWorkoutSegment('Flexibility')
        },
        {
          text: 'Other',
          handler: () => this.createWorkoutSegment('Other')
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  createWorkoutSegment(type: string) {
    this.workoutSegments.push({
      title: type, 
      type: type === 'Cardio' ? SegmentType.Cardio : SegmentType.Resistance, 
      color: '#3880ff',
      exerciseName: ''
    });
  }

  deleteWorkoutSegment(index: number) {
    this.workoutSegments.splice(index, 1);
  }

  updateSegmentTitle(index: number, newTitle: string) {
    this.workoutSegments[index].title = newTitle;
  }

  updateSegmentType(index: number, newType: SegmentType) {
    this.workoutSegments[index].type = newType;
  }

  updateSegmentColor(index: number, newColor: string) {
    this.workoutSegments[index].color = newColor;
  }

  finishWorkout() {
    console.log('Finishing workout');
    console.log('Workout segments:', this.workoutSegments);
    // Implement the logic to finish the workout
  }

  async showWorkoutMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Workout Options',
      buttons: [
        {
          text: 'Edit Title',
          icon: 'create-outline',
          handler: () => {
            this.editWorkoutTitle();
          }
        },
        {
          text: 'Exercise Notes',
          icon: 'document-text-outline',
          handler: () => {
            this.editExerciseNotes();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async editWorkoutTitle() {
    // Implement the logic to edit the workout title
    const alert = await this.alertController.create({
      header: 'Edit Workout Title',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Enter new title',
          value: this.workoutTitle
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            if (data.title.trim() !== '') {
              this.workoutTitle = data.title.trim();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editExerciseNotes() {
    const alert = await this.alertController.create({
      header: 'Exercise Notes',
      inputs: [
        {
          name: 'notes',
          type: 'textarea',
          placeholder: 'Enter exercise notes',
          value: this.exerciseNotes
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            this.exerciseNotes = data.notes.trim();
          }
        }
      ]
    });

    await alert.present();
  }

  startWorkout() {
    if (!this.workoutStartTime) {
      this.workoutStartTime = Date.now();
      this.timerSubscription = interval(1000).subscribe(() => {
        this.updateDuration();
      });
    }
  }

  updateDuration() {
    if (this.workoutStartTime) {
      const duration = Math.floor((Date.now() - this.workoutStartTime) / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      this.workoutDuration = `In Progress: ${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
    }
  }

  padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
