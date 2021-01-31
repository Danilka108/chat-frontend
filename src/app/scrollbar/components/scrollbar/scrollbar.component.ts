import { Component, Input, OnInit } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { IScrollbarConfig, IScrollbarCfg } from '../../interfaces/config.interface'
import { IScrollbarScroll } from '../../interfaces/scroll.interface'
import { IScrollbarViewSize } from '../../interfaces/size.interface'
import { IScrollbarDelta } from '../../interfaces/track-delta.interface'

@Component({
    selector: 'app-scrollbar',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./scrollbar.component.scss'],
})
export class ScrollbarComponent implements OnInit {
    @Input() updateScrollbar$!: Observable<void>
    @Input() config!: IScrollbarCfg

    defaultConfig: IScrollbarConfig = {
        sensitivity: {
            mouse: 1,
            touch: 1,
        },
        isScroll: {
            veritcal: true,
            horizontal: true,
        },
        initialPosition: {
            veritcal: 'top',
            horizontal: 'left',
        },
        trackThickness: {
            vertical: {
                unit: 'px',
                value: 7,
            },
            horizontal: {
                unit: 'px',
                value: 7,
            },
        },
    }

    viewSize: IScrollbarViewSize = {
        view: { width: 0, height: 0 },
        viewWrapper: { width: 0, height: 0 },
    }

    scroll: IScrollbarScroll = {
        x: 0,
        y: 0,
    }

    trackDelta$ = new Subject<IScrollbarDelta>()
    isTrackScroll = false

    ngOnInit() {
        if (this.config?.sensitivity?.mouse !== undefined) {
            this.defaultConfig.sensitivity.mouse = this.config.sensitivity.mouse
        }
        if (this.config?.sensitivity?.touch !== undefined) {
            this.defaultConfig.sensitivity.touch = this.config.sensitivity.touch
        }
        if (this.config?.isScroll?.horizontal !== undefined) {
            this.defaultConfig.isScroll.horizontal = this.config.isScroll.horizontal
        }
        if (this.config?.isScroll?.veritcal !== undefined) {
            this.defaultConfig.isScroll.veritcal = this.config.isScroll.veritcal
        }
        if (this.config?.initialPosition?.horizontal !== undefined) {
            this.defaultConfig.initialPosition.horizontal = this.config.initialPosition.horizontal
        }
        if (this.config?.initialPosition?.veritcal !== undefined) {
            this.defaultConfig.initialPosition.veritcal = this.config.initialPosition.veritcal
        }
        if (this.config?.trackThickness?.horizontal?.unit !== undefined) {
            this.defaultConfig.trackThickness.horizontal.unit = this.config.trackThickness.horizontal.unit
        }
        if (this.config?.trackThickness?.horizontal?.value !== undefined) {
            this.defaultConfig.trackThickness.horizontal.value = this.config.trackThickness.horizontal.value
        }

        if (this.config?.trackThickness?.vertical?.unit !== undefined) {
            this.defaultConfig.trackThickness.vertical.unit = this.config.trackThickness.vertical.unit
        }
        if (this.config?.trackThickness?.vertical?.value !== undefined) {
            this.defaultConfig.trackThickness.vertical.value = this.config.trackThickness.vertical.value
        }

        if (!this.updateScrollbar$) {
            this.updateScrollbar$ = new Observable<void>()
        }
    }

    onSizeChange(event: IScrollbarViewSize) {
        this.viewSize = event
    }

    onScrollChange(event: IScrollbarScroll) {
        this.scroll = event
    }

    onTrackDeltaChange(event: IScrollbarDelta) {
        this.trackDelta$.next(event)
    }

    onIsTrackScrollChange(event: boolean) {
        this.isTrackScroll = event
    }
}
