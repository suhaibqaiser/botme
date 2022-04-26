import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from "@angular/router";
import {environment} from 'src/environments/environment';
import {io} from "socket.io-client";
import {BotmeClientService} from './botme-client.service';
import {HelperService} from "./helper.service";
import {ReservationService} from "./reservation.service";
import {ContextService} from "./context.service";
import {ProductSuggestionService} from "./product-suggestion.service";


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
  conversationSequence: number = 0

  voiceServingSize = ''
  parentEntity = {
    entityId: "",
    entityValue: ""
  }

  isClickFound: any = false

  constructor(private _productSuggestionService: ProductSuggestionService, private _clientService: BotmeClientService, private _contextService: ContextService, private _reservationService: ReservationService, private router: Router, private clients: BotmeClientService, public _helperService: HelperService) {

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
              this.fireInteractionEvent(payload)
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

    this.conversationSequence++
    console.log(`conversationSequence: ${this.conversationSequence}`);

    let requestPayload = {
      inputText: {
        language: "english",
        textValue: message,
        timestamp: Date()
      },
      context: {
        restaurantId: this._helperService.getRestaurantIdOnAuthBasis(),
        pageId: this._contextService.currentContextObj.pageId,
        conversationSequence: this.conversationSequence,
        sectionId: this._contextService.currentContextObj.sectionId,
        type: type,
        parentEntity: this.parentEntity,
        entities: this.getEntities()
      }
    }

    console.log('requestPayload =>', requestPayload)
    this.socket.emit('message', requestPayload);
  }


  /**
   * Getting the entities array on the basis of 'pageId'
   */
  getEntities() {
    if (this._contextService.currentContextObj.pageId === 'pageId-reservation') {
      return this._reservationService.getReservationFormJson()
    }
    return [
      {
        "clickAttribute": "href, button",
        "entityId": "",
        "entityValue": null,
        "keywords": ""
      }
    ]
  }

  setParentEntity(parentEntityObj: any) {
    this.parentEntity = {
      entityId: parentEntityObj.entityId,
      entityValue: parentEntityObj.entityValue
    }
  }

  /**
   * Here we are passing the response from web server and interacting with web ui
   * @param msg
   */
  fireInteractionEvent(msg: any) {

    console.log('fireInteractionEvent =>', msg)

    this._helperService.log('info', msg);
    this._productSuggestionService.reset()
    if (msg.context.pageId) {


      //for reservation form
      // @ts-ignore
      if (msg.context.pageId === 'pageId-reservation') {
        let conversationId = (msg.conversation && msg.conversation.conversationId) ? msg.conversation.conversationId : ''
        this._reservationService.setReservationForm(conversationId, msg.context.entities)
        document.getElementById(msg.ctaId)?.click()
        return;
      }

      // for product suggestion we are setting the products in product suggestion service
      if (msg.context.entities && msg.context.entities[0].keywords.length) {
        this._productSuggestionService.setSuggestedProducts(msg.context.entities[0].entityValue, msg.context.entities[0].keywords)
        return;
      }

      this.performClickAction(msg.context.entities, msg.ctaId)
    }
  }

  performClickAction(entities: any, ctaId: any) {
    this.isClickFound = false
    if (entities && entities.length) {
      entities.forEach((item: any) => {

        // selection serving size
        if (item.entityId == 'entityId-select-serving-size') {
          this.voiceServingSize = item.entityValue.toLowerCase()
          // @ts-ignore
          document.getElementById(item.entityValue.toLowerCase())?.click()
          return
        }


        // @ts-ignore
        let template = document.getElementById(item.entityId)
        // @ts-ignore
        let list = (template && template.getElementsByTagName('a')) ? template.getElementsByTagName('a') : []
        if (list && list.length) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].getAttribute('id') == ctaId) {
              list[i]?.click()
              this.isClickFound = true
            }
          }
        }
        document.getElementById(item.entityId)?.click()
      })
    }
    console.log('isClickFound in entity list =>', this.isClickFound)
    if (!this.isClickFound) {
      this.performActionOnCTAId(ctaId)
      this.isClickFound = false
    }
  }

  /**
   * if click action is not performed in entities list then we go to ctaId
   * @param ctaId
   */
  performActionOnCTAId(ctaId: any) {
    document.getElementById(ctaId)?.click()
  }
}
