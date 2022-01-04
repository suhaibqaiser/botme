import {Component, OnInit} from '@angular/core';
import {BotmeClientService} from 'src/app/services/botme-client.service';
import {SocketService} from 'src/app/services/socket.service';
import {SpeechService} from "../../../services/speech.service";


@Component({
  selector: 'app-sofia-bot',
  templateUrl: './sofia-bot.component.html',
  styleUrls: ['./sofia-bot.component.scss']
})
export class SofiaBotComponent implements OnInit {

  voiceEnabled: boolean = true;
  speechEnabled: boolean = false;
  isBrowserSpeech: boolean = true;
  speechText: string = ''


  constructor(public speechService: SpeechService,
              public clientService: BotmeClientService
  ) {
    this.updateInteractionState(this.clientService.getCookie().isVoiceModeOn === 'true' ? true : false)
  }

  ngOnInit() {
    if (this.clientService.getVoiceType() === "cloud-voice") {
      this.isBrowserSpeech = false
    } else if (this.clientService.getVoiceType() === "no-voice") {
      this.voiceEnabled = false
    }
    this.speechService.speechState.subscribe(data => {
      switch (data) {
        case 'idle':
          this.speechText = ''
          break;
        case 'listening':
          this.speechText = 'Listening...'
          break;
        case 'processing':
          this.speechText = 'Processing...'
          break;
        case 'speaking':
          this.speechText = 'Speaking...'
          break;
        default:
          break;
      }

    })
  }

  updateInteractionState(value: boolean) {
    this.speechEnabled = value
    this.clientService.setCookie('isVoiceModeOn', value)
    this.speechService.speechEnabled.next(this.speechEnabled)
    if (this.speechEnabled) {
      this.speechService.enableListening()
    } else {
      this.speechService.disableListening();
    }
  }


  ngOnDestroy() {
    this.speechService.disableListening();
  }

}
