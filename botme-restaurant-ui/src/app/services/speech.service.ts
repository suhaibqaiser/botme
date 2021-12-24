import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';
import { SocketService } from './socket.service';
import * as hark from 'hark'
import { HelperService } from './helper.service';
@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  private stream: any
  private recorder: any

  // TODO: These messages should be moved to database
  // to avoid hardcoding and for better management
  private voiceWelcomeMessage = "Welcome to the interactive online shop experience. Start by saying, I want to make a reservation!"
  private voiceEndingMessage = "Handing the controls over to you."
  private voiceProcessingDelayed = "Something went wrong, please say again!"

  private isSpeechEnabled: boolean = false
  isSpeaking: boolean = false
  isListening: boolean = false
  isProcessing: boolean = false
  isIdle: boolean = true
  audio = new Audio();
  speechState = new Subject<string>()  // State for monitoring speech service eg. listening, processing, speaking, idle
  speechEnabled = new Subject<boolean>();


  constructor(private socketService: SocketService, private helper: HelperService) {

    this.speechState.next('idle')

    // Subscribe speech enable state changed from browser
    this.speechEnabled.subscribe(data => {
      this.isSpeechEnabled = data
      if (!this.isSpeechEnabled) {
        this.stopSpeak()
      }
    })

    // Subscribe to messages comming from WS server
    this.socketService.messages.subscribe((message: any) => {
      this.speak(message.text, message.audio)
      helper.log('info', 'You Said: ' + message.inputText);
      helper.log('info', `ConversationId : ${message.conversation.conversationId}, ConversationLogId : ${message.conversation.conversationLogId}`)
    });

  }

  enableListening() {
    if (this.socketService.currentContextObj.pageId === "pageId-home") {
      this.speak(this.voiceWelcomeMessage, null);
    }
  }

  async startListening() {
    // Guard checks before starting the listening process
    if (this.isSpeaking) return
    if (this.isListening) return
    if (this.isProcessing) return
    if (!this.isSpeechEnabled) return

    this.helper.log('info', `Listening, Speaking: ${this.isSpeaking}, Listening: ${this.isListening}, Processing: ${this.isProcessing}`);

    // Get/Ask browser to provide MIC input
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true } }).then(stream => {
      this.stream = stream;
    }).catch(error => {
      console.error(error);
    });

    // wait until the audio stream is available
    while (!this.stream) {
      await this.helper.delay(100)
    }
    // Update state to listening
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


  async stopListening() {

    // Artificial delay before stopping recording
    await this.helper.delay(500);

    // Guard checks
    if (!this.recorder) return
    if (!this.isListening) return

    // Update state to processing
    this.updateState('p')

    setTimeout(() => {
      if (this.isProcessing) {
        this.speak(this.voiceProcessingDelayed, null)
      }
    }, 5000); // milli seconds

    this.recorder.stop((blob: any) => {
      // Guard checks before sending request to websocket
      if (this.isSpeaking) return
      if (this.isListening) return
      if (!this.isSpeechEnabled) return

      // Send request to websocket
      this.socketService.sendMessage('voice', blob)
    }, () => {
      this.disableListening();
    });

  }

  disableListening() {
    if (this.recorder) {
      this.recorder = null;
      if (this.stream) {
        this.stream = null;
      }
    }
    this.speak(this.voiceEndingMessage, null)
  }

  convertTextToSpeech(speechText: string) {
    // Send speech text to websocket to be converted into audio
    // Audio response will be received through 'communication' channel
    this.socketService.sendMessage('tts', speechText);
  }

  public async speak(speechText: string, speechAudioBuffer: any) {
    if (this.isSpeaking) return

    if (!speechAudioBuffer) {
      // Send speech text to websocket to be converted into audio
      this.convertTextToSpeech(speechText)
      return
    }

    // Prepare audio to be played on browser
    const blob = new Blob([speechAudioBuffer], { type: "audio/ogg" });
    this.audio.src = URL.createObjectURL(blob)
    this.audio.load();

    // Update state to processing
    this.updateState('s')

    this.audio.play();

    // Wait until the whole audio is played then stop the player
    while (!this.audio.paused) {
      await this.helper.delay(100)
    }
    this.stopSpeak()
  }

  public async stopSpeak() {
    if (!this.audio.paused) {
      this.audio.pause();
    }
    this.updateState('i')
  }




  updateState(state: string) {
    if (state === 'l') {
      this.isListening = true;
      this.isIdle = false
      this.speechState.next('listening')
    } else if (state === 'p') {
      this.isListening = false;
      this.isProcessing = true;
      this.isIdle = false
      this.speechState.next('processing')
    } else if (state === 's') {
      this.isIdle = false
      this.isProcessing = false;
      this.isSpeaking = true;
      this.speechState.next('speaking')
    } else if (state === 'i') {
      this.isListening = false;
      this.isSpeaking = false;
      this.isProcessing = false;
      this.isIdle = true
      this.speechState.next('idle')
    }
  }
}


