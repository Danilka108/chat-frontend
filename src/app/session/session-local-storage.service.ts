import { Injectable } from '@angular/core'
import { SessionTypeService } from '../common/session-type.service'

const localStorageUserID = 'LOCAL_STORAGE_AUTH_USER_ID'
const localStorageRefreshToken = 'LOCAL_STORAGE_AUTH_REFRESH_TOKEN'

@Injectable()
export class SessionLocalStorageService {
    constructor(private readonly sessionTypeService: SessionTypeService) {}

    private getData(name: string) {
        const data = this.sessionTypeService.getStorage().getItem(name)

        if (!data) {
            return null
        }

        return JSON.parse(data) as unknown
    }

    setUserID(userID: number): void {
        this.sessionTypeService.getStorage().setItem(localStorageUserID, JSON.stringify(userID))
    }

    getUserID(): number | null {
        const userID = this.getData(localStorageUserID)

        if (typeof userID !== 'number') {
            return null
        }

        return userID
    }

    removeUserID(): void {
        this.sessionTypeService.getStorage().setItem(localStorageUserID, '')
    }

    setRefreshToken(refreshToken: string): void {
        this.sessionTypeService.getStorage().setItem(localStorageRefreshToken, JSON.stringify(refreshToken))
    }

    getRefreshToken(): string | null {
        const refreshToken = this.getData(localStorageRefreshToken)

        if (typeof refreshToken !== 'string') {
            return null
        }

        return refreshToken
    }

    removeRefreshToken(): void {
        this.sessionTypeService.getStorage().setItem(localStorageRefreshToken, '')
    }
}
