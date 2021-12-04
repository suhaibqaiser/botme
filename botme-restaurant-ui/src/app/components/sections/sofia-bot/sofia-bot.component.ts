import { Component, OnInit } from '@angular/core';
import { BotmeClientService } from 'src/app/services/botme-client.service';
import { SocketService } from 'src/app/services/socket.service';
import { SpeechService } from "../../../services/speech.service";


@Component({
  selector: 'app-sofia-bot',
  templateUrl: './sofia-bot.component.html',
  styleUrls: ['./sofia-bot.component.scss']
})
export class SofiaBotComponent implements OnInit {

  voiceEnabled: boolean = true;
  speechEnabled: boolean = true;
  isBrowserSpeech: boolean = true;

  constructor(private speechService: SpeechService,
    private socketService: SocketService,
    public clientService: BotmeClientService
  ) {
  }

  ngOnInit() {
    if (this.clientService.getVoiceType() === "cloud-voice") {
      this.isBrowserSpeech = false
    } else if (this.clientService.getVoiceType() === "no-voice") {
      this.voiceEnabled = false
    }
    this.updateInteractionState(this.voiceEnabled)
  }

  updateInteractionState(value: boolean) {
    this.speechEnabled = value
    this.speechService.speechEnabled.next(this.speechEnabled)
    if (this.speechEnabled) {
      this.speechService.enableListening(this.socketService.currentContextObj.pageId, this.isBrowserSpeech)
    } else {
      this.speechService.disableListening();
    }
  }

  ngOnDestroy() {
    this.speechService.disableListening();
  }

}
