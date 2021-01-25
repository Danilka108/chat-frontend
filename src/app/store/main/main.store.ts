import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { UPDATE_ACTIVE_RECEIVER_ID } from './actions/active-receiver-id.actions'
import { ADD_DIALOGS_MESSAGES } from './actions/dialogs-messages.actions'
import { ADD_DIALOGS } from './actions/dialogs.actions'
import { UPDATE_REQUEST_LOADING } from './actions/request-loading.actions'
import { IDialogMessages } from './interfaces/dialog-messages.interface'
import { ACTIVE_RECEIVER_ID, DIALOGS, DIALOGS_MESSAGES, REQUEST_LOADING } from './keys'
import { MainStoreDispatchActionsType, MainStoreSelectActionsType } from './types'

export interface IMainStoreState {
    [ACTIVE_RECEIVER_ID]: number | null
    [DIALOGS]: IDialog[]
    [DIALOGS_MESSAGES]: IDialogMessages[]
    [REQUEST_LOADING]: boolean
}

const initialState: IMainStoreState = {
    [ACTIVE_RECEIVER_ID]: null,
    [DIALOGS]: [],
    [DIALOGS_MESSAGES]: [],
    [REQUEST_LOADING]: false,
}

@Injectable({
    providedIn: 'root',
})
export class MainStore {
    private readonly state = new BehaviorSubject<IMainStoreState>(initialState)
    private readonly state$ = this.state.asObservable().pipe()

    dispatch(action: MainStoreDispatchActionsType) {
        switch (action.type) {
            case UPDATE_ACTIVE_RECEIVER_ID: {
                this.state.next({
                    ...this.state.getValue(),
                    [ACTIVE_RECEIVER_ID]: action.payload,
                })
                break
            }
            case ADD_DIALOGS: {
                const dialogs = this.state.getValue()[DIALOGS].concat()

                action.payload.dialogs.forEach((dialog) => {
                    const dialogIndex = dialogs.findIndex((dlg) => dlg.receiverID === dialog.receiverID)

                    if (dialogIndex > -1) {
                        dialogs[dialogIndex] = dialog
                    } else {
                        dialogs.push(dialog)
                    }
                })

                this.state.next({
                    ...this.state.getValue(),
                    [DIALOGS]: dialogs,
                })

                break
            }
            case ADD_DIALOGS_MESSAGES: {
                const dialogsMessages = this.state.getValue()[DIALOGS_MESSAGES].concat()

                const dialogMessagesIndex = dialogsMessages.findIndex(
                    (dialogMessages) => dialogMessages.receiverID === action.payload.receiverID
                )

                if (dialogMessagesIndex > -1) {
                    action.payload.messages.forEach((message) => {
                        const messageIndex = dialogsMessages[dialogMessagesIndex].messages.findIndex(
                            (msg) => msg.messageID === message.messageID
                        )

                        if (messageIndex > -1) {
                            dialogsMessages[dialogMessagesIndex].messages[messageIndex] = message
                        } else {
                            dialogsMessages[dialogMessagesIndex].messages.push(message)
                        }
                    })

                    this.state.next({
                        ...this.state.getValue(),
                        [DIALOGS_MESSAGES]: dialogsMessages,
                    })
                } else {
                    const dialogIndex = this.state
                        .getValue()
                        [DIALOGS].findIndex((dialog) => dialog.receiverID === action.payload.receiverID)

                    if (dialogIndex > -1) {
                        dialogsMessages.push({
                            receiverID: action.payload.receiverID,
                            messages: action.payload.messages,
                        })

                        this.state.next({
                            ...this.state.getValue(),
                            [DIALOGS_MESSAGES]: dialogsMessages,
                        })
                    }
                }

                break
            }
            case UPDATE_REQUEST_LOADING: {
                this.state.next({
                    ...this.state.getValue(),
                    [REQUEST_LOADING]: action.payload,
                })

                break
            }
        }
    }

    select<Item>({ key, selectFn }: MainStoreSelectActionsType<IMainStoreState, Item>) {
        return this.state$.pipe(
            distinctUntilChanged((previousState, state) => {
                return previousState[key] === state[key]
            }),
            map(selectFn)
        )
    }

    selectSync<Item>({ selectFn }: MainStoreSelectActionsType<IMainStoreState, Item>) {
        return selectFn(Object.create(this.state.getValue()))
    }
}
