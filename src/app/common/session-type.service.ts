/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class SessionTypeService {
    private storage: Storage | null = null

    setStorage(isLocalStorage: boolean): void {
        if (isLocalStorage) this.storage = localStorage
        else this.storage = sessionStorage
    }

    getStorage(): Storage {
        return this.storage !== null ? this.storage : localStorage
    }
}
