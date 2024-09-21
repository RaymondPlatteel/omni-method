import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { SwiperOptions } from 'swiper/types';
import { Router } from '@angular/router'; // Add this import

interface Workout {
  id: string;
  date: Date;
  name: string;
  exercises: Exercise[];
  sections: Section[];
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Set {
  reps: number;
  weight: number;
  isCompleted: boolean;
}

interface Section {
  id: string;
  name: string;
  exercises: Exercise[];
}

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {
  currentDate: Date = new Date();

  @ViewChild('trainingSwiper', { read: ElementRef, static: false }) trainingSwiper?: ElementRef;

  public trainingSlidesOptions: SwiperOptions = {
    slidesPerView: 1.2,
    navigation: true,
    slidesOffsetBefore: 5,
    spaceBetween: 10,
    slidesOffsetAfter: 5,
  };

  buttonList = [
    { label: 'Workout Log', class: 'blue-button', action: () => this.navigateToWorkoutLog() },
    { label: 'Goals', class: 'green-button' }
  ];

  workouts: Workout[] = [];
  currentWorkout: Workout | null = null;
  viewingWorkout: Workout | null = null;

  constructor(private alertController: AlertController, private actionSheetController: ActionSheetController, private router: Router) {}

  ngOnInit() {
    // Remove or comment out the automatic workout start
    // this.startNewWorkout();
  }

  startNewWorkout() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    this.currentWorkout = {
      id: Date.now().toString(),
      date: today,
      name: formattedDate,
      exercises: [],
      sections: [{
        id: Date.now().toString(),
        name: 'Resistance', // Default section name
        exercises: []
      }]
    };
  }

  async editWorkoutName() {
    const alert = await this.alertController.create({
      header: 'Edit Workout Name',
      inputs: [
        {
          name: 'workoutName',
          type: 'text',
          value: this.currentWorkout?.name,
          placeholder: 'Workout Name'
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
            if (this.currentWorkout && data.workoutName) {
              this.currentWorkout.name = data.workoutName;
            }
          }
        }
      ]
    });

    await alert.present();
  }
s
  async addExercise(section?: Section) {
    if (this.currentWorkout) {
      const target = section ? section.exercises : this.currentWorkout.exercises;
      await this.addExerciseToTarget(target);
    }
  }

  async addExerciseToSection(section: Section) {
    await this.addExerciseToTarget(section.exercises);
  }

  private async addExerciseToTarget(target: Exercise[]) {
    const alert = await this.alertController.create({
      header: 'Add Exercise',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Exercise Name'
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Add',
          handler: (data) => {
            if (data.name) {
              target.push({
                id: Date.now().toString(),
                name: data.name,
                sets: [{reps: null, weight: null, isCompleted: false}]
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  addSet(exercise: Exercise) {
    exercise.sets.push({reps: null, weight: null, isCompleted: false});
  }

  deleteSet(exercise: Exercise, index: number) {
    exercise.sets.splice(index, 1);
    if (exercise.sets.length === 0) {
      this.addSet(exercise); // Ensure there's always at least one set
    }
  }

  saveWorkout() {
    if (this.currentWorkout) {
      this.workouts.push(this.currentWorkout);
      // Save to storage (implement this later)
      this.currentWorkout = null;
    }
  }

  viewWorkout(workout: Workout) {
    this.viewingWorkout = workout;
  }

  closeWorkoutView() {
    this.viewingWorkout = null;
  }

  async commingSoon(feature: string) {
    const alert = await this.alertController.create({
      header: feature,
      message: 'Coming Soon',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Workout Options',
      buttons: [
        {
          text: 'Edit Workout Name',
          icon: 'pencil',
          handler: () => {
            this.editWorkoutName();
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

  async presentExerciseOptions(exercise: Exercise) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Exercise Options',
      buttons: [
        {
          text: 'Edit Name',
          icon: 'pencil',
          handler: () => {
            this.editExerciseName(exercise);
          }
        },
        {
          text: 'Delete Exercise',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.deleteExercise(exercise);
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

  async editExerciseName(exercise: Exercise) {
    const alert = await this.alertController.create({
      header: 'Edit Exercise Name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: exercise.name,
          placeholder: 'Enter exercise name'
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
            if (data.name) {
              exercise.name = data.name;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  deleteExercise(exercise: Exercise) {
    const index = this.currentWorkout?.exercises.indexOf(exercise);
    if (index > -1) {
      this.currentWorkout?.exercises.splice(index, 1);
    }
  }

  async addSection() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Section Type',
      buttons: [
        {
          text: 'Resistance',
          handler: () => this.createSection('Resistance')
        },
        {
          text: 'Cardio',
          handler: () => this.createSection('Cardio')
        },
        {
          text: 'Flexibility',
          handler: () => this.createSection('Flexibility')
        },
        {
          text: 'Other',
          handler: () => this.createSection('Other')
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  private createSection(type: string) {
    if (this.currentWorkout) {
      this.currentWorkout.sections.push({
        id: Date.now().toString(),
        name: type,
        exercises: []
      });
    }
  }

  async presentSectionOptions(section: Section) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Section Options',
      buttons: [
        {
          text: 'Rename',
          icon: 'create',
          handler: () => {
            this.renameSection(section);
          }
        },
        {
          text: 'Delete',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.deleteSection(section);
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

  async renameSection(section: Section) {
    const alert = await this.alertController.create({
      header: 'Rename Section',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: section.name,
          placeholder: 'Section Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Rename',
          handler: (data) => {
            if (data.name) {
              section.name = data.name;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  deleteSection(section: Section) {
    const index = this.currentWorkout.sections.indexOf(section);
    if (index > -1) {
      this.currentWorkout.sections.splice(index, 1);
    }
  }

  navigateToWorkoutLog() {
    this.router.navigate(['/workout-log']);
  }
}
