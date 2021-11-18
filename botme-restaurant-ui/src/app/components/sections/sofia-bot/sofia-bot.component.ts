import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpeechRecognitionService } from "../../../services/speech-recognition.service";
import { SocketService } from "../../../services/socket.service";

@Component({
  selector: 'app-sofia-bot',
  templateUrl: './sofia-bot.component.html',
  styleUrls: ['./sofia-bot.component.scss']
})
export class SofiaBotComponent implements OnInit {
  isRecording = false;
  recordedTime: any
  blobUrl: any
  blobData: any
  text: any
  loader: any
  closeChatModal = true

  constructor(private audioRecordingService: SpeechRecognitionService) {
    this.audioRecordingService.recording.subscribe((state) => {
      this.isRecording = state;
    });
  }

  ngOnInit(): void {
  }

  startRecording() {
    console.log('start recording')
    this.closeChatModal = false
    this.text = ''
    if (!this.isRecording) {
      this.audioRecordingService.startRecording();
    } else {
      this.stopRecording()
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  close() {
    this.closeChatModal = true
  }
}
