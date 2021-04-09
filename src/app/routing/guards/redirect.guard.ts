import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { from, Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { SessionService } from 'src/app/session/session.service'
import { authSectionPath, mainSectionPath } from '../routing.constants'

@Injectable()
export class RedirectGuard implements CanActivate {
    constructor(private readonly router: Router, private readonly sessionService: SessionService) {}

    canActivate(): Observable<boolean> {
        return this.sessionService.verify().pipe(
            switchMap((result) => {
                if (result) {
                    return from(this.router.navigateByUrl(authSectionPath.full))
                } else {
                    return from(this.router.navigateByUrl(mainSectionPath.full))
                }
            })
        )
    }
}
