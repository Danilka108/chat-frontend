import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { forkJoin, of } from 'rxjs'
import { catchError, first, map, switchMap } from 'rxjs/operators'
import { updateAccessToken, updateUserID } from '../store/actions/auth.actions'
import { selectAccessToken, selectUserID } from '../store/selectors/auth.selectors'
import { AppState } from '../store/state/app.state'
import { SessionHttpService } from './session-http.service'
import { SessionLocalStorageService } from './session-local-storage.service'

@Injectable()
export class SessionService {
    constructor(
        private readonly localStorageService: SessionLocalStorageService,
        private readonly httpService: SessionHttpService,
        private readonly store: Store<AppState>,
        private readonly router: Router
    ) {}

    update() {
        const localStorageUserID = this.localStorageService.getUserID()
        const localStorageRefreshToken = this.localStorageService.getRefreshToken()

        if (localStorageRefreshToken && localStorageUserID) {
            return this.httpService
                .refreshToken({
                    userID: localStorageUserID,
                    refreshToken: localStorageRefreshToken,
                })
                .pipe(
                    map(({ data: { accessToken, userID, refreshToken } }) => {
                        this.store.dispatch(updateAccessToken({ accessToken }))
                        this.store.dispatch(updateUserID({ userID }))

                        this.localStorageService.setUserID(userID)
                        this.localStorageService.setRefreshToken(refreshToken)

                        return true
                    }),
                    catchError(() => {
                        return of(false)
                    })
                )
        } else {
            return of(false)
        }
    }

    remove() {
        this.localStorageService.removeRefreshToken()
        this.localStorageService.removeUserID()
        this.router.navigateByUrl('')
    }

    set(userID: number, accessToken: string, refreshToken: string) {
        this.localStorageService.setRefreshToken(refreshToken)
        this.localStorageService.setUserID(userID)

        this.store.dispatch(updateAccessToken({ accessToken }))
        this.store.dispatch(updateUserID({ userID }))
    }

    verify() {
        return forkJoin({
            accessToken: this.store.pipe(select(selectAccessToken), first()),
            userID: this.store.pipe(select(selectUserID), first()),
        }).pipe(
            switchMap(({ accessToken, userID }) => {
                const localStorageUserID = this.localStorageService.getUserID()
                const localStorageRefreshToken = this.localStorageService.getRefreshToken()

                if (userID && accessToken && localStorageUserID && localStorageRefreshToken) {
                    return of(false)
                } else if (localStorageUserID && localStorageRefreshToken) {
                    this.localStorageService.removeRefreshToken()
                    this.localStorageService.removeUserID()

                    return this.httpService
                        .refreshToken({
                            userID: localStorageUserID,
                            refreshToken: localStorageRefreshToken,
                        })
                        .pipe(
                            map(({ data: { accessToken, userID, refreshToken } }) => {
                                this.localStorageService.setRefreshToken(refreshToken)
                                this.localStorageService.setUserID(userID)

                                this.store.dispatch(updateAccessToken({ accessToken }))
                                this.store.dispatch(updateUserID({ userID }))

                                return false
                            }),
                            catchError(() => {
                                return of(true)
                            })
                        )
                } else {
                    return of(true)
                }
            })
        )
    }
}
