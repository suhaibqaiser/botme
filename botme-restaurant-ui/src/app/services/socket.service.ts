import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";

export const WS_ENDPOINT = environment.wsEndpoint;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket$: any;
  private messagesSubject = new Subject();
  messages = this.messagesSubject.asObservable();

  currentContextList = [
    {
      currentRoute:'online shop',
      pageId:'pageId-order-online',
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
    }
  ]
  currentContextObj = {
    currentRoute:'',
    pageId:'',
    sectionId: ''
  }

  voiceServingSize = ''
  responseLabel = 'Noting to display'
  speachInput = new FormControl('')

  constructor(private router: Router) {
    this.connect();
  }

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      this.socket$.subscribe(
        (msg: string) => {
          this.messagesSubject.next(msg)
          this.fireInteractionEvent(msg)
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
      "pageId": this.currentContextObj.pageId,
      "sectionId": this.currentContextObj.sectionId
    }
    console.log('sendMessage =>', wsPayload)
    this.socket$.next(wsPayload);
  }

  close() {
    this.socket$.complete();
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
    console.log('Response =>', msg.message)
    let tempMessage = msg.message
    this.responseLabel = tempMessage.text

    if (tempMessage.entityId == 'entityId-select-serving-size') {
      this.voiceServingSize = tempMessage.entityName.toLowerCase()
      // @ts-ignore
      document.getElementById('ctaId-select-serving-size').click()
      return
    }

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

  getCurrentContext(){
    let currentRoute = this.router.url.replace(/\//g, "").replace("-", " ");
    if (currentRoute.indexOf('?') > 0) {
      currentRoute = currentRoute.substr(0, currentRoute.indexOf('?'))
    }
    console.log('getCurrentContext route=>',currentRoute)
    this.currentContextList.filter((item:any)=>{
      if( item.currentRoute === currentRoute){
        this.currentContextObj = JSON.parse(JSON.stringify(item))
      }
    })
    console.log('currentContextObj =>',this.currentContextObj)
  }
}
