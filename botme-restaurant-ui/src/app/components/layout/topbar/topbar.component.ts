import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {SpeechRecognitionService} from "../../services/speech-recognition.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  isRecording = false;
  recordedTime: any
  blobUrl: any
  blobData: any
  text: any
  loader: any

  constructor(private audioRecordingService: SpeechRecognitionService, private sanitizer: DomSanitizer) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe(data => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.blobData = data.blob
      console.log('subscribe =>', this.blobData)
    });

  }

  ngOnInit(): void {
  }

  startRecording() {
    console.log('start recording')
    this.text = ''
    if (!this.isRecording) {
      this.isRecording = true;
      console.log('started')
      this.audioRecordingService.startRecording();
      console.log('end')
    }
    console.log('stop')
     setTimeout(() => {
      console.log('stoping recording')
      this.stopRecording()
    }, 5000)
    setTimeout(() => {
      console.log('sending data')
      this.sendData()
    }, 6000)
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

  sendData() {
    this.loader = true
    const formData = new FormData()
    console.log(this.blobData)
    formData.append('file', this.blobData)
    this.audioRecordingService.getTextFromSpeech(formData).subscribe(
      (res: any) => {
        this.loader = false
        if (res.status) {
          this.text = res.data
        } else {
          this.text = 'Failed to get response'
        }
      }
    )
  }
}
