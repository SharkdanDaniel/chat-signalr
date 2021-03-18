import { ChatService } from './../chat.service';
import { Message } from './../message';
import { Component, OnInit } from '@angular/core';
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
  
  constructor(private fb: FormBuilder, private chatService: ChatService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      msg: [null, [Validators.required]],
      id: [null],
      date: [null],
      type: [null],
    });
    this.chatService.messageReceived.subscribe((data: any) => {
      console.log(data);      
      this.messageReceived(data);
    });
    console.log(window.location.href);    
  }

  onSubmit(ev?) {   
    let message = this.form.value;
    if (this.form.valid && message.msg.trim() != '') {
      this.form.reset();
      message.date = new Date();
      this.sendMsg(message);
      console.log('submit');
    }
  }

  sendMsg(message: Message) {
    this.chatService.sendMessage(message);
    this.messages.push({ type: 'primary', msg: `${message.msg}                    `, date: message.date });
  }

  messageReceived(message: Message) {
    this.messages.push({ type: 'secondary', msg: `${message.msg}              `, date: message.date });
  }
}
