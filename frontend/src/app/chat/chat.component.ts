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

  title = 'ClientApp';  
  txtMessage: string = '';  
  uniqueID: string = new Date().getTime().toString();  
  message: Message;

  constructor(private fb: FormBuilder, private chatService: ChatService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      msg: [null, [Validators.required]]
    });
    this.chatService.messageReceived.subscribe((data: any) => {
      console.log(data);      
      this.messageReceived(data);
    });
    console.log(window.location.href);    
  }

  // sendMessage(): void {  
  //   if (this.txtMessage) {  
  //     this.message;  
  //     this.message.clientuniqueid = this.uniqueID;  
  //     this.message.type = "sent";  
  //     this.message.message = this.txtMessage;  
  //     this.message.date = new Date();  
  //     this.messages.push(this.message);  
  //     this.chatService.sendMessage(this.message);  
  //     this.txtMessage = '';  
  //   }  
  // }  
  // private subscribeToEvents(): void {  
  
  //   this.chatService.messageReceived.subscribe((message: Message) => {  
  //     this._ngZone.run(() => {  
  //       if (message.clientuniqueid !== this.uniqueID) {  
  //         message.type = "received";  
  //         this.messages.push(message);  
  //       }  
  //     });  
  //   });  
  // }  

  onSubmit(ev?) {   
    let msg = this.form.get('msg').value;
    if (this.form.valid && msg.trim() != '') {
      this.form.reset();
      this.sendMsg(msg);
      console.log('submit');
    }
  }

  // onSubmit2(ev) {
  //   let msg = this.form.get('msg').value;
  //   if (this.form.valid && msg.trim() != '') {
  //     this.form.reset();
  //     this.sendOther(msg);
  //     console.log('submit');
  //   }
  // }

  sendMsg(msg) {
    this.chatService.sendMessage(msg);
    let date = new Date();
    this.messages.push({ type: 'primary', msg: `${msg}                    `, date: date });
  }

  messageReceived(msg) {
    let date = new Date();
    this.messages.push({ type: 'secondary', msg: `${msg}              `, date: date });
  }
}
