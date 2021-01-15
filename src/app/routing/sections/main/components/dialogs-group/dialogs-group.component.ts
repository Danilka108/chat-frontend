import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import * as moment from 'moment'
import { IDialog } from '../../interface/dialog.interface';
import { MainStore } from 'src/app/store/main/main.store';
import { ActivatedRoute, Router } from '@angular/router';
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants';

@Component({
  selector: 'app-main-dialogs-group',
  templateUrl: './dialogs-group.component.html',
  styleUrls: ['./dialogs-group.component.scss'],
})
export class DialogsGroupComponent implements OnInit {
  dialogs!: IDialog[]
  activatedReceiverID: null | number = null
  @HostBinding('class.small') isSmallSize = false
  smallSizeMax = 800

  constructor(
    private readonly mainStore: MainStore,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.mainStore.main$.subscribe(mainStore => {
      this.dialogs = mainStore.dialogs
      this.activatedReceiverID = mainStore.activeReceiverID
    })

    this.route.params.subscribe(params => {
        const id = parseInt(params['id'])
        if (!isNaN(id)) {
            this.mainStore.setActiveReceiverID(id)
        }
    })

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
      this.router.navigate([mainSectionDialogsPath.full, receiverID])
    }
  }
}
