import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { EmailSectionHttpService } from '../../email-section-http.service'

@Component({
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['./confirm-email.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
    loading = false
    isInvalid = false

    redirectLink = ''

    subs!: Subscription

    constructor(
        private readonly httpService: EmailSectionHttpService,
        private readonly activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.subs = this.activatedRoute.queryParams
            .pipe(
                map((v) => {
                    if (!v?.id || !v?.token) {
                        throw new Error()
                    }

                    return v
                }),
                mergeMap((v) => {
                    return this.httpService.confirmEmail(v.id, v.token)
                })
            )
            .subscribe(
                () => (this.loading = false),
                () => {
                    this.loading = false
                    this.isInvalid = true
                }
            )
    }

    ngOnDestroy() {
        if (this.subs) this.subs.unsubscribe()
    }
}
