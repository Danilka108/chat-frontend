import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';;
import * as moment from 'moment'
import { IDialog } from '../../interface/dialog.interface';

@Component({
  selector: 'app-main-dialogs-group',
  templateUrl: './dialogs-group.component.html',
  styleUrls: ['./dialogs-group.component.scss'],
})
export class DialogsGroupComponent implements OnInit{
  @Input() dialogs$!: Observable<IDialog[]>
  @Output() receiverChange = new EventEmitter<number>()
  @HostBinding('class.small') isSmallSize = false

  activatedReceiverID: null | number = null  
  smallSizeMax = 800

  ngOnInit() {
    this.onResize()
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth <= this.smallSizeMax) {
      this.isSmallSize = true
    } else {
      this.isSmallSize = false
    }
  }

  parseDate(d: string) {
    const now = moment()
    const date = moment(d)

    const diff = date.diff(now, 'days')

    if (diff < 1) {
      return date.format('HH:mm')
    } else if (diff <= 30) {
      return date.format('DD.MM')
    } else {
      return date.format('DD.MM.YY')
    }
  }

  onClick(receiverID: number) {
    if (receiverID !== this.activatedReceiverID) {
      this.receiverChange.emit(receiverID)
      this.activatedReceiverID = receiverID
    }
  }
}
