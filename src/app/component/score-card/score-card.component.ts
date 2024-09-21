import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {IonCard, IonItem, IonImg, IonButton, IonIcon, IonLabel} from "@ionic/angular/standalone";
import {Assessment} from 'src/app/store/assessments/assessment.model';
import {Score} from 'src/app/store/models/score.model';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ScoreCardComponent implements OnInit {
  @Input() showVideo = false;
  @Input() assessment: Assessment = undefined;
  @Input() score: Score = undefined;
  @Input() buttonIcon: string;
  @Output() thumbnailClicked = new EventEmitter<Score>();
  @Output() cardClicked = new EventEmitter<Score>();

  constructor() {}

  ngOnInit() {}

  cardClick() {
    this.cardClicked.emit(this.score);
  }

  thumbnailClick(e) {
    e.stopPropagation();
    this.thumbnailClicked.emit(this.score);
  }

}
