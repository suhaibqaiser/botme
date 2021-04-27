import {Component, OnInit} from '@angular/core';
import {SessionService} from '../service/session.service';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  constructor(private sessionService: SessionService) {
  }

  sessions: Array<any> = [];

  selectedSession?: string;

  ngOnInit(): void {
    this.getSessionList();
  }

  onSelect(session: any): void {
    this.selectedSession = session.sessionId;
  }

  getSessionList(): void {
    this.sessionService.getSessionList()
      .subscribe(result => this.sessions = result.payload);
  }
}
