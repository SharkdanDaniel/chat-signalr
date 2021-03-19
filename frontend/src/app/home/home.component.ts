import { ChatService } from './../chat.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup

  constructor(private fb: FormBuilder, private chatService: ChatService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      roomType: [null, [Validators.required]],
    })
  }

  onSubmit(){
    this.chatService
  }

}
