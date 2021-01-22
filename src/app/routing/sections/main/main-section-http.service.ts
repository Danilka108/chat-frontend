import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { delay, map } from 'rxjs/operators'
import { AuthService } from 'src/app/auth/services/auth.service'
import { MainStore } from 'src/app/store/main/main.store'
import { environment } from 'src/environments/environment'
import { IDialog } from './interface/dialog.interface'
import { IMessage } from './interface/message.interface'

interface IGetDialogsResponse {
    httpStatus: number
    message: string
    data: IDialog[]
}

interface IGetMessagesResponse {
    httpStatus: number
    message: string
    data: IMessage[]
}

@Injectable()
export class MainSectionHttpService {
    constructor(
        private readonly authService: AuthService,
        private readonly httpClient: HttpClient,
        private readonly mainStore: MainStore
    ) {}

    getDialogs() {
        this.mainStore.setRequestLoading(true)

        return this.authService
            .authRequest((accessToken) => {
                return this.httpClient
                    .get(`${environment.apiUrl}/dialog`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`,
                        },
                    })
                    .pipe(
                        map((val) => {
                            const v = val as IGetDialogsResponse
                            return v.data
                        })
                    )
            })
            .pipe(
                map((dialogs) => {
                    this.mainStore.setRequestLoading(false)

                    if (!dialogs) return []
                    return dialogs
                })
            )
    }

    getMessages(receiverID: number, take: number, skip: number) {
        this.mainStore.setRequestLoading(true)

        const params = new HttpParams().set('take', `${take}`).set('skip', `${skip}`)

        return this.authService
            .authRequest((accessToken) => {
                return this.httpClient
                    .get(`${environment.apiUrl}/message/${receiverID}`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`,
                        },
                        params,
                    })
                    .pipe(
                        map((result) => {
                            const value = result as IGetMessagesResponse
                            return value.data
                        })
                    )
            })
            .pipe(
                map((result) => {
                    this.mainStore.setRequestLoading(false)
                    if (!result) return []
                    return result
                })
            )
    }
}
