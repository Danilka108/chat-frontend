/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core'
import { StorageTypeService } from './storage-type.service'

const storageUserID = 'STORAGE_AUTH_USER_ID'
const storageRefreshToken = 'STORAGE_AUTH_REFRESH_TOKEN'
const storageIsDarkTheme = 'STORAGE_IS_DARK_THEME'

@Injectable()
export class StorageService {
    constructor(private readonly storageTypeService: StorageTypeService) {}

    private getData(name: string) {
        const data = this.storageTypeService.getStorage().getItem(name)

        if (!data) {
            return null
        }

        return JSON.parse(data) as unknown
    }

    setUserID(userID: number): void {
        this.storageTypeService.getStorage().setItem(storageUserID, JSON.stringify(userID))
    }

    getUserID(): number | null {
        const userID = this.getData(storageUserID)

        if (typeof userID !== 'number') {
            return null
        }

        return userID
    }

    removeUserID(): void {
        this.storageTypeService.getStorage().setItem(storageUserID, '')
    }

    setRefreshToken(refreshToken: string): void {
        this.storageTypeService.getStorage().setItem(storageRefreshToken, JSON.stringify(refreshToken))
    }

    getRefreshToken(): string | null {
        const refreshToken = this.getData(storageRefreshToken)

        if (typeof refreshToken !== 'string') {
            return null
        }

        return refreshToken
    }

    removeRefreshToken(): void {
        this.storageTypeService.getStorage().setItem(storageRefreshToken, '')
    }

    setIsDarkTheme(isDarkTheme: boolean): void {
        this.storageTypeService.getStorage().setItem(storageIsDarkTheme, JSON.stringify(isDarkTheme))
    }

    getIsDarkTheme(): boolean {
        const isDarkTheme = this.getData(storageIsDarkTheme)

        if (isDarkTheme === true) return true
        return false
    }

    removeIsDarkTheme(): void {
        this.storageTypeService.getStorage().setItem(storageIsDarkTheme, '')
    }
}
