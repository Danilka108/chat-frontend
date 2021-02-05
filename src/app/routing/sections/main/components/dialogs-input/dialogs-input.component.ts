import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import { Component, NgZone, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { take } from 'rxjs/operators'
import { MessageInputDirective } from '../../directives/message-input.directive'

@Component({
    selector: 'app-main-dialogs-input',
    templateUrl: './dialogs-input.component.html',
    styleUrls: ['./dialogs-input.component.scss'],
})
export class DialogsInputComponent implements OnInit {
    @ViewChild('autosize') autosize!: CdkTextareaAutosize
    @ViewChild(MessageInputDirective) input!: MessageInputDirective

    formGroup!: FormGroup

    height = 0

    constructor(private readonly ngZone: NgZone, private readonly fb: FormBuilder) {}

    triggerZone() {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.autosize.resizeToFitContent(true)
        })
    }

    ngOnInit() {
        this.formGroup = this.fb.group({
            message: new FormControl(),
        })
    }

    onMessageInputHeightChange(event: number) {
        setTimeout(() => {
            this.height = event
        })
    }
}
