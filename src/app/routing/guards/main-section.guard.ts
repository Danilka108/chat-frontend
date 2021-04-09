import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { from, Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { SessionService } from 'src/app/session/session.service'

@Injectable()
export class MainSectionGuard implements CanActivate {
    constructor(private readonly router: Router, private readonly sessionService: SessionService) {}

    canActivate(): Observable<boolean> {
        return this.sessionService.verify().pipe(
            map((result) => !result),
            switchMap((result) => {
                if (!result) {
                    return from(this.router.navigateByUrl(''))
                }

                return of(result)
            })
        )
    }
}
