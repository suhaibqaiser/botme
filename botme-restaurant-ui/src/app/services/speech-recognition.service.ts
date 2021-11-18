import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
import * as hark from 'hark'

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private stream: any
  private recorder: any
  private speechEvents: any
  private isRecording = new Subject<boolean>();
  private isrecording: boolean = false
  recording = this.isRecording.asObservable();

  constructor(private socketService: SocketService) {
    this.recording.subscribe(data => {
      this.isrecording = data
    })

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.stream = stream;
    }).catch(error => {
      console.log(error);
    });
  }

  startRecording() {
    if (this.recorder) { return }
    this.record();
    this.speechEvents = hark(this.stream, {})
    this.speechEvents.on('speaking', () => {
      console.log('speaking!');
      this.record();
    });

    this.speechEvents.on('stopped_speaking', () => {
      console.log('stopped_speaking!');
      if (this.isrecording) {
        this.stopRecording()

      }
    });

  }

  record() {
    if (!this.isrecording) {
      this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm;codecs=pcm',
        numberOfAudioChannels: 1,
        disableLogs: true,
        timeSlice: 500,
        desiredSampRate: 16000,
        // ondataavailable: (blob: any) => {
        //   _socketService.sendMessage("voice", blob)
        // }
      });
      this.recorder.record();
      this.isRecording.next(true);
    }
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop((blob: any) => {
        //this.stopMedia();
        this.socketService.sendMessage('voice', blob)
        this.isRecording.next(false);
      }, () => {
        this.stopMedia();
      });
    }
  }

  abortRecording() {
    this.stopMedia();
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      if (this.stream) {
        this.stream = null;
      }
    }
  }

}
