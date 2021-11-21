import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
import * as hark from 'hark'
@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  private stream: any
  private recorder: any
  private speechEvents: any
  private isRecording = new Subject<boolean>();
  private isrecording: boolean = false
  private selectedRate: number = 1;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private voiceWelcomeMessage = "Welcome to the interactive online shop experience. Start your order by saying something like. I want to make a reservation!"
  private voiceEndingMessage = "Handing the controls over to you. Happy Ordering!"
  speechText = new Subject<string>()
  speechEnabled = new Subject<boolean>();
  recording = this.isRecording.asObservable();

  constructor(private socketService: SocketService) {
    this.recording.subscribe(data => {
      this.isrecording = data
    })

    this.speechEnabled.subscribe(data => {
      console.log(data)
    })

    socketService.messages.subscribe((text: any) => {
      console.log(text.text);
      this.speak(text.text);
    })

    if (!this.voices.length) {
      speechSynthesis.addEventListener(
        "voiceschanged",
        () => {
          this.voices = speechSynthesis.getVoices();
          this.selectedVoice = (this.voices[2] || null);
        }
      );
    }

    // this.socketService.processing = true

  }

  public speak(speechText: string): void {
    if (!this.selectedVoice || !speechText) {
      return;
    }
    this.stop();
    this.speechText.next(speechText)
    this.synthesizeSpeechFromText(this.selectedVoice, this.selectedRate, speechText);
    this.socketService.processing = false
  }

  public stop(): void {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

  }

  private synthesizeSpeechFromText(voice: SpeechSynthesisVoice, rate: number, text: string) {
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
  }


  async startRecording(pageId: string) {
    if (pageId === "pageId-home") {
      this.speak(this.voiceWelcomeMessage);
    }

    if (this.recorder) { return }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.stream = stream;
    }).catch(error => {
      console.log(error);
    });
    while (!this.stream) {
      await this.delay(100)
    }
    this.speechEvents = hark(this.stream, {})

    this.speechEvents.on('speaking', () => {
      if (!speechSynthesis.speaking && this.speechEnabled) {
        console.log('speaking!');
        this.record();
      }
    });

    this.speechEvents.on('stopped_speaking', () => {
      console.log('stopped_speaking!');
      if (this.isrecording) {
        this.stopRecording()
      }
    });

  }

  record() {
    if (!this.speechEvents) { return }
    if (!this.isrecording) {
      this.socketService.processing = true
      this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm;codecs=pcm',
        numberOfAudioChannels: 1,
        disableLogs: true,
        desiredSampRate: 16000,
      });
      this.recorder.record();
      this.isRecording.next(true);
    }
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop((blob: any) => {
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

  stopMedia() {
    this.speak(this.voiceEndingMessage)
    if (this.recorder) {
      this.recorder = null;
      if (this.stream) {
        this.stream = null;
        if (this.speechEvents) this.speechEvents = null
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
