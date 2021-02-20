import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    NgZone,
    OnDestroy,
    Output,
} from '@angular/core'
import { fromEvent, Subscription } from 'rxjs'
import { debounceTime, tap } from 'rxjs/operators'

@Directive({
    selector: '[scrollbar]',
})
export class ScrollbarDirective {
    onMouseWheel(event: Event) {}
}
