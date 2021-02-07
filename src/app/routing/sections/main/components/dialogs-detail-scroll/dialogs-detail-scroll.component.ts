import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import { NgScrollbar } from 'ngx-scrollbar'
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { updateDialogScroll } from 'src/app/store/actions/main.actions'
import { Store } from 'src/app/store/core/store'
import { getActiveReceiverID, getDialogScroll } from 'src/app/store/selectors/main.selectors'
import { IAppState } from 'src/app/store/states/app.state'

@Component({
    selector: 'app-main-dialogs-detail-scroll',
    templateUrl: './dialogs-detail-scroll.component.html',
    styleUrls: ['./dialogs-detail-scroll.component.scss'],
})
export class DialogsDetailScrollComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    @ViewChild('scrollbar') scrollbar!: NgScrollbar
    @ViewChild('wrapper') wrapper!: ElementRef

    @Input() sendMessageEvent!: Observable<void>

    wrapperHeight = new BehaviorSubject(0)
    wrapperHeight$ = this.wrapperHeight.asObservable()

    scroll = new BehaviorSubject(0)
    scroll$ = this.scroll.asObservable()

    sub = new Subscription()

    constructor(private readonly store: Store<IAppState>) {}

    ngOnInit() {
        this.sub.add(
            this.sendMessageEvent.subscribe(() => {
                this.scroll.next(this.wrapperHeight.getValue())
            })
        )
    }

    ngAfterViewInit() {
        this.sub.add(
            this.store
                .select(getActiveReceiverID())
                .pipe(
                    map((activeReceiverID) => {
                        if (activeReceiverID) {
                            const scroll = this.store.selectSnapshot(getDialogScroll(activeReceiverID))

                            if (scroll !== null) return scroll
                            return null
                        }
                        return null
                    }),
                    switchMap((scroll) => {
                        if (scroll === null) {
                            return this.wrapperHeight$
                        }
                        return of(scroll)
                    })
                )
                .subscribe((scroll) => {
                    this.scroll.next(scroll)
                })
        )

        this.sub.add(
            this.scrollbar.scrolled.subscribe((event) => {
                const scroll = (<HTMLElement>(<Event>event).target).scrollTop
                const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

                if (activeReceiverID) {
                    this.store.dispatch(updateDialogScroll(activeReceiverID, scroll))
                }
            })
        )

        this.sub.add(
            this.scroll$.subscribe((scroll) => {
                setTimeout(() => {
                    this.scrollbar.scrollTo({
                        top: scroll,
                        duration: 0,
                    })
                })
            })
        )
    }

    ngAfterViewChecked() {
        const wrapperHeight = (<HTMLElement>this.wrapper.nativeElement).offsetHeight

        if (wrapperHeight !== this.wrapperHeight.getValue()) {
            this.wrapperHeight.next(wrapperHeight)
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe()
    }
}
