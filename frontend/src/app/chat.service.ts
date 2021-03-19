import { Message } from './message';
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messageReceived = new EventEmitter<string>();
  connectionEstablished = new EventEmitter<boolean>();
  userMached = new EventEmitter<boolean>();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor() {
    this.createConnection();
    this.receiveMessage();
    this.startConnection();
  }

  sendMessage(message: Message) {
    this._hubConnection.invoke('SendMessage', message);
  }

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001' + '/chatHub')
      // .withUrl('256-765-647.local' + '/chatHub')
      .build();
  }

  private startConnection(): void {
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

  private receiveMessage(): void {
    this._hubConnection.on('ReceiveMessage', (data: any) => {
      this.messageReceived.emit(data);
    });
  }
}
