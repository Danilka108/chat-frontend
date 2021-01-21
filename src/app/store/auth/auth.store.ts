import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface IAuthStore {
    userID: number | null
    accessToken: string | null,
    connectionError: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    private readonly store = new BehaviorSubject<IAuthStore>({
        userID: null,
        accessToken: null,
        connectionError: false,
    })
    private readonly store$ = this.store.asObservable()

    setUserID(userID: number) {
        this.store.next({
            ...this.store.getValue(),
            userID,
        })
    }

    getUserID() {
        return this.store.getValue().userID
    }

    setAccessToken(accessToken: string) {
        this.store.next({
            ...this.store.getValue(),
            accessToken,
        })
    }

    getAccessToken() {
        return this.store.getValue().accessToken
    }

    setConnectionError(isError: boolean) {
        this.store.next({
            ...this.store.getValue(),
            connectionError: isError,
        })
    }

    getConnectionError() {
        return this.store.getValue().connectionError
    }

    getConnectionError$() {
        return this.store$.pipe(map(store => store.connectionError))
    }
}