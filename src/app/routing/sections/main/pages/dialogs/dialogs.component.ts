import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MainStore } from 'src/app/store/main/main.store';
import { IDialog } from '../../interface/dialog.interface';
import { MainSectionHttpService } from '../../main-section-http.service';

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styleUrls: ['./dialogs.component.scss'],
})
export class DialogsComponent implements OnInit {
    dialogs$: Observable<IDialog[]> = of([])

    constructor(
        private readonly httpService: MainSectionHttpService,
        private readonly mainStore: MainStore,
    ) {}

    ngOnInit() {
        this.dialogs$ = this.httpService.getDialogs().pipe(
            map((value) => {
                if (!value) {
                    return []
                } else {
                    return value
                }
            })
        )

        this.dialogs$.pipe(
            map((value) => {
                this.mainStore.setDialogs(value)
                return value
            })
        )
    }

    onChange(receiverID: number) {
        this.mainStore.setActiveReceiverID(receiverID)
    }
}