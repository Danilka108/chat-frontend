import { Component } from '@angular/core';
import { MainStore } from 'src/app/store/main/main.store';

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss']
})
export class DialogsDetailComponent {
    constructor(
        private readonly mainStore: MainStore,
    ) {}
}