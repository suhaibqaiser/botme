import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SpeechService } from 'src/app/services/speech.service';

@Component({
  selector: 'app-progress-loader',
  templateUrl: './progress-loader.component.html',
  styleUrls: ['./progress-loader.component.scss']
})
export class ProgressLoaderComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
