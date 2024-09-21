import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface AccordionItem {
  expanded: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.page.html',
  styleUrls: ['./workout-log.page.scss'],
})
export class WorkoutLogPage implements OnInit {
  workoutHistory: AccordionItem[] = [
    { date: 'Today', workout: 'Chest and Triceps', expanded: false },
    { date: 'Yesterday', workout: 'Back and Biceps', expanded: false },
    { date: '2 days ago', workout: 'Legs', expanded: false },
  ];

  workoutTemplates: AccordionItem[] = [
    { name: 'Full Body Workout', description: 'A comprehensive full body routine', expanded: false },
    { name: 'Upper Body Focus', description: 'Targets chest, back, shoulders, and arms', expanded: false },
    { name: 'Lower Body Power', description: 'Emphasizes squats, deadlifts, and leg presses', expanded: false },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  toggleItem(item: AccordionItem) {
    item.expanded = !item.expanded;
  }

  addNewWorkout() {
    this.router.navigate(['/new-workout']);
  }
}
