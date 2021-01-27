import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { AuthService } from 'src/app/auth/services/auth.service'
import { updateRequestLoading } from 'src/app/store/actions/main.actions'
import { Store } from 'src/app/store/core/store'
import { IAppState } from 'src/app/store/states/app.state'
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
        private readonly store: Store<IAppState>
    ) {}

    getDialogs() {
        this.store.dispatch(updateRequestLoading(true))

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
                    this.store.dispatch(updateRequestLoading(false))

                    if (!dialogs) return []
                    return dialogs
                })
            )
    }

    getMessages(receiverID: number, take: number, skip: number) {
        this.store.dispatch(updateRequestLoading(true))

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
                    this.store.dispatch(updateRequestLoading(false))
                    if (!result) return []
                    return result
                })
            )
    }
}
