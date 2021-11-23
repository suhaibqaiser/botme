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
  private selectedRate: number = 1;
  private selectedVoice: any;
  private voice: any
  private voices: SpeechSynthesisVoice[] = [];
  private voiceWelcomeMessage = "Welcome to the interactive online shop experience. Start your order by saying something like. I want to make a reservation!"
  private voiceEndingMessage = "Handing the controls over to you. Happy Ordering!"
  private voiceProcessingDelayed = "Well, that didn't went according to the plan, please say again!"
  speechText = new Subject<string>()
  speechState = new Subject<string>()  // State for monitoring speech service eg. listening, processing, speaking, idle
  speechEnabled = new Subject<boolean>();
  SpeechE: boolean = false
  audio = new Audio();
  voiceFromServer: boolean = true;
  isSpeaking: boolean = false
  isListening: boolean = false



  constructor(private socketService: SocketService) {

    this.speechEnabled.subscribe(data => {
      this.SpeechE = data
    })

    this.socketService.messages.subscribe((message: any) => {
      this.speak(message.text, message.audio)

    });

    // decide wether to use google chrome browser or WS server TTS api
    // (this.selectedVoice) ? this.voiceFromServer = false : this.voiceFromServer = true;

    // Initalize Google Chrome voices for Text-to-speech
    if (!this.voices.length) {
      speechSynthesis.addEventListener(
        "voiceschanged",
        () => {
          this.voices = speechSynthesis.getVoices();
          let selectVoice: number = 2
          this.voices.forEach(function (voice, index) {
            if (voice.lang === 'en-UK' && voice.name.includes('Female')) {
              selectVoice = index
            }
          });
          this.selectedVoice = this.voices[selectVoice]
          console.log(this.selectedVoice);
          if (this.selectedVoice) this.voiceFromServer = false
        });
    }
    this.updateState('i')
    // this.socketService.processing = true
  }

  async enableListening(pageId: string) {
    if (pageId === "pageId-home") {
      this.speak(this.voiceWelcomeMessage, null);
    }
    if (this.recorder) { return }

    // Get/Ask browser to provide MIC input
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.stream = stream;
    }).catch(error => {
      console.log(error);
    });

    // wait until the audio stream is available
    while (!this.stream) {
      await this.delay(100)
    }

    // initialize speech speaking and silence events
    this.speechEvents = hark(this.stream, {})
    this.speechEvents.on('speaking', () => this.listen());
    this.speechEvents.on('stopped_speaking', () => this.stopListening());
  }

  listen() {
    if (!this.speechEvents || this.isSpeaking) { return }
    console.log('listening started', 'this.isSpeaking', this.isSpeaking, 'this.isListening', this.isListening);
    if (this.SpeechE && (!this.isSpeaking || !this.isListening)) {
      this.updateState('l')

      // Show processing overlay
      this.socketService.processing = true

      this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm;codecs=pcm',
        numberOfAudioChannels: 1,
        disableLogs: true,
        desiredSampRate: 16000,
      });
      this.recorder.record();
      this.isListening = true;
    }
  }

  stopListening() {
    console.log('listening ended');
    if (this.recorder && this.isListening) {
      this.updateState('p')
      setTimeout(() => {
        if (!this.isSpeaking && this.socketService.processing === true) {
          this.speak(this.voiceProcessingDelayed, null)
        }
      }, 3000);
      this.recorder.stop((blob: any) => {
        this.socketService.sendMessage('voice', blob, this.voiceFromServer)
        this.isListening = false;
      }, () => {
        this.disableListening();
      });
    }
  }

  disableListening() {
    this.speak(this.voiceEndingMessage, null)
    if (this.recorder) {
      this.recorder = null;
      if (this.stream) {
        this.stream = null;
        if (this.speechEvents) this.speechEvents = null
      }
    }
  }


  public async speak(speechText: string, voice: any) {
    if (this.isSpeaking) return
    console.log(this.voiceFromServer, speechText, voice);

    this.isSpeaking = true

    if (this.voiceFromServer) {
      if (!voice) {
        this.socketService.sendMessage('tts', speechText, true);
        this.isSpeaking = false;
        this.stopSpeak();
        return
      }
      this.updateState('s')
      const blob = new Blob([voice], { type: "audio/ogg" });
      this.audio.src = URL.createObjectURL(blob)
      this.audio.load();
      this.audio.play();
      while (!this.audio.paused) { await this.delay(100) }
    } else {
      if (!speechText) return;
      this.updateState('s')
      let utterance = new SpeechSynthesisUtterance(speechText);
      utterance.voice = this.selectedVoice;
      utterance.rate = this.selectedRate;
      utterance.lang = this.selectedVoice.lang
      speechSynthesis.speak(utterance);
      while (speechSynthesis.speaking) { await this.delay(100) }
    }
    // Hide processing overlay
    this.socketService.processing = false
    this.stopSpeak()
  }

  public stopSpeak(): void {
    if (!this.voiceFromServer && speechSynthesis.speaking) {
      this.updateState('i')
      speechSynthesis.cancel();
    }
    if (this.voiceFromServer && !this.audio.paused) {
      this.updateState('i')
      this.audio.pause();
    }
    this.isSpeaking = false
  }

  // disableSpeaking() {
  //   this.isSpeaking = true
  // }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateState(state: string) {
    if (state === 'p') {
      this.speechText.next('Processing...')
      this.speechState.next('processing')
    } else if (state === 'l') {
      this.speechState.next('listening')
      this.speechText.next('Listening...')
    } else if (state === 'i') {
      this.speechState.next('idle')
    } else if (state === 's') {
      this.speechState.next('speaking')
      this.speechText.next('Speaking...')
    }
  }

}


