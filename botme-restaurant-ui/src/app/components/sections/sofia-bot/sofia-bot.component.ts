import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { SpeechService } from "../../../services/speech.service";

@Component({
  selector: 'app-sofia-bot',
  templateUrl: './sofia-bot.component.html',
  styleUrls: ['./sofia-bot.component.scss']
})
export class SofiaBotComponent implements OnInit {

  speechEnabled: boolean = false;

  constructor(private speechService: SpeechService, private socketService: SocketService) { }

  ngOnInit() { }

  updateInteractionState() {
    this.speechService.speechEnabled.next(this.speechEnabled)

    if (this.speechEnabled) {
      this.speechService.enableListening(this.socketService.currentContextObj.pageId)
    } else {
      this.speechService.disableListening();
      // this.speechService.disableSpeaking()
    }
  }

  ngOnDestroy() {
    this.speechService.disableListening();
  }

}
