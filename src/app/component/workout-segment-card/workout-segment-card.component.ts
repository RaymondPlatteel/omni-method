import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

export enum SegmentType {
  Resistance = 'resistance',
  Cardio = 'cardio',
  // Add more types as needed
}

export interface SetLog {
  set?: number;
  reps?: number | null;
  weight?: number | null;
  done: boolean;
  duration?: number | null;
  speed?: number | null;
}

@Component({
  selector: 'app-workout-segment-card',
  templateUrl: './workout-segment-card.component.html',
  styleUrls: ['./workout-segment-card.component.scss'],
})
export class WorkoutSegmentCardComponent {
  @Input() title: string = 'Workout Segment';
  @Input() headerColor: string = '#3880ff';
  @Input() type: SegmentType = SegmentType.Resistance;
  @Output() delete = new EventEmitter<void>();
  @Output() updateTitle = new EventEmitter<string>();
  @Output() updateType = new EventEmitter<SegmentType>();
  @Output() updateColor = new EventEmitter<string>();

  // Properties for resistance type
  sets: number = 3;
  reps: number = 10;
  resistance: number = 0;
  rpe: number = 0;
  rir: number = 0;

  // Properties for cardio type
  duration: number = 0;
  speed: number = 0;

  SegmentType = SegmentType; // Make enum available in template

  setLogs: SetLog[] = [];

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {
    this.initializeSetLogs();
  }

  private initializeSetLogs() {
    this.setLogs = this._type === SegmentType.Resistance
      ? [{ set: 1, reps: null, weight: null, done: false }]
      : [{ duration: null, speed: null, done: false }];
  }

  @Input() set segmentType(value: SegmentType) {
    this._type = value;
    this.initializeSetLogs();
  }
  get segmentType(): SegmentType {
    return this._type;
  }
  private _type: SegmentType = SegmentType.Resistance;

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Segment Options',
      buttons: [
        {
          text: 'Edit Name',
          icon: 'create-outline',
          handler: () => {
            this.editName();
          }
        },
        {
          text: 'Change Type',
          icon: 'fitness-outline',
          handler: () => {
            this.changeType();
          }
        },
        {
          text: 'Change Color',
          icon: 'color-palette-outline',
          handler: () => {
            this.changeColor();
          }
        },
        {
          text: 'Delete',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.confirmDelete();
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

  private async editName() {
    const alert = await this.alertController.create({
      header: 'Edit Segment Name',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Enter new name',
          value: this.title
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
            if (data.title) {
              this.updateTitle.emit(data.title);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  private async changeType() {
    if (this.hasData()) {
      const alert = await this.alertController.create({
        header: 'Warning',
        message: 'Changing the segment type will delete all existing data. Are you sure you want to continue?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Continue',
            handler: () => {
              this.showTypeSelectionActionSheet();
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.showTypeSelectionActionSheet();
    }
  }

  private async showTypeSelectionActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Segment Type',
      buttons: [
        {
          text: 'Resistance',
          handler: () => {
            this.updateType.emit(SegmentType.Resistance);
            this.type = SegmentType.Resistance;
            this.initializeSetLogs();
          }
        },
        {
          text: 'Cardio',
          handler: () => {
            this.updateType.emit(SegmentType.Cardio);
            this.type = SegmentType.Cardio;
            this.initializeSetLogs();
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

  private async changeColor() {
    const colors = ['#3880ff', '#eb445a', '#2dd36f', '#ffc409', '#92949c'];
    const buttons = colors.map(color => ({
      text: color,
      handler: () => {
        this.updateColor.emit(color);
      }
    }));

    const actionSheet = await this.actionSheetController.create({
      header: 'Select Color',
      buttons: [
        ...buttons,
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  addSet() {
    if (this.type === SegmentType.Resistance) {
      const lastSet = this.setLogs[this.setLogs.length - 1];
      const newSet = {
        set: this.setLogs.length + 1,
        reps: lastSet.reps,
        weight: lastSet.weight,
        done: false
      };
      this.setLogs.push(newSet);
    } else {
      this.setLogs.push({ duration: null, speed: null, done: false });
    }
  }

  updateFutureSets(index: number) {
    if (this.type !== SegmentType.Resistance) return;

    const currentSet = this.setLogs[index];
    for (let i = index + 1; i < this.setLogs.length; i++) {
      if (currentSet.reps !== null) {
        this.setLogs[i].reps = currentSet.reps;
      }
      if (currentSet.weight !== null) {
        this.setLogs[i].weight = currentSet.weight;
      }
    }
  }

  toggleSetDone(set: SetLog) {
    set.done = !set.done;
  }

  removeSet(index: number) {
    this.setLogs.splice(index, 1);
    // Recalculate set numbers
    this.setLogs.forEach((set, i) => set.set = i + 1);
  }

  private hasData(): boolean {
    return this.setLogs.some(log => 
      (log.reps !== null && log.reps !== undefined) || 
      (log.weight !== null && log.weight !== undefined) ||
      (log.duration !== null && log.duration !== undefined) ||
      (log.speed !== null && log.speed !== undefined) ||
      log.done
    );
  }

  private async confirmDelete() {
    if (this.hasData()) {
      const alert = await this.alertController.create({
        header: 'Confirm Deletion',
        message: 'This action will delete all data in this segment. Are you sure you want to continue?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Delete',
            handler: () => {
              this.delete.emit();
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.delete.emit();
    }
  }
}