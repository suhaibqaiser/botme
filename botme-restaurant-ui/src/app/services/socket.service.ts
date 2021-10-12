import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';

export const WS_ENDPOINT = environment.wsEndpoint;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket$: any;
  private messagesSubject = new Subject();
  messages = this.messagesSubject.asObservable();

  constructor() {
    this.connect();
  }

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      this.socket$.subscribe(
        (msg: string) => {
          this.messagesSubject.next(msg)
        },
        (err: any) => console.log(err),
        () => this.close()
      );
    }
  }

  private getNewWebSocket() {
    return webSocket(WS_ENDPOINT);
  }

  sendMessage(msg: any) {
    let wsPayload = {
      "clientID": "987530c0-998d-4cfc-b86d-596b5f7cd7d7",
      "current_time": Date.now(),
      "message_format": "text",
      "message_command": "find",
      "language": "en-US",
      "message_text": msg,
      "authToken": "qbw/fcQKvC6SY+AelUs5VpRYOhnRvzZsz39xVU06LYI=",
      "pageId": "pageId-order-online",
      "sectionId": "sectionId-product-list"
    }
    this.socket$.next(wsPayload);
  }

  close() {
    this.socket$.complete();
  }
}
