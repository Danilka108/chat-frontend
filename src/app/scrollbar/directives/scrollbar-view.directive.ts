import {
    AfterContentChecked,
    AfterViewChecked,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { IScrollbarScroll } from '../interfaces/scroll.interface'
import { IScrollbarElementSize } from '../interfaces/size.interface'

@Directive({
    selector: '[scrollbar-view]',
})
export class ScrollbarViewDirective implements AfterViewChecked {
    private readonly element!: HTMLElement

    @Input() scroll!: IScrollbarScroll
    @Input() isBottom!: boolean
    @Input() isRight!: boolean
    @Output() sizeChange = new EventEmitter<IScrollbarElementSize>()

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement
    }

    ngAfterViewChecked() {
        this.element.style.bottom = this.isBottom ? '0' : ''
        this.element.style.top = this.isBottom ? '' : this.scroll.y + 'px'

        this.element.style.right = this.isRight ? '0' : ''
        this.element.style.left = this.isRight ? '' : this.scroll.x + 'px'

        this.sizeChange.emit({
            type: 'view',
            width: this.element.offsetWidth,
            height: this.element.offsetHeight,
        })
    }

    updateScrollbar() {
        setTimeout(() => {
            this.sizeChange.emit({
                type: 'view',
                width: this.element.offsetWidth,
                height: this.element.offsetHeight,
            })
        })
    }
}

@Directive({
    selector: '[scrollbar-view-wrapper]',
})
export class ScrollbarViewWrapperDirective implements AfterViewChecked {
    private readonly element!: HTMLElement

    @Output() sizeChange = new EventEmitter<IScrollbarElementSize>()

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement
    }

    ngAfterViewChecked() {
        this.sizeChange.emit({
            type: 'viewWrapper',
            width: this.element.offsetWidth,
            height: this.element.offsetHeight,
        })
    }

    updateScrollbar() {
        setTimeout(() => {
            this.sizeChange.emit({
                type: 'view',
                width: this.element.offsetWidth,
                height: this.element.offsetHeight,
            })
        })
    }
}
