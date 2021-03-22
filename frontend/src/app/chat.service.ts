import { User } from './user';
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
  // private connectionId: string;

  constructor() {
    // this.createConnection();
    // this.receiveMessage();
    // this.receiveMatch();
    // this.startConnection();
  }

  // get getConnectionId() {
  //   return this.connectionId;
  // }

  sendMessage(message: Message) {
    this._hubConnection.invoke('SendMessage', message);
  }

  createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      // .withUrl('https://localhost:5001' + '/chatHub')
      .withUrl('http://191.188.227.163:5000' + '/chatHub')
      .build();
  }

  startConnection(user?: User): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Conexão hub iniciada');
        this.connectionEstablished.emit(true);
        // this.connectionId = this._hubConnection.connectionId;
        // user.connectionId = this._hubConnection.connectionId;
        this.searchUser(user);
        this.receiveMatch();
        this.receiveMessage();
      })
      .catch(err => {
        console.log('Erro ao tentar conectar, reconectando...');
        setTimeout(function() {
          this.startConnection();
        }, 5000);
      });
  }

  private searchUser(user: User) {
    this._hubConnection.invoke('Search', user);
  }

  private receiveMessage(): void {
    this._hubConnection.on('ReceiveMessage', (data: any) => {
      this.messageReceived.emit(data);
    });
  }

  private receiveMatch() {
    this._hubConnection.on('Match', (data: any) => {
      this.userMatched.emit(true);
    });
  }
}
