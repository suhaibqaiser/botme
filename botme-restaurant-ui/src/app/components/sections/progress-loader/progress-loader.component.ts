import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { SpeechService } from 'src/app/services/speech.service';

@Component({
  selector: 'app-progress-loader',
  templateUrl: './progress-loader.component.html',
  styleUrls: ['./progress-loader.component.scss']
})
export class ProgressLoaderComponent implements OnInit {

  displayText: string = "Hello"
  listening: boolean = false
  processing: boolean = false
  speaking: boolean = false
  startTime: any
  endTime: any

  constructor(private speechService: SpeechService, public socketService: SocketService) {
    this.speechService.speechText.subscribe(data => {
      this.displayText = data
    })
    this.speechService.speechState.subscribe(data => {
      (data === "listening") ? this.listening = true : this.listening = false;
      (data === "processing") ? this.processing = true : this.processing = false;
      (data === "speaking") ? this.speaking = true : this.speaking = false;
    })
  }


  ngOnInit(): void {
  }


}
