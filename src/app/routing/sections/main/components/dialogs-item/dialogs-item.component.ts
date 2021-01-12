import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-dialog',
  templateUrl: './main-dialog.component.html',
  styleUrls: ['./main-dialog.component.scss']
})
export class DialogsItemComponent {
  @Input() active!: boolean
  @Input() toggle!: () => {}

  @Input() receiver!: string
  @Input() date!: string
  @Input() message!: string

  constructor() { }
}