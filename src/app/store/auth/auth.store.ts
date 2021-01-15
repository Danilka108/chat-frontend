import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IAuthStore {
    userID: number | null
    accessToken: string | null,
    connectionError: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    private readonly auth = new BehaviorSubject<IAuthStore>({
        userID: null,
        accessToken: null,
        connectionError: false,
    })

    setUserID(userID: number) {
        this.auth.next({
            ...this.auth.getValue(),
            userID,
        })
    }

    getUserID() {
        return this.auth.getValue().userID
    }

    setAccessToken(accessToken: string) {
        this.auth.next({
            ...this.auth.getValue(),
            accessToken,
        })
    }

    getAccessToken() {
        return this.auth.getValue().accessToken
    }

    setConnectionError(isError: boolean) {
        this.auth.next({
            ...this.auth.getValue(),
            connectionError: isError,
        })
    }

    getConnectionError() {
        return this.auth.getValue().connectionError
    }
}