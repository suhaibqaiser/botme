import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
import * as hark from 'hark'
import { WindowService } from './window.service';


interface RecommendedVoices {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  private stream: any
  private recorder: any
  private speechEvents: any
  private isRecording = new Subject<boolean>();
  private isrecording: boolean = false
  recording = this.isRecording.asObservable();


  public sayCommand: string;
  public recommendedVoices: RecommendedVoices;
  public rates: number[];
  public selectedRate: number;
  public selectedVoice: SpeechSynthesisVoice | null;
  public text: string;
  public voices: SpeechSynthesisVoice[];



  constructor(private socketService: SocketService, private windowService: WindowService) {
    // windowService.nativeWindow.speechSynthesis.onvoiceschanged = () => {
    //   this.voices = windowService.nativeWindow.getVoices();
    // };
    this.recording.subscribe(data => {
      this.isrecording = data
    })

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.stream = stream;
    }).catch(error => {
      console.log(error);
    });

    socketService.messages.subscribe((text: any) => {
      console.log(text.text);

      this.text = text.text
      this.speak();
    })

    this.voices = [];
    this.rates = [.25, .5, .75, 1, 1.25, 1.5, 1.75, 2];
    this.selectedVoice = null;
    this.selectedRate = 1;
    // Dirty Dancing for the win!
    this.text = "";
    this.sayCommand = "";


    this.recommendedVoices = Object.create(null);
    this.recommendedVoices["Alex"] = true;
    this.recommendedVoices["Alva"] = true;
    this.recommendedVoices["Damayanti"] = true;
    this.recommendedVoices["Daniel"] = true;
    this.recommendedVoices["Fiona"] = true;
    this.recommendedVoices["Fred"] = true;
    this.recommendedVoices["Karen"] = true;
    this.recommendedVoices["Mei-Jia"] = true;
    this.recommendedVoices["Melina"] = true;
    this.recommendedVoices["Moira"] = true;
    this.recommendedVoices["Rishi"] = true;
    this.recommendedVoices["Samantha"] = true;
    this.recommendedVoices["Tessa"] = true;
    this.recommendedVoices["Veena"] = true;
    this.recommendedVoices["Victoria"] = true;
    this.recommendedVoices["Yuri"] = true;


    this.ngOnInit()

  }


  public demoSelectedVoice(): void {

    if (!this.selectedVoice) {
      console.warn("Expected a voice, but none was selected.");
      return;
    }
    var demoText = "Best wishes and warmest regards.";
    this.stop();
    this.synthesizeSpeechFromText(this.selectedVoice, this.selectedRate, this.text);
  }

  public ngOnInit(): void {

    this.voices = speechSynthesis.getVoices();
    this.selectedVoice = (this.voices[2] || null);
    this.updateSayCommand();

    // The voices aren't immediately available (or so it seems). As such, if no
    // voices came back, let's assume they haven't loaded yet and we need to wait for
    // the "voiceschanged" event to fire before we can access them.
    if (!this.voices.length) {
      speechSynthesis.addEventListener(
        "voiceschanged",
        () => {
          this.voices = speechSynthesis.getVoices();
          console.log(this.voices);

          this.selectedVoice = (this.voices[2] || null);
          console.log(this.selectedVoice);

          this.updateSayCommand();
        }
      );
    }

  }

  public speak(): void {
    if (!this.selectedVoice || !this.text) {
      return;
    }
    this.stop();
    this.synthesizeSpeechFromText(this.selectedVoice, this.selectedRate, this.text);
  }

  public stop(): void {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }

  // current speech synthesis configuration.
  public updateSayCommand(): void {
    if (!this.selectedVoice || !this.text) {
      return;
    }

    // With the say command, the rate is the number of words-per-minute. As such, we
    // have to finagle the SpeechSynthesis rate into something roughly equivalent for
    // the terminal-based invocation.
    var sanitizedRate = Math.floor(200 * this.selectedRate);
    var sanitizedText = this.text
      .replace(/[\r\n]/g, " ")
      .replace(/(["'\\\\/])/g, "\\$1");
    this.sayCommand = `say --voice ${this.selectedVoice.name} --rate ${sanitizedRate} --output-file=demo.aiff "${sanitizedText}"`;
  }

  private synthesizeSpeechFromText(
    voice: SpeechSynthesisVoice,
    rate: number,
    text: string
  ): void {
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.selectedVoice;
    utterance.rate = rate;

    speechSynthesis.speak(utterance);
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

  // speak(text: string) {
  //   let synth = window.speechSynthesis;
  //   let utterance = new SpeechSynthesisUtterance();
  //   utterance.voice = this.voices[2];
  //   utterance.text = text;
  //   utterance.lang = 'en-UK'
  //   utterance.rate = Number(1.1)
  //   synth.speak(utterance);
  // }
}
