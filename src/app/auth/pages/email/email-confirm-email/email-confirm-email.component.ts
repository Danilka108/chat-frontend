import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { mergeMap, map } from 'rxjs/operators'
import { HttpService } from 'src/app/auth/shared/http.service'

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
        private readonly httpService: HttpService
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
                    return this.httpService.confirmEmail(v.id, v.token)
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
