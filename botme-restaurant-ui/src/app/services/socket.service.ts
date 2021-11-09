import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { Sockets } from '../app.module';



@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private messagesSubject = new Subject();
  private notificationSubject = new Subject();
  messages = this.messagesSubject.asObservable();
  notifications = this.notificationSubject.asObservable();
  processing = false

  currentContextList = [
    {
      currentRoute: 'online shop',
      pageId: 'pageId-order-online',
      sectionId: 'sectionId-product-list'
    },
    {
      currentRoute: 'product detail',
      pageId: 'pageId-product-detial-page',
      sectionId: 'sectionId-product-detial-page'
    },
    {
      currentRoute: 'home',
      pageId: 'pageId-home',
      sectionId: 'sectionId-product-list'
    },
    {
      currentRoute: 'cart',
      pageId: 'pageId-cart',
      sectionId: 'sectionId-product-list'
    }
  ]
  currentContextObj = {
    currentRoute: '',
    pageId: '',
    sectionId: ''
  }

  voiceServingSize = ''
  responseLabel = 'Noting to display'
  speachInput = new FormControl('')


  constructor(private socket: Sockets, private router: Router) {

    this.socket.fromEvent('message')
      .subscribe((data: any) => {

        let payload = data.payload

        switch (data.type) {
          case "communication":
            this.messagesSubject.next(payload)
            this.fireInteractionEvent(payload)
            break;
          case "notification":
            this.notificationSubject.next(payload)
            if (payload.text === 'processing started')
              this.sendMessage('notification', 'context')
            console.log(payload);
            break;
          case "action":
            console.log(payload);
            break;
          case "action callback":
            console.log(payload);
            break;
          default:
            break;
        }
      })
  }


  sendMessage(type: string, message: any) {
    interface SocketMessage {
      payload: object,
      type: string,
      timestamp: string
    }

    let SocketPayload: SocketMessage = {
      payload: {
        "text": message,
        "pageId": this.currentContextObj.pageId,
        "sectionId": this.currentContextObj.sectionId
      },
      type: type,
      timestamp: Date()

    }
    this.socket.emit('message', SocketPayload);
  }

  /**
   * Here we are passing the response from web server and interacting with web ui
   * @param msg
   */
  fireInteractionEvent(msg: any) {

    /**
     * var sel = document.getElementById('ctaId-select-serving-size');
     var len = sel.options.length;

     sel.setAttribute('size', len);
     */
    let tempMessage = msg
    this.responseLabel = tempMessage.text
    if (tempMessage.entityId) {

      if (tempMessage.entityId == 'entityId-select-serving-size') {
        this.voiceServingSize = tempMessage.entityName.toLowerCase()
        // @ts-ignore
        document.getElementById('ctaId-select-serving-size').click()
        return
      }

      // @ts-ignore
      let template = document.getElementById(tempMessage.entityId)
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

  getCurrentContext() {
    let currentRoute = this.router.url.replace(/\//g, "").replace("-", " ");
    if (currentRoute.indexOf('?') > 0) {
      currentRoute = currentRoute.substr(0, currentRoute.indexOf('?'))
    }
    this.currentContextList.filter((item: any) => {
      if (item.currentRoute === currentRoute) {
        this.currentContextObj = JSON.parse(JSON.stringify(item))
      }
    })
  }
}
