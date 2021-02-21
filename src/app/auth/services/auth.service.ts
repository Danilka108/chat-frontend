import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, concatMap, map, switchMap } from 'rxjs/operators'
import { updateAccessToken, updateConnectionError, updateUserID } from 'src/app/store/actions/auth.actions'
import { Store } from 'src/app/store/core/store'
import { getAccessToken } from 'src/app/store/selectors/auth.selectors'
import { IAppState } from 'src/app/store/states/app.state'
import { AuthHttpService } from './auth-http.service'
import { AuthLocalStorageService } from './auth-local-storage.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly localStorageService: AuthLocalStorageService,
        private readonly httpService: AuthHttpService,
        private readonly store: Store<IAppState>,
        private readonly router: Router
    ) {}

    private update() {
        const localStorageUserID = this.localStorageService.getUserID()
        const localStorageRefreshToken = this.localStorageService.getRefreshToken()

        if (localStorageRefreshToken && localStorageUserID) {
            return this.httpService
                .refreshToken({
                    userID: localStorageUserID,
                    refreshToken: localStorageRefreshToken,
                })
                .pipe(
                    map(({ data }) => {
                        this.store.dispatch(updateAccessToken(data.accessToken))
                        this.store.dispatch(updateUserID(data.userID))

                        this.localStorageService.setUserID(data.userID)
                        this.localStorageService.setRefreshToken(data.refreshToken)

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

    private remove() {
        this.localStorageService.removeRefreshToken()
        this.localStorageService.removeUserID()
        this.router.navigateByUrl('')
    }

    private authRequestCatchError<T>(request: (accessToken: string) => Observable<T>, accessToken: string) {
        return request(accessToken).pipe(
            catchError((error) => {
                if (error?.status === 401) {
                    return this.update().pipe(
                        switchMap((result) => {
                            const accessToken2 = this.store.selectSnapshot(getAccessToken())

                            if (result && accessToken2) {
                                return request(accessToken2).pipe(
                                    catchError((error) => {
                                        if (error?.status === 401) {
                                            this.remove()
                                        } else {
                                            this.store.dispatch(updateConnectionError(true))
                                        }

                                        this.router.navigateByUrl('')
                                        return of(null)
                                    })
                                )
                            } else {
                                this.remove()
                                return of(null)
                            }
                        })
                    )
                } else {
                    this.store.dispatch(updateConnectionError(true))
                    this.router.navigateByUrl('')
                    return of(null)
                }
            })
        )
    }

    private authRequestCheckAccessToken<T>(request: (accessToken: string) => Observable<T>) {
        const accessToken = this.store.selectSnapshot(getAccessToken())

        if (accessToken) {
            return this.authRequestCatchError<T>(request, accessToken)
        } else {
            return this.update().pipe(
                concatMap(() => {
                    const accessToken2 = this.store.selectSnapshot(getAccessToken())
                    if (accessToken2) {
                        return this.authRequestCatchError<T>(request, accessToken2)
                    } else {
                        this.remove()
                        return of(null)
                    }
                })
            )
        }
    }

    authRequest<T>(request: (accessToken: string) => Observable<T>) {
        return this.authRequestCheckAccessToken(request).pipe(
            map((result) => {
                if (result !== null) {
                    this.store.dispatch(updateConnectionError(false))
                }

                return result
            })
        )
    }
}
