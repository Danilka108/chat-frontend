import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-dialogs-message',
  templateUrl: './dialogs-message.component.html',
  styleUrls: ['./dialogs-message.component.scss']
})
export class DialogsMessageComponent implements OnInit {

  @HostBinding('class.ownMsg') isOwnMsg = true

  constructor() { }

  ngOnInit(): void {
  }

}
