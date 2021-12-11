import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
import * as hark from 'hark'
import { HelperService } from './helper.service';

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
  private voiceWelcomeMessage = "Welcome to the interactive online shop experience. Start your order by saying, I want to make a reservation!"
  private voiceEndingMessage = "Handing the controls over to you."
  private voiceProcessingDelayed = "Something went wrong, please say again!"
  audio = new Audio();
  speechText = new Subject<string>()
  speechState = new Subject<string>()  // State for monitoring speech service eg. listening, processing, speaking, idle
  speechEnabled = new Subject<boolean>();
  SpeechE: boolean = false
  cloudVoice: boolean = true;
  isSpeaking: boolean = false
  isListening: boolean = false
  isProcessing: boolean = false
  isIdle: boolean = true
  //browser speech section
  recognition: any
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords: any;
  isBrowserSpeech: boolean = false
  startTime: any
  endTime: any

  timerStart() {
    this.startTime = new Date();
  }

  timerEnd() {
    this.endTime = new Date();
    var timeDiff = this.endTime - this.startTime; //in ms
    // strip the ms
    // timeDiff /= 1000;
    console.log(timeDiff + " ms");
    return timeDiff
  }

  timerClear() {
    this.startTime = null
    this.endTime = null
  }

  constructor(private socketService: SocketService, private helper: HelperService) {

    this.speechState.next('idle')

    this.speechEnabled.subscribe(data => {
      this.SpeechE = data
      if (!this.SpeechE) {
        this.stopSpeak()
      }
    })

    this.socketService.messages.subscribe((message: any) => {
      this.speak(message.text, message.audio)
      helper.log('info', 'You Said: ' + message.inputText);
    });

    if (this.SpeechE) {
      this.init()
    }

    // this.socketService.processing = true

  }

  init() {


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
    this.speechEvents.on('speaking', () => {
      // if ((this.speechEvents && this.SpeechE) && (!this.isSpeaking && !this.isListening && !this.isProcessing)) {
      //   console.log(`Listening, Speaking: ${this.isSpeaking}, Listening: ${this.isListening}, Processing: ${this.isProcessing}`);
      //   // this.timerStart()
      //   this.cloudlisten()
      // }

    });
    this.speechEvents.on('stopped_speaking', () => {
      // if (this.isListening && (this.timerEnd() >= 1000)) {
      //   this.stopCloudListen()
      //   this.timerClear()
      // }
      // this.stopCloudListen()
    });
  }

  stopListening() {
    this.delay(500);
    this.stopCloudListen()
  }

  startListening() {
    if ((this.SpeechE) && (!this.isSpeaking && !this.isListening && !this.isProcessing)) {
      console.log(`Listening, Speaking: ${this.isSpeaking}, Listening: ${this.isListening}, Processing: ${this.isProcessing}`);
      // this.timerStart()
      this.cloudlisten()
    }
  }

  cloudlisten() {
    this.updateState('l')
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  stopCloudListen() {
    if (this.recorder && this.isListening) {
      this.updateState('p')
      setTimeout(() => {
        if (this.isProcessing) {
          this.speak(this.voiceProcessingDelayed, null)
        }
      }, 10000); // seconds
      this.recorder.stop((blob: any) => {
        if (!this.isSpeaking || !this.isProcessing || !this.isListening)
          this.socketService.sendMessage('voice', blob, this.cloudVoice)
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
    // TODO: should update this before commiting 
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
      const blob = new Blob([voice], { type: "audio/ogg" });
      this.audio.src = URL.createObjectURL(blob)
      this.audio.load();
      this.updateState('s')
      this.audio.play();
      while (!this.audio.paused) {
        await this.delay(100)
      }
    } else {
      if (!speechText) return;
      this.helper.log('info', 'Bot Replied: ' + speechText);
      let utterance = new SpeechSynthesisUtterance(speechText);
      utterance.voice = this.selectedVoice;
      utterance.rate = this.selectedRate;
      // utterance.lang = this.selectedVoice.lang
      this.updateState('s')
      speechSynthesis.speak(utterance);
      while (speechSynthesis.speaking) {
        await this.delay(100)
      }
    }
    this.stopSpeak()
  }

  public async stopSpeak() {
    if (!this.cloudVoice && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    if (this.cloudVoice && !this.audio.paused) {
      console.log('Speaking Stopped');
      this.audio.pause();
    }
    this.updateState('i')
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    if ((this.SpeechE) && (!this.isSpeaking && !this.isListening && !this.isProcessing)) {
      this.updateState('l')
    };
  }

  stopBrowserListen() {
    this.updateState('p')
    if (!this.text.length) return
    this.socketService.sendMessage('communication', this.text, false)
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


  updateState(state: string) {
    if (state === 'l') {
      // show speech bubble
      // this.socketService.processing = true
      this.isListening = true;
      this.isIdle = false
      this.speechState.next('listening')
      this.speechText.next('Listening...')
    } else if (state === 'p') {
      this.isListening = false;
      this.isProcessing = true;
      this.isIdle = false
      this.speechText.next('Processing...')
      this.speechState.next('processing')
    } else if (state === 's') {
      this.isIdle = false
      this.isProcessing = false;
      this.isSpeaking = true;
      this.speechState.next('speaking')
      this.speechText.next('Speaking...')
    } else if (state === 'i') {
      this.isListening = false;
      this.isSpeaking = false;
      this.isProcessing = false;
      this.isIdle = true
      // this.socketService.processing = false
      this.speechState.next('idle')
      this.speechText.next('')
    }
  }
}


