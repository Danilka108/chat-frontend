import { AfterViewChecked, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core'
import {
    ScrollbarHorizontalThumbDirective,
    ScrollbarVerticalThumbDirective,
} from '../../directives/scrollbar-thumb.directive'
import {
    ScrollbarHorizontalTrackDirective,
    ScrollbarVerticalTrackDirective,
} from '../../directives/scrollbar-track.directive'
import { IScrollbarConfig } from '../../interfaces/config.interface'
import { IScrollbarScroll } from '../../interfaces/scroll.interface'
import { IScrollbarViewSize } from '../../interfaces/size.interface'
import { IScrollbarDelta } from '../../interfaces/track-delta.interface'

@Component({
    selector: 'app-scrollbar-track',
    templateUrl: './scrollbar-track.component.html',
    styleUrls: ['./scrollbar-track.component.scss'],
})
export class ScrollbarTrackComponent implements AfterViewChecked {
    @Input() config!: IScrollbarConfig
    @Input() viewSize!: IScrollbarViewSize
    @Input() scroll!: IScrollbarScroll

    @Output() trackDeltaChange = new EventEmitter<IScrollbarDelta>()
    @Output() isTrackScrollChange = new EventEmitter<boolean>()

    @ViewChild(ScrollbarVerticalTrackDirective) verticalTrack!: ScrollbarVerticalTrackDirective
    @ViewChild(ScrollbarHorizontalTrackDirective) horizontalTrack!: ScrollbarHorizontalTrackDirective
    @ViewChild(ScrollbarVerticalThumbDirective) verticalThumb!: ScrollbarVerticalThumbDirective
    @ViewChild(ScrollbarHorizontalThumbDirective) horizontalThumb!: ScrollbarHorizontalThumbDirective

    isHorizontalTrackSelected = false
    isVerticalTrackSelected = false

    thumbMoveStart = {
        x: 0,
        y: 0,
    }

    thumbMoveDelta = {
        x: 0,
        y: 0,
    }

    ngAfterViewChecked() {
        this.horizontalTrack.thickness = this.config.trackThickness.horizontal
        if (this.viewSize.view.width === this.viewSize.viewWrapper.width || !this.config.isScroll.horizontal)
            this.horizontalTrack.hide = true
        else this.horizontalTrack.hide = false

        this.verticalTrack.thickness = this.config.trackThickness.vertical
        if (this.viewSize.view.height === this.viewSize.viewWrapper.height || !this.config.isScroll.veritcal)
            this.verticalTrack.hide = true
        else this.verticalTrack.hide = false

        this.verticalThumb.size = this.viewSize.viewWrapper.height ** 2 / this.viewSize.view.height
        this.verticalThumb.scroll = (-this.scroll.y / this.viewSize.view.height) * this.viewSize.viewWrapper.height
        this.verticalThumb.broderRadius = this.config.trackThickness.vertical

        this.horizontalThumb.size = this.viewSize.viewWrapper.width ** 2 / this.viewSize.view.width
        this.horizontalThumb.scroll = (-this.scroll.x / this.viewSize.view.width) * this.viewSize.viewWrapper.width
        this.horizontalThumb.broderRadius = this.config.trackThickness.horizontal
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseup() {
        this.isHorizontalTrackSelected = false
        this.isVerticalTrackSelected = false
        this.isTrackScrollChange.emit(false)
    }

    @HostListener('window:mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if (this.isVerticalTrackSelected) {
            this.thumbMoveDelta.x = event.pageX - this.thumbMoveStart.x
            this.thumbMoveDelta.y = event.pageY - this.thumbMoveStart.y

            this.trackDeltaChange.emit({
                type: 'vertical',
                x: 0,
                y: (this.thumbMoveDelta.y / window.innerHeight) * this.viewSize.view.height,
            })

            this.thumbMoveStart = {
                y: event.pageY,
                x: event.pageX,
            }
        }

        if (this.isHorizontalTrackSelected) {
            this.thumbMoveDelta.x = event.pageX - this.thumbMoveStart.x
            this.thumbMoveDelta.y = event.pageY - this.thumbMoveStart.y

            this.trackDeltaChange.emit({
                type: 'vertical',
                x: (this.thumbMoveDelta.x / window.innerWidth) * this.viewSize.view.width,
                y: 0,
            })

            this.thumbMoveStart = {
                y: event.pageY,
                x: event.pageX,
            }
        }
    }

    onHorizontalMousedown(event: MouseEvent) {
        this.isHorizontalTrackSelected = true
        this.thumbMoveStart = {
            y: event.pageY,
            x: event.pageX,
        }

        this.isTrackScrollChange.emit(true)
    }

    onVerticalMousedown(event: MouseEvent) {
        this.isVerticalTrackSelected = true
        this.thumbMoveStart = {
            y: event.pageY,
            x: event.pageX,
        }

        this.isTrackScrollChange.emit(true)
    }

    @HostListener('touchmove', ['$event'])
    @HostListener('touchend', ['$event'])
    onTouch(event: TouchEvent) {
        const touch = event.touches[0]

        if (event.type === 'touchmove') {
            if (this.isVerticalTrackSelected) {
                this.thumbMoveDelta.x = touch.pageX - this.thumbMoveStart.x
                this.thumbMoveDelta.y = touch.pageY - this.thumbMoveStart.y

                this.trackDeltaChange.emit({
                    type: 'vertical',
                    x: 0,
                    y: (this.thumbMoveDelta.y / window.innerHeight) * this.viewSize.view.height,
                })

                this.thumbMoveStart = {
                    y: touch.pageY,
                    x: touch.pageX,
                }
            }

            if (this.isHorizontalTrackSelected) {
                this.thumbMoveDelta.x = touch.pageX - this.thumbMoveStart.x
                this.thumbMoveDelta.y = touch.pageY - this.thumbMoveStart.y

                this.trackDeltaChange.emit({
                    type: 'vertical',
                    x: (this.thumbMoveDelta.x / window.innerWidth) * this.viewSize.view.width,
                    y: 0,
                })

                this.thumbMoveStart = {
                    y: touch.pageY,
                    x: touch.pageX,
                }
            }
        }

        if (event.type === 'touchend') {
            this.isHorizontalTrackSelected = false
            this.isVerticalTrackSelected = false
            this.isTrackScrollChange.emit(false)
        }
    }

    onVerticalTouchStart(event: TouchEvent) {
        this.isVerticalTrackSelected = true

        const touch = event.touches[0]

        this.thumbMoveStart.x = touch.pageX
        this.thumbMoveStart.y = touch.pageY
    }

    onHorizontalTouchStart(event: TouchEvent) {
        this.isHorizontalTrackSelected = true

        const touch = event.touches[0]

        this.thumbMoveStart.x = touch.pageX
        this.thumbMoveStart.y = touch.pageY
    }
}
