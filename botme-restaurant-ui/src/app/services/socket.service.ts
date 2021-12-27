import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from "@angular/router";
import {environment} from 'src/environments/environment';
import {io} from "socket.io-client";
import {BotmeClientService} from './botme-client.service';
import {HelperService} from "./helper.service";
import {ReservationService} from "./reservation.service";


@Injectable({
  providedIn: 'root'
})
export class SocketService {

// products
  temp = {
    "text": {
      "textValue": "Hello",
      "language": "english",
      "timestamp": ""
    },
    "context": {
      "pageId": "menuPage",
      "sectionId": "sliderSection",
      "parentEntity": {
        "id": "xxx", // product ID
        "name": "zxxz" // product name
      },
      "entities": [
        {
          "entityId": "",
          "entityValue": "",
          "entitySelected": true,
          "clickAttribute": "href, button",
          "keywords": ""
        }
      ]
    }
  }
//NAVIGATION AND BUTTONS
  temp1 = {
    "text": {
      "textValue": "Hello",
      "language": "english",
      "timestamp": ""
    },
    "context": {
      "pageId": "menuPage",
      "sectionId": "sliderSection",
      "parentEntity": {
        "id": "xxx",
        "name": "zxxz"
      },
      "entities": [
        {
          "entityId": "",
          "entityValue": "",
          "entitySelected": true,
          "clickAttribute": "href, button",
          "keywords": ""
        }
      ]
    }
  }
//RESERVATION FORM
  temp3 = {
    "text": {
      "textValue": "Hello",
      "language": "english",
      "timestamp": "",
      "geoCode": {
        "lat": -1.5555,
        "long": 6.222
      }
    },
    "context": {
      "pageId": "menuPage",
      "sectionId": "sliderSection",
      "parentEntity": {
        "id": "xxx",
        "name": "zxxz"
      },
      "entities": [
        {
          "entityId": "entityId-name",
          "entitySelected": true,
          "entityValue": ""
        },
        {
          "entityId": "entityId-number-of-persons",
          "entitySelected": false,
          "entityValue": ""
        },
        {
          "entityId": "entityId-date",
          "entitySelected": false,
          "entityValue": ""
        },
        {
          "entityId": "entityId-time",
          "entitySelected": false,
          "entityValue": ""
        }
      ]
    }
  }

 a = {
   "context": {
     "entities": [
       {
         "clickAttribute": "href, button",
         "entityId": "",
         "entityValue": null,
         "keywords": ""
       }
     ],
     "pageId": "pageId-reservation",
     "parentEntity": {
       "entityId": "",
       "entityValue": ""
     },
     "sectionId": "sectionId-reservation-form"
   },
   "inputText": {
     "language": "english",
     "textValue": "right now",
     "timestamp": "Mon, 27 Dec 2021 23:19:48 GMT"
   }
 }

  private messagesSubject = new Subject();
  private notificationSubject = new Subject();
  messages = this.messagesSubject.asObservable();
  notifications = this.notificationSubject.asObservable();
  processing = false
  authToken: string
  socket: any
  conversationSequence: number = 0

  currentContextList = [
    {
      currentRoute: '/online-shop',
      pageId: 'pageId-order-online',
      sectionId: 'sectionId-product-list'
    },
    {
      currentRoute: '/product-detail',
      pageId: 'pageId-product-detial-page',
      sectionId: 'sectionId-product-detial-page'
    },
    {
      currentRoute: '/home',
      pageId: 'pageId-home',
      sectionId: 'sectionId-product-list'
    },
    {
      currentRoute: '/cart',
      pageId: 'pageId-cart',
      sectionId: 'sectionId-product-list'
    },
    {
      currentRoute: '/reservations',
      pageId: 'pageId-reservation',
      sectionId: 'sectionId-reservation-form'
    },
    {
      currentRoute: '/contact-us',
      pageId: 'pageId-contact-us',
      sectionId: 'sectionId-message-form'
    }
  ]
  currentContextObj = {
    currentRoute: '',
    pageId: '',
    sectionId: ''
  }

  reservationFormEntities = [
    {
      "entityId": "entityId-name",
      "entityValue": "",
      "entityStatus": false
    },
    {
      "entityId": "entityId-number-of-persons",
      "entityValue": "",
      "entityStatus": false
    },
    {
      "entityId": "entityId-date",
      "entityValue": "",
      "entityStatus": false
    },
    {
      "entityId": "entityId-time",
      "entityValue": "",
      "entityStatus": false
    }
  ]

  voiceServingSize = ''


  constructor(private _reservationService: ReservationService, private router: Router, private clients: BotmeClientService, private _helperService: HelperService) {

    this.authToken = clients.getCookieToken();

    if (this.authToken) {
      this.socket = io(environment.wsEndpoint, {
        auth: {token: this.authToken},
        path: (environment.production) ? "/ws/" : ""
      });

      this.socket.on('message', (data: any) => {
        console.log('message =>', data)
        let payload = data.payload

        switch (data.type) {
          case "communication":
            if (payload.conversation.conversationSequence === this.conversationSequence) {
              this.messagesSubject.next(payload)
              if (payload.intentName) {
                this.fireInteractionEvent(payload)
              }
            } else {
              console.log(`Socket Message out of sync. This id: ${this.conversationSequence}, payload id: ${payload.uniqueConversationId}`);
            }
            break;
          case "notification":
            this.notificationSubject.next(payload)
            if (payload.text === 'processing started') {
              this.processing = true
              this.sendMessage('notification', 'context')
            } else if (payload.text === 'processing ended') {
              this.processing = true
            }
            console.info(payload);
            break;
          default:
            break;
        }
      })
    }
  }

  sendMessage(type: string, message: any) {
    interface SocketMessage {
      payload: object,
      type: string,
      timestamp: string
    }

    this.conversationSequence++
    console.log(`conversationSequence: ${this.conversationSequence}`);

    let SocketPayload: SocketMessage = {
      payload: {
        "message": message,
        "pageId": this.currentContextObj.pageId,
        "sectionId": this.currentContextObj.sectionId,
        "conversationSequence": this.conversationSequence,
        "entities": this.getEntities()
      },
      type: type,
      timestamp: Date()

    }
    this.socket.emit('message', SocketPayload);
  }


  getEntities() {
    if (this.currentContextObj.pageId === 'pageId-reservation') {
      console.log('getEntities =>', this._reservationService.getReservationFormJson())
      return this._reservationService.getReservationFormJson()
    }
    return this.reservationFormEntities
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
    this._helperService.log('info', msg);
    if (msg.entityId) {


      //for reservation form
      // @ts-ignore
      let conversationId = (msg.conversation && msg.conversation.conversationId) ? msg.conversation.conversationId : ''
      this._reservationService.setReservationForm(conversationId, msg.entities)

      if (msg.entityId == 'entityId-select-serving-size') {
        this.voiceServingSize = msg.entityName.toLowerCase()
        // @ts-ignore
        document.getElementById(msg.entityName.toLowerCase())?.click()
        return
      }

      // @ts-ignore
      let template = document.getElementById(msg.entityId)
      // @ts-ignore
      let list = template.getElementsByTagName('a')
      for (let i = 0; i < list.length; i++) {
        if (list[i].getAttribute('id') == msg.ctaId) {
          list[i]?.click()
        }
      }
      // @ts-ignore
      document.getElementById(msg.entityId)?.click()
    }
  }

  performClickAction(entityId:any,ctaId:any){
    // // @ts-ignore
    // let template = document.getElementById(msg.entityId)
    // // @ts-ignore
    // let list = template.getElementsByTagName('a')
    // for (let i = 0; i < list.length; i++) {
    //   if (list[i].getAttribute('id') == msg.ctaId) {
    //     list[i]?.click()
    //   }
    // }
    // // @ts-ignore
    // document.getElementById(msg.entityId)?.click()
  }

  getCurrentRoute() {
    return this.router.url
  }

  getCurrentContext() {
    let currentRoute = this.getCurrentRoute()
    if (currentRoute.indexOf('?') > 0) {
      currentRoute = currentRoute.substr(0, currentRoute.indexOf('?'))
    }
    this.currentContextList.filter((item: any) => {
      if (item.currentRoute === currentRoute) {
        this.currentContextObj = JSON.parse(JSON.stringify(item))
      }
    })
  }

  setEntities(value: any) {
    this.reservationFormEntities.forEach((item: any) => {
      if (item.entityStatus) {
        item.entityValue = value
      }
    })
  }

  getFocusOnField(entityId: any) {
    let obj = this.reservationFormEntities.find((item: any) => item.entityId == entityId && item.entityStatus)
    return !!obj
  }
}
