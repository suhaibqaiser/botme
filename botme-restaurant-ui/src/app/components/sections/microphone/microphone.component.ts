import { Component, OnInit } from '@angular/core';
import { SpeechService } from 'src/app/services/speech.service';

@Component({
  selector: 'app-microphone',
  templateUrl: './microphone.component.html',
  styleUrls: ['./microphone.component.scss']
})
export class MicrophoneComponent implements OnInit {


  speechState: string = 'idle'
  speechEnabled: boolean = false

  constructor(private speechService: SpeechService,) { }

  ngOnInit(): void {

    this.speechService.speechState.subscribe(data => {
      this.speechState = data
    })
    this.speechService.speechEnabled.subscribe(data => {
      this.speechEnabled = data
    })

  }

  toggleListen() {
    if (this.speechService.isIdle) {
      this.speechService.startListening()
    } else {
      if (this.speechService.isListening)
        this.speechService.stopListening()
    }
  }

}
