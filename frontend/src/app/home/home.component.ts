import { ChatService } from './../chat.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      sexo: [null, [Validators.required]],
      sexoProcurando: [null, [Validators.required]]
    });
    this.chatService.userMatched.subscribe(res => {
      console.log('usuários encontrados');
    });
    // this.checkFocus();
  }

  onSubmit() {
    console.log(this.form.value);
    this.chatService.createConnection();
    this.chatService.startConnection(this.form.value);
    // this.router.navigate(['chat']);
    // setTimeout(() => {
    //   console.log('connectionID', this.chatService.connectionId());
    // }, 2000);
    // this.form.get('connctionId').setValue(this.chatService.connectionId());
    // await this.chatService.searchUser(this.form.value);
    // this.chatService.receiveMessage();
  }

  checkFocus() {
    let i = 0;
    setInterval(() => {
      if (document.hasFocus()) {
        console.log(++i);
      }
    }, 1000);
  }
}
