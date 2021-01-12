import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { AuthStore } from 'src/app/store/auth/auth.store';
import { AuthHttpService } from './auth-http.service';
import { AuthLocalStorageService } from './auth-local-storage.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly authStore: AuthStore,
        private readonly localStorageService: AuthLocalStorageService,
        private readonly httpService: AuthHttpService,
        private readonly router: Router,
    ) {}

    private authRequestCatchError<T>(request: (accessToken: string) => Observable<T>, accessToken: string) {
        return request(accessToken).pipe(
            catchError((error) => {
                if (error?.status === 401) {
                    return this.update().pipe(
                        concatMap((result) => {
                            const accessToken2 = this.authStore.getAccessToken()

                            if (result && accessToken2) {
                                return request(accessToken2).pipe(
                                    catchError(() => {
                                        this.remove()
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
                    this.remove()
                    return of(null)
                }
            })
        )
    }

    authRequest<T>(request: (accessToken: string) => Observable<T>) {
        const accessToken = this.authStore.getAccessToken()

        if (accessToken) {
            return this.authRequestCatchError<T>(request, accessToken)
        } else {
            return this.update().pipe(
                concatMap(() => {
                    const accessToken2 = this.authStore.getAccessToken()
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

    private update() {
        const localStorageUserID = this.localStorageService.getUserID()
        const localStorageRefreshToken = this.localStorageService.getRefreshToken()

        if (localStorageRefreshToken && localStorageUserID) {
            return this.httpService.refreshToken({
                userID: localStorageUserID,
                refreshToken: localStorageRefreshToken,
            }).pipe(
                map(({ data }) => {
                    this.authStore.setAccessToken(data.accessToken)
                    this.authStore.setUserID(data.userID)

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
}