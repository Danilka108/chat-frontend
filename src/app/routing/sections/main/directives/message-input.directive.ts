import { AfterViewChecked, Directive, ElementRef, EventEmitter, Output } from '@angular/core'

@Directive({
    selector: '[message-input]',
})
export class MessageInputDirective implements AfterViewChecked {
    private readonly element!: HTMLElement

    private height = 0

    @Output() heightChange = new EventEmitter<number>()

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement
    }

    ngAfterViewChecked() {
        const height = this.element.offsetHeight

        if (this.height !== height) {
            this.height = height
            this.heightChange.emit(this.height)
        }
    }
}
