import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
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
    data: IMessage
}

interface IGetUserNameResponse extends IResponse {
    data: string
}

@Injectable()
export class MainSectionHttpService {
    constructor(
        private readonly authService: AuthService,
        private readonly httpClient: HttpClient,
        private readonly store: Store<AppState>
    ) {}

    getDialogs(): Observable<IDialog[]> {
        this.store.dispatch(updateRequestLoading({ requestLoading: true }))

        return this.authService
            .authRequest((accessToken) => {
                return this.httpClient
                    .get(`${environment.apiUrl}/dialog`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`,
                        },
                    })
                    .pipe(map((val) => (val as IGetDialogsResponse).data))
            })
            .pipe(
                map((dialogs) => {
                    this.store.dispatch(updateRequestLoading({ requestLoading: false }))

                    if (!dialogs) return []
                    return dialogs
                })
            )
    }

    getMessages(receiverID: number, take: number, skip: number): Observable<IMessage[]> {
        this.store.dispatch(updateRequestLoading({ requestLoading: true }))

        const params = new HttpParams().set('take', `${take}`).set('skip', `${skip}`)

        return this.authService
            .authRequest((accessToken) =>
                this.httpClient
                    .get(`${environment.apiUrl}/message/${receiverID}`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`,
                        },
                        params,
                    })
                    .pipe(map((result) => (result as IGetMessagesResponse).data))
            )
            .pipe(
                map((result) => {
                    this.store.dispatch(updateRequestLoading({ requestLoading: false }))

                    return result === null ? [] : result
                }),
            )
    }

    sendMessage(receiverID: number, message: string): Observable<IMessage | null> {
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
                    .pipe(map((result) => (result as ISendMessageResponse).data))
            })
            .pipe(
                map((message) => {
                    this.store.dispatch(updateRequestLoading({ requestLoading: false }))

                    return message
                })
            )
    }

    messageRead(messageID: number): Observable<void | null> {
        this.store.dispatch(updateRequestLoading({ requestLoading: true }))

        const params = new HttpParams().set('message-id', `${messageID}`)

        return this.authService
            .authRequest((accessToken: string) => {
                return this.httpClient.get<void>(`${environment.apiUrl}/message/read`, {
                    params,
                    headers: {
                        authorization: `Bearer ${accessToken}`,
                    },
                })
            })
            .pipe(
                tap(() => {
                    this.store.dispatch(updateRequestLoading({ requestLoading: false }))
                })
            )
    }

    getUserName(userID: number): Observable<string | null> {
        this.store.dispatch(updateRequestLoading({ requestLoading: true }))

        return this.authService.authRequest((accessToken) => {
            return this.httpClient.get(`${environment.apiUrl}/user/${userID}/name`, {
                headers: {
                    authorization: `Bearer ${accessToken}`,
                }
            }).pipe(map((result) => (result as IGetUserNameResponse).data))
        }).pipe(
            tap(() => {
                this.store.dispatch(updateRequestLoading({ requestLoading: false }))
            })
        )
    }
}