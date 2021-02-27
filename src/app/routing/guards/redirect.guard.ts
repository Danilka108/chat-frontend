import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { map } from 'rxjs/operators'
import { SessionService } from 'src/app/session/session.service'
import { authSectionPath, mainSectionPath } from '../routing.constants'

@Injectable()
export class RedirectGuard implements CanActivate {
    constructor(private readonly router: Router, private readonly sessionService: SessionService) {}

    canActivate() {
        return this.sessionService.verify().pipe(
            map((result) => {
                if (result) {
                    this.router.navigateByUrl(authSectionPath.full)
                } else {
                    this.router.navigateByUrl(mainSectionPath.full)
                }

                return result
            })
        )
    }
}
