import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { map } from 'rxjs/operators'
import { authSignInPath, mainPath } from 'src/app/routes.constants'
import { VerifyService } from '../verify.service'

@Injectable()
export class RedirectGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly verifyService: VerifyService,
    ) {}

    canActivate(_: any) {
        return this.verifyService.verify().pipe(
            map((result) => {
                if (result) {
                    this.router.navigateByUrl(authSignInPath.full)
                } else {
                    this.router.navigateByUrl(mainPath.full)
                }

                return result
            })
        )
    }
}