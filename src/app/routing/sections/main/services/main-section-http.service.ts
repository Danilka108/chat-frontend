import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { map } from 'rxjs/operators'
import { AuthService } from 'src/app/auth/auth.service'
import { updateRequestLoading } from 'src/app/store/actions/main.actions'
import { AppState } from 'src/app/store/state/app.state'
import { environment } from 'src/environments/environment'
import { IDialog } from '../interface/dialog.interface'
import { IMessage } from '../interface/message.interface'
import { IResponse } from '../interface/response.interface'

interface IGetDialogsResponse extends IResponse {
    data: IDialog[]
}

interface IGetMessagesResponse extends IResponse {
    data: IMessage[]
}

interface ISendMessageResponse extends IResponse {
    data: {
        messageID: number
    }
}

@Injectable()
export class MainSectionHttpService {
    constructor(
        private readonly authService: AuthService,
        private readonly httpClient: HttpClient,
        private readonly store: Store<AppState>
    ) {}

    getDialogs() {
        this.store.dispatch(updateRequestLoading({ requestLoading: true }))

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
                    this.store.dispatch(updateRequestLoading({ requestLoading: false }))

                    if (!dialogs) return []
                    return dialogs
                })
            )
    }

    getMessages(receiverID: number, take: number, skip: number) {
        console.log('get messages')
        this.store.dispatch(updateRequestLoading({ requestLoading: true }))

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
                    this.store.dispatch(updateRequestLoading({ requestLoading: false }))

                    if (!result) return []
                    return result
                })
            )
    }

    sendMessage(receiverID: number, message: string) {
        this.store.dispatch(updateRequestLoading({ requestLoading: true }))

        return this.authService
            .authRequest((accessToken) => {
                return this.httpClient
                    .post(
                        `${environment.apiUrl}/message/${receiverID}`,
                        {
                            message,
                        },
                        {
                            headers: {
                                authorization: `Bearer ${accessToken}`,
                            },
                        }
                    )
                    .pipe(
                        map((result) => {
                            const value = result as ISendMessageResponse

                            return value.data.messageID
                        })
                    )
            })
            .pipe(
                map((messageID) => {
                    this.store.dispatch(updateRequestLoading({ requestLoading: false }))

                    return messageID
                })
            )
    }
}
