import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { map } from 'rxjs/operators'
import { SessionService } from 'src/app/session/session.service'

@Injectable()
export class MainSectionGuard implements CanActivate {
    constructor(private readonly router: Router, private readonly sessionService: SessionService) {}

    canActivate() {
        return this.sessionService.verify().pipe(
            map((result) => !result),
            map((result) => {
                if (!result) {
                    this.router.navigateByUrl('')
                }

                return result
            })
        )
    }
}
