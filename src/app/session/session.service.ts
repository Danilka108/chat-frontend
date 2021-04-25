/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { forkJoin, Observable, of } from 'rxjs'
import { catchError, first, map, switchMap, tap } from 'rxjs/operators'
import { StorageService } from '../storage/storage.service'
import { updateAccessToken, updateUserID } from '../store/actions/auth.actions'
import { removeDarkTheme } from '../store/actions/main.actions'
import { selectAccessToken, selectUserID } from '../store/selectors/auth.selectors'
import { AppState } from '../store/state/app.state'
import { SessionErrorService } from './session-error.service'
import { SessionHttpService } from './session-http.service'

@Injectable()
export class SessionService {
    constructor(
        private readonly storageService: StorageService,
        private readonly httpService: SessionHttpService,
        private readonly store: Store<AppState>,
        private readonly router: Router,
        private readonly sessionErrorService: SessionErrorService
    ) {}

    update(): Observable<boolean> {
        const localStorageUserID = this.storageService.getUserID()
        const localStorageRefreshToken = this.storageService.getRefreshToken()

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

                        this.storageService.setUserID(userID)
                        this.storageService.setRefreshToken(refreshToken)

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

    remove(throwSessionError = true): void {
        if (throwSessionError) this.sessionErrorService.emit()
        this.storageService.removeIsDarkTheme()
        this.store.dispatch(removeDarkTheme())
        this.storageService.removeRefreshToken()
        this.storageService.removeUserID()
        this.router.navigateByUrl('')
    }

    set(userID: number, accessToken: string, refreshToken: string): void {
        this.storageService.setRefreshToken(refreshToken)
        this.storageService.setUserID(userID)

        this.store.dispatch(updateAccessToken({ accessToken }))
        this.store.dispatch(updateUserID({ userID }))
    }

    verify(): Observable<boolean> {
        return forkJoin({
            accessToken: this.store.pipe(select(selectAccessToken), first()),
            userID: this.store.pipe(select(selectUserID), first()),
        }).pipe(
            switchMap(({ accessToken, userID }) => {
                const localStorageUserID = this.storageService.getUserID()
                const localStorageRefreshToken = this.storageService.getRefreshToken()

                if (userID && accessToken && localStorageUserID && localStorageRefreshToken) {
                    return of(false)
                } else if (localStorageUserID && localStorageRefreshToken) {
                    this.storageService.removeRefreshToken()
                    this.storageService.removeUserID()

                    return this.httpService
                        .refreshToken({
                            userID: localStorageUserID,
                            refreshToken: localStorageRefreshToken,
                        })
                        .pipe(
                            map(({ data: { accessToken, userID, refreshToken } }) => {
                                this.storageService.setRefreshToken(refreshToken)
                                this.storageService.setUserID(userID)

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
