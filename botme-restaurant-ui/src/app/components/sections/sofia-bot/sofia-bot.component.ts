import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
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
  speechEnabled: boolean = false;
  pageContext: string = ""



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


  updateInteractionState() {
    this.speechService.speechEnabled.next(this.speechEnabled)
    if (this.speechEnabled) {
      this.startRecording(this.socketService.currentContextObj.pageId)
    } else {
      this.speechService.abortRecording();
    }
  }


  startRecording(pageId: string) {
    console.log('start recording')
    this.closeChatModal = false
    this.text = ''
    if (!this.isRecording) {
      this.speechService.startRecording(pageId);
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
