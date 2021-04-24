import {Component, OnInit} from '@angular/core';
import {ConversationService} from '../service/conversation.service';

@Component({
  selector: 'app-conversation-log',
  templateUrl: './conversation-log.component.html',
  styleUrls: ['./conversation-log.component.css']
})
export class ConversationLogComponent implements OnInit {

  constructor(private conversationServer: ConversationService) {
  }

  ngOnInit(): void {
    this.getConversationList();
    this.getConversationLog();
  }

  conversations: Array<any> = [];
  conversationLog: Array<any> = [];

  getConversationLog(): void {
    for (let c of this.conversations) {
      let conversation = {
        query: '',
        response: '',
        timestamp: ''
      };
      conversation.query = this.conversations[c].query;
      conversation.response = this.conversations[c].response;
      conversation.timestamp = this.conversations[c].timestamp;
      this.conversationLog.push(conversation);
    }
  }

  getConversationList(): void {
    this.conversationServer.getConversationList()
      .subscribe(result => this.conversations = result.payload);
  }
}
