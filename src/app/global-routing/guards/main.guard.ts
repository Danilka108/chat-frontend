import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { map } from 'rxjs/operators'
import { VerifyService } from '../verify.service'

@Injectable()
export class MainGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly verifyService: VerifyService,
    ) {}

    canActivate(_: any) {
        return this.verifyService.verify().pipe(
            map(result => !result),
            map(result => {
                if (!result) {
                    this.router.navigateByUrl('')
                }

                return result
            })
        )
    }
}
