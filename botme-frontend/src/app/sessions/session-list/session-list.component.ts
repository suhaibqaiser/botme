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

  ngOnInit(): void {
    this.getSessionList();
  }

  sessions: Array<any> = [];

  selectedSession?: string;

  onSelect(session: any): void {
    this.selectedSession = session.sessionId;
  }

  getSessionList(): void {
    this.sessionService.getSessionList()
      .subscribe(result => this.sessions = result.payload);
  }
}
