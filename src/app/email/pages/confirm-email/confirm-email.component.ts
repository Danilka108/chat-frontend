import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { map, mergeMap } from 'rxjs/operators'
import { EmailHttpService } from '../../email-http.service'

@Component({
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['./confirm-email.component.scss'],
})
export class ConfirmEmailComponent implements OnInit {
    loading = false
    isInvalid = false

    redirectLink = ''

    constructor(private emailHttpService: EmailHttpService, private readonly activatedRoute: ActivatedRoute) {}

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
                    return this.emailHttpService.confirmEmail(v.id, v.token)
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
}
