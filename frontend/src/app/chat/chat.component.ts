import { ChatService } from './../chat.service';
import { Message } from './../message';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  form: FormGroup;
  messages: Message[] = [];
  showSend = false;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private render: Renderer2
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      msg: [null, [Validators.required]],
      id: [null],
      date: [null],
      type: [null]
    });
    this.chatService.messageReceived.subscribe((data: any) => {
      // console.log(data);
      this.messageReceived(data);
    });
    this.chatService.matchedDisconnected.subscribe(res => {
      console.log('parceiro desconectado');
    });
    this.chatService.isSentMessage.subscribe(res => {
      console.log('menssagem enviada!');
    });
    this.chatService.isReceivedMessage.subscribe(res => {
      console.log('mensagem recebida!');
    });
    this.chatService.isReadMessage.subscribe(res => {
      console.log('usuário leu minha mensagem');
    });
  }

  onSubmit(ev?) {
    let message = this.form.value;
    if (this.form.valid && message.msg.trim() != '') {
      this.form.reset();
      message.date = new Date();
      this.sendMsg(message);
    }
  }

  sendMsg(message: Message) {
    this.chatService.sendMessage(message);
    this.messages.push({
      type: 'primary',
      msg: message.msg,
      date: message.date
    });
  }

  messageReceived(message: Message) {
    this.messages.push({
      type: 'secondary',
      msg: message.msg,
      date: message.date
    });
  }

  // onFocus(){
  //   let body = document.querySelector('body');

  //   body.onfocus()
  // }
}
