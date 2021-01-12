import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDialog, MainSectionHttpService } from '../../main-section-http.service';

@Component({
    selector: 'app-main',
    template: `<p>main work!</p>`
})
export class MainComponent implements OnInit {
    dialogs$: Observable<IDialog[]> = of([])

    constructor(
        private readonly httpService: MainSectionHttpService,
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

        this.dialogs$.subscribe(console.log)
    }
}