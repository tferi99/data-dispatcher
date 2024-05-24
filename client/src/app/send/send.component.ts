import { Component } from '@angular/core';
import { WebSocketService } from '../receive/connection/websocket.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent {
  message?: string;
  constructor(
    private webSocketService: WebSocketService
  ) {}

  onPing() {
    this.webSocketService.ping(this.message ?? '');
  }

  send1() {

  }

  send2() {

  }
}
