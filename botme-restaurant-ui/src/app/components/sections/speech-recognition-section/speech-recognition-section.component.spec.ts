import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechRecognitionSectionComponent } from './speech-recognition-section.component';

describe('SpeechRecognitionSectionComponent', () => {
  let component: SpeechRecognitionSectionComponent;
  let fixture: ComponentFixture<SpeechRecognitionSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeechRecognitionSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechRecognitionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
