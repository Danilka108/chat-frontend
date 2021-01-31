import { Directive, ElementRef } from '@angular/core'
import { IScrollbarCssSizeValue } from '../interfaces/css-value.interface'

@Directive({
    selector: '[scrollbar-vertical-thumb]',
})
export class ScrollbarVerticalThumbDirective {
    private readonly element!: HTMLElement

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement
    }

    set broderRadius(value: IScrollbarCssSizeValue) {
        this.element.style.borderRadius = value.value + value.unit
    }

    set size(size: number) {
        this.element.style.height = size + 'px'
    }

    set scroll(scroll: number) {
        this.element.style.top = scroll + 'px'
    }

    get scroll() {
        const scroll = Number(this.element.style.left.slice(0, -2))

        if (!isNaN(scroll)) return scroll
        else return 0
    }
}

@Directive({
    selector: '[scrollbar-horizontal-thumb]',
})
export class ScrollbarHorizontalThumbDirective {
    private readonly element!: HTMLElement

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement
    }

    set broderRadius(value: IScrollbarCssSizeValue) {
        this.element.style.borderRadius = value.value + value.unit
    }

    set size(size: number) {
        this.element.style.width = size + 'px'
    }

    set scroll(scroll: number) {
        this.element.style.left = scroll + 'px'
    }

    get scroll() {
        const scroll = Number(this.element.style.left.slice(0, -2))

        if (!isNaN(scroll)) return scroll
        else return 0
    }
}
