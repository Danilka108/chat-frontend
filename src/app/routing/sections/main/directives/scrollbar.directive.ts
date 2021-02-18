import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { tap } from "rxjs/operators";

@Directive({
    selector: '[app-main-scrollbar]'
})
export class ScrollbarDirective implements AfterViewInit, OnDestroy {
    element!: HTMLElement
    subscription = new Subscription()

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement
    }

    ngAfterViewInit() {
        // this.sub = fromEvent(this.element, 'scroll').pipe(
        //     tap(() => console.log('scrolling'))
        // ).subscribe()
    }

    @HostListener('scroll')
    onScroll() {
        console.log('scrolling')
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}