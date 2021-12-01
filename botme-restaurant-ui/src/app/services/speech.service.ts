import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
import * as hark from 'hark'

declare var webkitSpeechRecognition: any;


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
  cloudVoice: boolean = true;
  isSpeaking: boolean = false
  isListening: boolean = false

  //browser speech section
  recognition: any
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords: any;
  isBrowserSpeech: boolean = false


  constructor(private socketService: SocketService) {

    this.speechEnabled.subscribe(data => {
      this.SpeechE = data
    })

    this.socketService.messages.subscribe((message: any) => {
      this.speak(message.text, message.audio)
      console.log('You Said: ', message.inputText);
    });

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

        });
    }
    this.updateState('i')

    // this.socketService.processing = true
  }

  enableListening(pageId: string, isBrowserSpeech: boolean) {
    this.isBrowserSpeech = isBrowserSpeech
    if (isBrowserSpeech) this.cloudVoice = false
    if (pageId === "pageId-home") {
      this.speak(this.voiceWelcomeMessage, null);
    }

    if (isBrowserSpeech) {
      console.log('Voice Engine: Browser');
      this.enableBrowserListening()
    } else {
      console.log('Voice Engine: Google Cloud');
      this.enableCloudListenig()
    }
    this.updateState('i')
  }

  async enableCloudListenig() {
    if (this.recorder) {
      return
    }

    // Get/Ask browser to provide MIC input
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true } }).then(stream => {
      this.stream = stream;
    }).catch(error => {
      console.error(error);
    });

    // wait until the audio stream is available
    while (!this.stream) {
      await this.delay(100)
    }

    // initialize speech speaking and silence events
    this.speechEvents = hark(this.stream, {})
    this.speechEvents.on('speaking', () => this.cloudlisten());
    this.speechEvents.on('stopped_speaking', () => this.stopCloudListen());
  }

  cloudlisten() {
    if (!this.speechEvents || this.isSpeaking) {
      return
    }
    if (this.SpeechE && (!this.isSpeaking || !this.isListening)) {
      this.updateState('l')

      // Show processing overlay
      this.socketService.processing = true

      this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        sampleRate: 48000,
        numberOfAudioChannels: 1,
        disableLogs: true,
        // desiredSampRate: 16000,
        timeSlice: 1000,
        bufferSize: 16384,
      });
      this.recorder.record();
      this.isListening = true;
    }
  }

  stopCloudListen() {
    if (this.recorder && this.isListening) {
      this.updateState('p')
      setTimeout(() => {
        if (!this.isSpeaking && this.socketService.processing === true) {
          this.speak(this.voiceProcessingDelayed, null)
        }
      }, 5000);
      this.recorder.stop((blob: any) => {
        this.socketService.sendMessage('voice', blob, this.cloudVoice)
        this.isListening = false;
      }, () => {
        this.disableListening();
      });
    }
  }

  disableListening() {
    if (this.isBrowserSpeech) {
      this.disableBrowserListening()
    } else {
      if (this.recorder) {
        this.recorder = null;
        if (this.stream) {
          this.stream = null;
          if (this.speechEvents) this.speechEvents = null
        }
      }
    }
    // TODO: should update this before comming 
    this.speak(this.voiceEndingMessage, null)
  }


  public async speak(speechText: string, voice: any) {
    if (this.isSpeaking) return

    this.isSpeaking = true

    if (this.cloudVoice) {
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
      while (!this.audio.paused) {
        await this.delay(100)
      }
    } else {
      if (!speechText) return;
      this.updateState('s')
      console.log('Bot Replied: ', speechText);
      let utterance = new SpeechSynthesisUtterance(speechText);
      utterance.voice = this.selectedVoice;
      utterance.rate = this.selectedRate;
      // utterance.lang = this.selectedVoice.lang
      speechSynthesis.speak(utterance);
      while (speechSynthesis.speaking) {
        await this.delay(100)
      }
    }
    // Hide processing overlay
    this.socketService.processing = false
    this.stopSpeak()
  }

  public async stopSpeak() {
    this.updateState('i')
    if (!this.cloudVoice && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    if (this.cloudVoice && !this.audio.paused) {
      this.audio.pause();
    }
    this.isSpeaking = false
    // console.log(speechSynthesis.speaking)
    // this.recognition.start()
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

  // browser speech section
  enableBrowserListening() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = true;

    this.recognition.start()
    console.log('Speech recognition Started');

    this.recognition.addEventListener('result', (e: any) => {
      let final: boolean = false
      const transcript: any = Array.from(e.results)
        .map((result: any) => { final = result.isFinal; return result[0]; })
        .map((result) => result.transcript)
      // .join('');
      this.tempWords = transcript;
      this.browserListen()
      if (final && !this.isSpeaking) {
        this.text = this.tempWords[this.tempWords.length - 1]
        console.log(this.text);
        this.stopBrowserListen()
      }
    });

    this.recognition.addEventListener('speechstart', () => {
      console.log('Speech Start');
      //this.browserListen()
    })

    this.recognition.addEventListener('speechend', () => {
      // this.stopBrowserListen()
      console.log('Speech Ended');
    })
  }

  browserListen() {
    if (this.isSpeaking) {
      return
    }
    if (this.SpeechE && (!this.isSpeaking || !this.isListening)) {
      // Show processing overlay
      this.socketService.processing = true
      this.isListening = true
      this.updateState('l')
    };
  }

  stopBrowserListen() {
    this.isListening = false
    if (!this.text.length) return
    this.socketService.sendMessage('communication', this.text, false)
    this.updateState('p')
    this.text = ''
    // this.recognition.start()
  }

  disableBrowserListening() {
    this.recognition.stop();
    console.log("End speech recognition")
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords;
    this.tempWords = ''
  }

}


