import { Directive, ElementRef } from '@angular/core'
import { IScrollbarCssSizeValue } from '../interfaces/css-value.interface'

@Directive({
    selector: '[scrollbar-vertical-track]',
})
export class ScrollbarVerticalTrackDirective {
    private readonly element!: HTMLElement

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement
    }

    set thickness(value: IScrollbarCssSizeValue) {
        this.element.style.width = value.value + value.unit
    }

    set hide(hide: boolean) {
        if (hide) {
            this.element.style.display = 'none'
        } else this.element.style.display = 'block'
    }
}

@Directive({
    selector: '[scrollbar-horizontal-track]',
})
export class ScrollbarHorizontalTrackDirective {
    private readonly element!: HTMLElement

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement
    }

    set thickness(value: IScrollbarCssSizeValue) {
        this.element.style.height = value.value + value.unit
    }

    set hide(hide: boolean) {
        if (hide) this.element.style.display = 'none'
        else this.element.style.display = 'block'
    }
}
