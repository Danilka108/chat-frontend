import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { pairwise, switchMap } from 'rxjs/operators'
import { Store } from 'src/app/store/core/store'
import { IAppState } from 'src/app/store/states/app.state'

@Component({
    selector: 'app-main-dialogs-detail-scroll',
    templateUrl: './dialogs-detail-scroll.component.html',
    styleUrls: ['./dialogs-detail-scroll.component.scss'],
})
export class DialogsDetailScrollComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    @ViewChild('wrapper') wrapper!: ElementRef
    @ViewChild('view') view!: ElementRef

    @Input() getMessagesOnTopEvent!: Observable<void>
    @Output() top = new EventEmitter<void>()

    viewHeight = new BehaviorSubject(0)
    viewHeight$ = this.viewHeight.asObservable()

    subscription = new Subscription()

    constructor(private readonly store: Store<IAppState>) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit() {}

    ngAfterViewInit() {
        const wrapperNativeElement = this.wrapper.nativeElement as HTMLElement

        wrapperNativeElement.onscroll = () => {
            if (wrapperNativeElement.scrollTop === 0) {
                this.top.emit()
            }
        }

        this.getMessagesOnTopEvent
            .pipe(
                switchMap(() => this.viewHeight),
                pairwise()
            )
            .subscribe(([prevViewHeight, nextViewHeight]) => {
                wrapperNativeElement.scrollTop = nextViewHeight - prevViewHeight
            })
    }

    ngAfterViewChecked() {
        // const wrapperNativeElement = this.wrapper.nativeElement as HTMLElement
        const viewNativeElement = this.view.nativeElement as HTMLElement

        // wrapperNativeElement.scrollTop = wrapperNativeElement.scrollWidth

        this.viewHeight.next(viewNativeElement.offsetHeight)
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
