import { Message } from './message';
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messageReceived = new EventEmitter<string>();
  connectionEstablished = new EventEmitter<boolean>();
  userMatched = new EventEmitter<boolean>();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor() {
    // this.createConnection();
    // this.receiveMessage();
    // this.startConnection();
  }

  sendMessage(message: Message) {
    this._hubConnection.invoke('SendMessage', message);
  }

  createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001' + '/chatHub')
      // .withUrl('https://b43dd29e7928.ngrok.io' + '/chatHub')
      .build();
  }

  startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Conexão hub iniciada');
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Erro ao tentar conectar, reconectando...');
        setTimeout(function() {
          this.startConnection();
        }, 5000);
      });
  }

  receiveMessage(): void {
    this._hubConnection.on('ReceiveMessage', (data: any) => {
      this.messageReceived.emit(data);
    });
  }
}
