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

        return JSON.parse(data)
    }

    setUserID(userID: number) {
        localStorage.setItem(localStorageUserID, JSON.stringify(userID))
    }

    getUserID() {
        const userID = this.getData(localStorageUserID)

        if (typeof userID !== 'number') {
            return null
        }

        return userID
    }

    removeUserID() {
        localStorage.setItem(localStorageUserID, '')
    }

    setRefreshToken(refreshToken: string) {
        localStorage.setItem(localStorageRefreshToken, JSON.stringify(refreshToken))
    }

    getRefreshToken() {
        const refreshToken = this.getData(localStorageRefreshToken)

        if (typeof refreshToken !== 'string') {
            return null
        }

        return refreshToken
    }

    removeRefreshToken() {
        localStorage.setItem(localStorageRefreshToken, '')
    }
}
