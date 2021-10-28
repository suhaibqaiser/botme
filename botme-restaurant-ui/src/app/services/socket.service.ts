import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { FormControl } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private messagesSubject = new Subject();
  private notificationSubject = new Subject();
  messages = this.messagesSubject.asObservable();
  notifications = this.notificationSubject.asObservable();

  pageId = 'pageId-order-online'
  sectionId = 'sectionId-product-list'
  responseLabel = 'Noting to display'
  speachInput = new FormControl('')

  constructor(private socket: Socket) {
    this.socket.fromEvent('message').subscribe(data => {
      console.log(data)
      this.messagesSubject.next(data)
      this.fireInteractionEvent(data)
    })
    this.socket.fromEvent('notification').subscribe(data => {
      console.log(data)
      this.notificationSubject.next(data)
    })
   }

  sendNotification(msg: any) {
    this.socket.emit('notification', msg);
  }

  sendMessage(msg: any) {
    let wsPayload = {
      "clientID": "987530c0-998d-4cfc-b86d-596b5f7cd7d7",
      "current_time": Date(),
      "message_format": "text",
      "message_command": "find",
      "language": "en-US",
      "message_text": msg,
      "authToken": "qbw/fcQKvC6SY+AelUs5VpRYOhnRvzZsz39xVU06LYI=",
      "pageId": this.pageId,
      "sectionId": this.sectionId
    }
    console.log('sendMessage =>', wsPayload)
    this.socket.emit('message', wsPayload);
  }

  /**
   * Here we are passing the response from web server and interacting with web ui
   * @param msg
   */
  fireInteractionEvent(msg: any) {
    console.log('Response =>', msg.message)
    let tempMessage = msg.message
    this.responseLabel = tempMessage.text
    // @ts-ignore
    let template = document.getElementById(tempMessage.entityId)
    console.log('template =>', template)
    // @ts-ignore
    let list = template.getElementsByTagName('a')
    for (let i = 0; i < list.length; i++) {
      if (list[i].getAttribute('id') == tempMessage.ctaId) {
        list[i].click()
      }
    }
    // @ts-ignore
    document.getElementById(tempMessage.entityId).click()
  }
}
