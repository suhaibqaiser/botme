import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { io } from "socket.io-client";
import { BotmeClientService } from './botme-client.service';


@Injectable({
  providedIn: 'root'
})
export class SocketService {


  private messagesSubject = new Subject();
  private notificationSubject = new Subject();
  messages = this.messagesSubject.asObservable();
  notifications = this.notificationSubject.asObservable();
  processing = false
  authToken: string
  socket: any

  currentContextList = [
    {
      currentRoute: 'online shop',
      pageId: 'pageId-order-online',
      sectionId: 'sectionId-product-list'
    },
    {
      currentRoute: 'product-detail',
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
    },
    {
      currentRoute: 'reservations',
      pageId: 'pageId-reservation',
      sectionId: 'sectionId-reservation-form'
    },
    {
      currentRoute: 'contact us',
      pageId: 'pageId-contact-us',
      sectionId: 'sectionId-message-form'
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


  constructor(private router: Router, private clients: BotmeClientService) {

    this.authToken = clients.getCookieToken();

    if (this.authToken) {
      this.socket = io(environment.wsEndpoint, {
        auth: { token: this.authToken },
        path: (environment.production) ? "/ws/" : ""
      });

      this.socket.on('message', (data: any) => {

        let payload = data.payload

        switch (data.type) {
          case "communication":
            this.messagesSubject.next(payload)
            if (payload.intentName) this.fireInteractionEvent(payload)
            break;
          case "notification":
            this.notificationSubject.next(payload)
            if (payload.text === 'processing started')
              this.sendMessage('notification', 'context', false)
            console.log(payload);
            break;
          case "voice":
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
  }

  sendMessage(type: string, message: any, voice: boolean) {
    interface SocketMessage {
      payload: object,
      type: string,
      timestamp: string
    }

    let SocketPayload: SocketMessage = {
      payload: {
        "message": message,
        "voice": voice,
        "pageId": this.currentContextObj.pageId,
        "sectionId": this.currentContextObj.sectionId
      },
      type: type,
      timestamp: Date()

    }
    console.log('SocketPayload =>', SocketPayload)
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
    console.log('fireInteractionEvent =>', msg)
    let tempMessage = msg
    this.responseLabel = tempMessage.text
    if (tempMessage.entityId) {

      //for reservation form
      // @ts-ignore
      document.getElementById(tempMessage.entityId)?.value = tempMessage.entityName


      if (tempMessage.entityId == 'entityId-select-serving-size') {
        this.voiceServingSize = tempMessage.entityName.toLowerCase()
        // @ts-ignore
        document.getElementById('ctaId-select-serving-size')?.click()
        return
      }

      // @ts-ignore
      let template = document.getElementById(tempMessage.entityId)
      console.log('template =>', template)
      // @ts-ignore
      let list = template.getElementsByTagName('a')
      console.log('list =>', list)
      for (let i = 0; i < list.length; i++) {
        if (list[i].getAttribute('id') == tempMessage.ctaId) {
          console.log('select item =>', list[i].getAttribute('id'))
          list[i]?.click()
        }
      }
      // @ts-ignore
      document.getElementById(tempMessage.entityId)?.click()
    }
  }

  getCurrentContext() {
    let currentRoute = this.router.url.replace(/\//g, "").replace("-", " ");
    if (currentRoute.indexOf('?') > 0) {
      currentRoute = currentRoute.substr(0, currentRoute.indexOf('?'))
    }
    if (this.router.url.split('/')[1] === 'product-detail') {
      currentRoute = this.router.url.split('/')[1]
    }

    console.log('currentRoute =>', currentRoute)
    this.currentContextList.filter((item: any) => {
      if (item.currentRoute === currentRoute) {
        this.currentContextObj = JSON.parse(JSON.stringify(item))
      }
    })
  }
}
