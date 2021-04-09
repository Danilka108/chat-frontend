import { Injectable } from '@angular/core'

const localStorageUserID = 'LOCAL_STORAGE_AUTH_USER_ID'
const localStorageRefreshToken = 'LOCAL_STORAGE_AUTH_REFRESH_TOKEN'

@Injectable()
export class SessionLocalStorageService {
    private getData(name: string) {
        const data = localStorage.getItem(name)

        if (!data) {
            return null
        }

        return JSON.parse(data) as unknown
    }

    setUserID(userID: number): void {
        localStorage.setItem(localStorageUserID, JSON.stringify(userID))
    }

    getUserID(): number | null {
        const userID = this.getData(localStorageUserID)

        if (typeof userID !== 'number') {
            return null
        }

        return userID
    }

    removeUserID(): void {
        localStorage.setItem(localStorageUserID, '')
    }

    setRefreshToken(refreshToken: string): void {
        localStorage.setItem(localStorageRefreshToken, JSON.stringify(refreshToken))
    }

    getRefreshToken(): string | null {
        const refreshToken = this.getData(localStorageRefreshToken)

        if (typeof refreshToken !== 'string') {
            return null
        }

        return refreshToken
    }

    removeRefreshToken(): void {
        localStorage.setItem(localStorageRefreshToken, '')
    }
}
