import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { AuthHttpService } from 'src/app/auth/auth-http.service'

@Component({
    selector: 'app-email-confirm-email',
    templateUrl: './email-confirm-email.component.html',
    styleUrls: ['./email-confirm-email.component.scss'],
})
export class EmailConfirmEmailComponent implements OnInit {
    loading = true
    isInvalid = false

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly authHttpService: AuthHttpService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((v) => {
                    if (!v?.id || !v?.token) {
                        throw new Error()
                    }

                    return v
                }),
                mergeMap((v) => {
                    return this.authHttpService.confirmEmail(v.id, v.token)
                })
            )
            .subscribe(
                () => this.loading = false,
                () => {
                    this.loading = false
                    this.isInvalid = true
                }
            )
    }
}
