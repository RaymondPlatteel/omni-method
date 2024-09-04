import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoReviewPage } from './video-review.page';

describe('VideoReviewPage', () => {
  let component: VideoReviewPage;
  let fixture: ComponentFixture<VideoReviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
