import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoPickerPage } from './video-picker.page';

describe('VideoPickerPage', () => {
  let component: VideoPickerPage;
  let fixture: ComponentFixture<VideoPickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
