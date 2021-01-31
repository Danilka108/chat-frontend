import { EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { Component, HostListener, ViewChild } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { ScrollbarViewDirective, ScrollbarViewWrapperDirective } from '../../directives/scrollbar-view.directive'
import { IScrollbarConfig } from '../../interfaces/config.interface'
import { IScrollbarScroll } from '../../interfaces/scroll.interface'
import { IScrollbarElementSize, IScrollbarViewSize } from '../../interfaces/size.interface'
import { IScrollbarDelta } from '../../interfaces/track-delta.interface'

@Component({
    selector: 'app-scrollbar-view',
    templateUrl: './scrollbar-view.component.html',
    styleUrls: ['./scrollbar-view.component.scss'],
})
export class ScrollbarViewComponent implements OnInit, OnDestroy {
    @ViewChild(ScrollbarViewWrapperDirective) wrapper!: ScrollbarViewWrapperDirective
    @ViewChild(ScrollbarViewDirective) view!: ScrollbarViewDirective

    @Input() config!: IScrollbarConfig
    @Input() updateScrollbarEvent$!: Observable<void>
    @Input() trackDelta$!: Observable<IScrollbarDelta>
    @Input() isTrackScroll!: boolean

    @Output() sizeChange = new EventEmitter<IScrollbarViewSize>()
    @Output() scrollChange = new EventEmitter<IScrollbarScroll>()

    viewClasses: {
        [key: string]: boolean
    } = {
        ['view']: true,
        ['no-select']: false,
        ['max-height']: false,
        ['max-width']: false,
    }

    isBottom = false
    isRight = false
    isShiftPressed = false

    scroll = {
        x: 0,
        y: 0,
    }

    viewWrapperSize = {
        height: 0,
        width: 0,
    }
    viewSize = {
        height: 0,
        width: 0,
    }

    touchStart = {
        x: 0,
        y: 0,
    }
    touchDelta = {
        x: 0,
        y: 0,
    }
    isTouch = false

    trackDeltaSub!: Subscription
    updateScrollSub!: Subscription

    ngOnInit() {
        this.trackDeltaSub = this.trackDelta$.subscribe((delta) => {
            this.calculateHorizontalScroll(delta.x)
            this.calculateVerticalScroll(delta.y)
        })

        this.updateScrollSub = this.updateScrollbarEvent$.subscribe(() => {
            this.updateInitialPosition()

            if (this.isBottom) this.scroll.y = this.viewWrapperSize.height - this.viewSize.height
            else this.scroll.y = 0
            if (this.isRight) this.scroll.x = this.viewWrapperSize.width - this.viewSize.width
            else this.scroll.x = 0

            this.scrollChange.emit(this.scroll)

            this.view.updateScrollbar()
        })

        this.scrollChange.emit(this.scroll)
        this.updateInitialPosition()
    }

    updateInitialPosition() {
        if (this.config.initialPosition.veritcal === 'top') this.isBottom = false
        if (this.config.initialPosition.veritcal === 'bottom') this.isBottom = true

        if (this.config.initialPosition.horizontal === 'left') this.isRight = false
        if (this.config.initialPosition.horizontal === 'right') this.isRight = true
    }

    ngOnDestroy() {
        if (this.trackDeltaSub) this.trackDeltaSub.unsubscribe()
        if (this.updateScrollSub) this.updateScrollSub.unsubscribe()
    }

    onSizeChange(event: IScrollbarElementSize) {
        if (this.isTrackScroll) {
            this.viewClasses['no-select'] = true
        } else {
            this.viewClasses['no-select'] = false
        }

        if (!this.config.isScroll.horizontal) {
            this.viewClasses['max-width'] = true
        } else {
            this.viewClasses['max-width'] = false
        }

        if (!this.config.isScroll.veritcal) {
            this.viewClasses['max-height'] = true
        } else {
            this.viewClasses['max-height'] = false
        }

        if (event.type === 'view') {
            this.viewSize = {
                width: event.width,
                height: event.height,
            }
        }

        if (event.type === 'viewWrapper') {
            this.viewWrapperSize = {
                width: event.width,
                height: event.height,
            }
        }

        if (this.isBottom) this.scroll.y = this.viewWrapperSize.height - this.viewSize.height
        if (this.isRight) this.scroll.x = this.viewWrapperSize.width - this.viewSize.width

        this.sizeChange.emit({
            view: this.viewSize,
            viewWrapper: this.viewWrapperSize,
        })
    }

    @HostListener('window:resize')
    onResize() {
        this.calculateHorizontalScroll(0)
        this.calculateVerticalScroll(0)
    }

    @HostListener('touchstart', ['$event'])
    @HostListener('touchmove', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('touchcancel', ['$event'])
    onTouched(event: TouchEvent) {
        const touch = event.touches[0]

        if (event.type === 'touchstart') {
            this.isTouch = true
            this.touchStart.x = touch.pageX
            this.touchStart.y = touch.pageY
        }

        if (event.type === 'touchmove') {
            this.touchDelta.x = touch.pageX - this.touchStart.x
            this.touchDelta.y = touch.pageY - this.touchStart.y

            if (!this.isTrackScroll) {
                this.calculateVerticalScroll(-this.touchDelta.y)
                this.calculateHorizontalScroll(-this.touchDelta.x)
            }

            this.touchStart.x = touch.pageX
            this.touchStart.y = touch.pageY
        }

        if (event.type === 'touchend' || event.type === 'touchcancel') {
            this.isTouch = false
        }
    }

    @HostListener('window:keydown', ['$event'])
    onShiftPressed(event: KeyboardEvent) {
        if (event.key === 'Shift') {
            this.isShiftPressed = true
        }
    }

    @HostListener('window:keyup', ['$event'])
    onShiftUnpressed(event: KeyboardEvent) {
        if (event.key === 'Shift') {
            this.isShiftPressed = false
        }
    }

    @HostListener('mousewheel', ['$event'])
    onScroll({ deltaY, deltaX }: WheelEvent) {
        if (!this.isTrackScroll) {
            if (deltaX === 0) {
                if (this.isShiftPressed) {
                    this.calculateHorizontalScroll(deltaY)
                } else {
                    this.calculateVerticalScroll(deltaY)
                }
            } else {
                this.calculateHorizontalScroll(deltaX)
                this.calculateVerticalScroll(deltaY)
            }
        }
    }

    calculateVerticalScroll(dlt: number) {
        if (this.config.isScroll.veritcal) {
            this.isBottom = false

            const delta = dlt * (this.isTouch ? this.config.sensitivity.touch : this.config.sensitivity.mouse)

            if (this.scroll.y - delta >= 0) {
                this.scroll.y = 0
            } else if (this.scroll.y - delta <= this.viewWrapperSize.height - this.viewSize.height) {
                this.scroll.y = Math.round(this.viewWrapperSize.height - this.viewSize.height)
            } else {
                this.scroll.y -= delta
            }

            this.scrollChange.emit(this.scroll)
        }
    }

    calculateHorizontalScroll(dlt: number) {
        if (this.config.isScroll.horizontal) {
            this.isRight = false

            const delta = dlt * (this.isTouch ? this.config.sensitivity.touch : this.config.sensitivity.mouse)

            if (this.scroll.x - delta >= 0) {
                this.scroll.x = 0
            } else if (this.scroll.x - delta <= this.viewWrapperSize.width - this.viewSize.width) {
                this.scroll.x = this.viewWrapperSize.width - this.viewSize.width
            } else {
                this.scroll.x -= delta
            }

            this.scrollChange.emit(this.scroll)
        }
    }
}
