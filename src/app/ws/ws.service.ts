import { Injectable } from '@angular/core'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Observable, of } from 'rxjs'
import { first, switchMap } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import socketio from 'socket.io-client'
import { ISocket } from './socket.interface'
import { SessionService } from '../session/session.service'
import { UPDATE_TOKEN_MAX_COUNT } from '../session/session.constants'
import { AppState } from '../store/state/app.state'
import { select, Store } from '@ngrx/store'
import { selectAccessToken } from '../store/selectors/auth.selectors'

const WS_RECONNECTION_DELAY = 2500

@Injectable()
export class WsService {
    private updatingCount = 0
    private connectionError = false

    constructor(
        private readonly deviceService: DeviceDetectorService,
        private readonly store: Store<AppState>,
        private readonly sessionService: SessionService
    ) {}

    getSocket(): Observable<ISocket | null> {
        return this.updateSocket().pipe(
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

    private updateSocket() {
        return this.store.pipe(select(selectAccessToken), first(), switchMap(this.createSocket.bind(this)))
    }

    private createSocket(accessToken: string): Observable<ISocket | null> {
        const deviceInfo = this.deviceService.getDeviceInfo()

        return new Observable((observer) => {
            if (accessToken) {
                const socket: ISocket = socketio(environment.url, {
                    reconnectionDelay: WS_RECONNECTION_DELAY,
                    reconnection: true,
                    query: {
                        authorization: 'Bearer ' + accessToken,
                        os: `${deviceInfo.os}/${deviceInfo.os_version}`,
                        browser: `${deviceInfo.browser}/${deviceInfo.browser_version}`,
                    },
                })

                socket.on('connect_error', () => {
                    this.connectionError = true
                })

                socket.on('error:invalid_token', () => {
                    this.connectionError = true
                    socket.disconnect()
                    observer.next(null)
                })

                socket.on('user:connect_success', () => {
                    this.connectionError = false
                    this.updatingCount = 0
                })

                socket.emit('user:connect')

                observer.next(socket)
            } else {
                observer.next(null)
            }
        })
    }
}