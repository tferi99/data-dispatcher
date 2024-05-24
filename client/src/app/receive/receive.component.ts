import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { WsEvent } from './event.model';
import { WebSocketService } from './connection/websocket.service';
import { add } from 'ngx-bootstrap/chronos';


export interface GeneralData {
  data?: string;
}

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent {
  private received: string[] = [];
  general$!: Observable<any>;

  constructor(private socket: Socket) {
    this.general$ = this.socket.fromEvent<any>(WsEvent.General);
    this.general$ .subscribe({
      next: (payload: GeneralData) => {
        this.received.push(payload.data ?? '');
      },
    });

  }

  get receivedAsLines(): string {
    return this.received.join('\n');
  }

  get receivedCount(): number {
    return this.received.length;
  }

  onAdd() {
    this.received.push(new Date().toString());
    console.log('addd');
  }
}
