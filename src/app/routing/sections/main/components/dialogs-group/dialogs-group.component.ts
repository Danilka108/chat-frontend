import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment'
import { IDialog } from '../../interface/dialog.interface';
import { MainStore } from 'src/app/store/main/main.store';
import { ActivatedRoute, Router } from '@angular/router';
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main-dialogs-group',
  templateUrl: './dialogs-group.component.html',
  styleUrls: ['./dialogs-group.component.scss'],
})
export class DialogsGroupComponent implements OnInit, OnDestroy {
  dialogs$!: Observable<IDialog[]>
  activeReceiverID$!: Observable<number | null>
  subs!: Subscription

  @HostBinding('class.small') isSmallSize = false
  smallSizeMax = 800

  constructor(
    private readonly mainStore: MainStore,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.activeReceiverID$ = this.mainStore.getActiveReceiverID$()
    this.dialogs$ = this.mainStore.getDialogs$().pipe(
      map(dialogs => {
        return dialogs.sort((a, b) => {
          const dateA = moment(a.createdAt).valueOf()
          const dateB = moment(b.createdAt).valueOf()

          if (dateA > dateB) return -1
          else if (dateA === dateB) return 0
          else return 1
        })
      })
    )

    this.subs = this.route.params
      .subscribe(params => {
        const id = parseInt(params['id'])
        if (!isNaN(id)) this.mainStore.setActiveReceiverID(id)
      })

    this.onResize()
  }

  ngOnDestroy() {
    if (this.subs) this.subs.unsubscribe()
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

    const diff = now.diff(date, 'days')

    if (diff < 1) {
      return date.format('HH:mm')
    } else if (diff <= 30) {
      return date.format('DD.MM')
    } else {
      return date.format('DD.MM.YY')
    }
  }

  onClick(receiverID: number) {
    const activeReceiverID = this.mainStore.getActiveReceiverID()

    if (activeReceiverID !== receiverID) {
      this.router.navigate([mainSectionDialogsPath.full, receiverID])
    }
  }
}
