import {Component, OnInit} from '@angular/core';
import {ConversationService} from '../service/conversation.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-conversation-log',
  templateUrl: './conversation-log.component.html',
  styleUrls: ['./conversation-log.component.css']
})
export class ConversationLogComponent implements OnInit {

  constructor(private conversationService: ConversationService,
              private route: ActivatedRoute,
  ) {
  }

  sessionId = '';
  conversations: Array<any> = [];

  // pageTitle = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('sessionId') as string;
    });
    this.getConversationList(this.sessionId);
  }

  getConversationList(sessionId: string): void {
    this.conversationService.getConversationList(sessionId)
      .subscribe(result => this.conversations = result.payload);
  }
}
