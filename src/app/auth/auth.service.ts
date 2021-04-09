import { Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { of } from 'rxjs'
import { Observable } from 'rxjs'
import { catchError, first, switchMap, tap } from 'rxjs/operators'
import { selectAccessToken } from '../store/selectors/auth.selectors'
import { AppState } from '../store/state/app.state'
import { SessionService } from '../session/session.service'
import { UPDATE_TOKEN_MAX_COUNT } from '../session/session.constants'
import { updateConnectionError } from '../store/actions/auth.actions'

const REQUEST_INVALID_TOKEN_ERROR_STATUS = 401

@Injectable()
export class AuthService {
    constructor(private readonly store: Store<AppState>, private readonly sessionService: SessionService) {}

    private updatingCount = 0

    authRequest<R>(request: (accessToken: string) => Observable<R>): Observable<R | null> {
        return this.request(request).pipe(
            tap(() => {
                if (this.updatingCount !== UPDATE_TOKEN_MAX_COUNT) {
                    this.updatingCount = 0
                }
            })
        )
    }

    private request<R>(request: (accessToken: string) => Observable<R>): Observable<R | null> {
        return this.store.pipe(
            select(selectAccessToken),
            first(),
            switchMap((accessToken) => request(accessToken)),
            catchError((error) => {
                if (this.updatingCount >= UPDATE_TOKEN_MAX_COUNT) {
                    this.sessionService.remove()
                    return of(null)
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (error.status === REQUEST_INVALID_TOKEN_ERROR_STATUS) {
                    this.updatingCount += 1
                    return this.sessionService.update().pipe(switchMap(() => this.request(request)))
                }

                this.store.dispatch(updateConnectionError({ connectionError: true }))
                return of(null)
            })
        )
    }
}
