import { Router } from '@angular/router';
import { User } from './user';
import { Message } from './message';
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messageReceived = new EventEmitter<string>();
  isSentMessage = new EventEmitter();
  isReceivedMessage = new EventEmitter();
  isReadMessage = new EventEmitter();
  connectionEstablished = new EventEmitter<boolean>();
  matchedDisconnected = new EventEmitter();
  userMatched = new EventEmitter();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor(private router: Router) {}

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
        this.searchUser(user);
        this.onReceiveMatch();
        this.onIsDisconnected();
      })
      .catch(err => {
        console.log('Erro ao tentar conectar, reconectando...');
        setTimeout(function() {
          this.startConnection();
        }, 5000);
      });
  }

  // ENVIA A MENSAGEM
  sendMessage(message: Message) {
    this._hubConnection.invoke('SendMessage', message);
    this.onSentMessage();
  }

  // AVISA AO SERVIDOR QUE RECEBEU A MENSAGEM
  justReadMessage(){
    this._hubConnection.invoke('ReadMessage');
    this.onReadMessage();
  }


  // PRIVATE METHODS

  // PROCURA POR UM PARCEIRO DE CHAT
  private searchUser(user: User) {
    this._hubConnection.invoke('Search', user);
  }

  // RECEBE MENSAGEM
  private receiveMessage(): void {
    this._hubConnection.on('ReceiveMessage', (data: any) => {
      this.messageReceived.emit(data);
      this.receivedMessage();
    });
  }

  // AVISA QUE RECEBEU A MENSAGEM
  private receivedMessage() {
    this._hubConnection.invoke('ReceivedMessage');
    this.onReceivedMessage();
  }

  // ESCUTA QUANDO O OUTRO USUÁRIO RECEBEU A MENSAGEM
  private onReceivedMessage() {
    this._hubConnection.on('IsReceivedMessage', () => {
      this.isReceivedMessage.emit();
    })
  }

  // ESCUTA O AVISO QUANDO ACHOU UM PARCEIRO DE CHAT
  private onReceiveMatch() {
    this._hubConnection.on('Match', () => {
      this.userMatched.emit();
      this.receiveMessage();
      setTimeout(() => {
        this.router.navigate(['chat']);
      }, 200);
    });
  }

  // ESCUTA O AVISO QUANDO ENVIOU A MENSAGEM
  private onSentMessage() {
    this._hubConnection.on('SentMessage', () => {
      this.isSentMessage.emit();
    });
  }

  // ESCUTA O AVISO QUANDO LERAM A MENSAGEM
  private onReadMessage() {
    this._hubConnection.on('IsReadMessage', () => {
      this.isReadMessage.emit();
    })
  }

  // ESCUTA O AVISO QUANDO O OUTRO USUÁRIO DESCONECTOU
  private onIsDisconnected() {
    this._hubConnection.on('Disconnect', () => {
      this.matchedDisconnected.emit();
    });
  }
}
