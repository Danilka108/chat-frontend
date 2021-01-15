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
    constructor(
        private readonly httpService: MainSectionHttpService,
        private readonly mainStore: MainStore,
    ) {}

    ngOnInit() {
        this.httpService.getDialogs().pipe(
            map((dialogs) => {
                if (dialogs === null) return []
                return dialogs
            })
        ).subscribe(dialogs => {
          this.mainStore.setDialogs(dialogs)  
        })
    }
}