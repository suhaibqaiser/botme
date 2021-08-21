import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {SpeechRecognitionService} from "../../services/speech-recognition.service";

@Component({
  selector: 'app-speech-recognition-section',
  templateUrl: './speech-recognition-section.component.html',
  styleUrls: ['./speech-recognition-section.component.scss']
})
export class SpeechRecognitionSectionComponent implements OnInit {
  isRecording = false;
  recordedTime: any
  blobUrl: any

  constructor(private audioRecordingService: SpeechRecognitionService, private sanitizer: DomSanitizer) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      console.log('this.blobUrl =>',this.blobUrl)
    });
  }

  ngOnInit(): void {
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

}
