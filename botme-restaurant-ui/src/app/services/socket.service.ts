import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
export const WS_ENDPOINT = environment.wsEndpoint;

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket$: any;
    private messagesSubject$ = new Subject();

    messages$ = this.messagesSubject$.asObservable();

    connect(): void {
        if (!this.socket$ || this.socket$.closed) {
            this.socket$ = this.getNewWebSocket();
            this.socket$.subscribe(
                (msg: string) => { this.messagesSubject$.next(msg) },
                (err: any) => console.log(err),
                () => this.close()
            );
            ;
        }
    }

    private getNewWebSocket() {
        return webSocket(WS_ENDPOINT);
    }
    sendMessage(msg: any) {
        this.socket$.next(msg);
    }
    close() {
        this.socket$.complete();
    }
}