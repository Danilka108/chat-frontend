import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable, of } from 'rxjs'
import { first, map, switchMap } from 'rxjs/operators'
import { selectUserID, selectUserName } from 'src/app/store/selectors/auth.selectors'
import { selectActiveReceiverID, selectDialog } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import {
    MESSAGE_WRAPPER_WIDTH_FACTOR_DESKTOP,
    MESSAGE_WRAPPER_WIDTH_FACTOR_MOBILE,
    MESSAGE_WRAPPER_WIDTH_FACTOR_TABLET,
    MOBILE_WIDTH_BREAK_POINT,
    TABLET_WIDTH_BREAK_POINT,
} from '../../dialogs.constants'
import { IMessage, IMessagesSectionBySender } from '../../interface/message.interface'

@Component({
    selector: 'app-dialogs-messages-section-by-sender',
    templateUrl: './dialogs-messages-section-by-sender.component.html',
    styleUrls: ['./dialogs-messages-section-by-sender.component.scss'],
})
export class DialogsMessagesSectionBySenderComponent implements AfterViewInit, AfterViewChecked {
    @Input() sectionBySender!: IMessagesSectionBySender
    @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>

    wrapperWidth = 0
    wrapperWidthFactor = MESSAGE_WRAPPER_WIDTH_FACTOR_DESKTOP
    isInitWrapperWidth = true

    constructor(private readonly store: Store<AppState>, private readonly changeDetectorRef: ChangeDetectorRef) {}

    ngAfterViewChecked(): void {
        const wrapperWidth = this.wrapper.nativeElement.clientWidth

        if (wrapperWidth > this.wrapperWidth && this.isInitWrapperWidth) {
            this.wrapperWidth = wrapperWidth
            this.changeDetectorRef.detectChanges()
        } else {
            this.isInitWrapperWidth = false
        }
    }

    @HostListener('window:resize')
    onResize(): void {
        if (window.innerWidth < MOBILE_WIDTH_BREAK_POINT) {
            this.wrapperWidthFactor = MESSAGE_WRAPPER_WIDTH_FACTOR_MOBILE
        } else if (window.innerWidth <= TABLET_WIDTH_BREAK_POINT) {
            this.wrapperWidthFactor = MESSAGE_WRAPPER_WIDTH_FACTOR_TABLET
        } else {
            this.wrapperWidthFactor = MESSAGE_WRAPPER_WIDTH_FACTOR_DESKTOP
        }

        this.wrapperWidth = this.wrapper.nativeElement.offsetWidth

        this.changeDetectorRef.detectChanges()
    }

    ngAfterViewInit(): void {
        this.onResize()
    }

    getSenderName(senderID: number): Observable<string> {
        return this.store.pipe(
            select(selectUserID),
            first(),
            switchMap((userID) => {
                if (userID === senderID) return this.store.pipe(select(selectUserName), first())

                return this.store.pipe(
                    select(selectDialog, { receiverID: senderID }),
                    first(),
                    map((dialog) => (dialog === null ? '' : dialog.receiverName))
                )
            })
        )
    }

    getUserName(): Observable<string> {
        return this.store.pipe(select(selectUserName))
    }

    getReceiverName(): Observable<string> {
        return this.store.pipe(
            select(selectActiveReceiverID),
            switchMap((receiverID) =>
                receiverID === null ? of(null) : this.store.pipe(select(selectDialog, { receiverID }), first())
            ),
            map((dialogs) => {
                return dialogs?.receiverName || ''
            })
        )
    }

    messageIdentify(_: number, item: IMessage): number {
        return item.messageID
    }
}
