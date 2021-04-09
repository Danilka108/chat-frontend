import { Injectable } from '@angular/core'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Observable, of } from 'rxjs'
import { first, switchMap } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import socketio from 'socket.io-client'
import { SessionService } from '../session/session.service'
import { UPDATE_TOKEN_MAX_COUNT } from '../session/session.constants'
import { AppState } from '../store/state/app.state'
import { select, Store } from '@ngrx/store'
import { selectAccessToken } from '../store/selectors/auth.selectors'
import { WsEvents } from './ws.events'
import { updateReconnectionLoading } from '../store/actions/main.actions'

const WS_RECONNECTION_DELAY = 2500

@Injectable()
export class WsService {
    private updatingCount = 0

    private socket: Observable<SocketIOClient.Socket | null> | null = null

    constructor(
        private readonly deviceService: DeviceDetectorService,
        private readonly store: Store<AppState>,
        private readonly sessionService: SessionService
    ) {}

    fromEvent<T>(event: string): Observable<T> {
        if (this.socket === null) {
            this.socket = this.getSocket()
        }

        return this.socket.pipe(
            switchMap(
                (socket) =>
                    new Observable<T>((observer) => {
                        if (socket !== null) {
                            socket.on(event, (data: T) => {
                                observer.next(data)
                            })
                        }
                    })
            )
        )
    }

    private getSocket(): Observable<SocketIOClient.Socket | null> {
        return this.store.pipe(
            select(selectAccessToken),
            first(),
            switchMap((accessToken) => this.createSocket(accessToken)),
            switchMap((socket) => {
                if (this.updatingCount >= UPDATE_TOKEN_MAX_COUNT) {
                    this.sessionService.remove()
                    return of(null)
                }

                if (socket === null) {
                    return this.sessionService.update().pipe(
                        switchMap(() => {
                            this.updatingCount += 1
                            return this.getSocket()
                        })
                    )
                }

                return of(socket)
            })
        )
    }

    private createSocket(accessToken: string): Observable<SocketIOClient.Socket | null> {
        const deviceInfo = this.deviceService.getDeviceInfo()

        return new Observable((observer) => {
            if (accessToken) {
                const socket = socketio(environment.url, {
                    reconnectionDelay: WS_RECONNECTION_DELAY,
                    reconnection: true,
                    query: {
                        authorization: 'Bearer ' + accessToken,
                        os: `${deviceInfo.os}/${deviceInfo.os_version}`,
                        browser: `${deviceInfo.browser}/${deviceInfo.browser_version}`,
                    },
                })

                socket.on('connect', () => {
                    socket.emit(WsEvents.user.connect)
                })

                socket.on('connect_error', () => {
                    this.store.dispatch(updateReconnectionLoading({ reconnectionLoading: true }))
                })

                socket.on(WsEvents.user.invalidToken, () => {
                    this.store.dispatch(updateReconnectionLoading({ reconnectionLoading: true }))
                    socket.disconnect()
                    observer.next(null)
                })

                socket.on(WsEvents.user.connectSuccess, () => {
                    this.store.dispatch(updateReconnectionLoading({ reconnectionLoading: false }))
                    this.updatingCount = 0
                })

                observer.next(socket)
            } else {
                observer.next(null)
            }
        })
    }
}
