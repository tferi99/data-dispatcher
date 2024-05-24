import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SendComponent } from './send/send.component';
import { ReceiveComponent } from './receive/receive.component';
import { WEBSOCKET_CONFIG } from './receive/connection/websocket.config';
import { SocketIoModule } from 'ngx-socket-io';
import { LoggerModule } from 'ngx-logger';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SendComponent,
    ReceiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    LoggerModule.forRoot({
      colorScheme: ['purple', 'teal', 'gray', 'gray', 'red', 'red', 'red'],
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
      disableConsoleLogging: false,
    }),
    SocketIoModule.forRoot(WEBSOCKET_CONFIG),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
