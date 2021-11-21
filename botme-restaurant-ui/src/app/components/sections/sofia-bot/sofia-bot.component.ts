import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { SpeechService } from "../../../services/speech.service";

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
  voice: any

  constructor(private speechService: SpeechService, private socketService: SocketService) {
    this.speechService.recording.subscribe((state) => {
      this.isRecording = state;
    });
    this.socketService.messages.subscribe((message: any) => {
      this.voice = message.voice;
    });
  }

  ngOnInit(): void {
  }

  startRecording() {
    console.log('start recording')
    this.closeChatModal = false
    this.text = ''
    if (!this.isRecording) {
      this.speechService.startRecording();
    } else {
      this.stopRecording()
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.speechService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.speechService.stopRecording();
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
