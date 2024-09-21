import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScoreCardComponent } from './score-card.component';

describe('ScoreCardComponent', () => {
  let component: ScoreCardComponent;
  let fixture: ComponentFixture<ScoreCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScoreCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
