import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'

interface IDialogMessages {
    receiverID: number
    messages: IMessage[]
}

@Injectable({
    providedIn: 'root',
})
export class MainStore {
    private readonly activeReceiverID = new BehaviorSubject<number | null>(null)
    private readonly activeReceiverID$ = this.activeReceiverID.asObservable()

    private readonly dialogs = new BehaviorSubject<IDialog[]>([])
    private readonly dialogs$ = this.dialogs.asObservable()

    private readonly dialogsMessages = new BehaviorSubject<IDialogMessages[]>([])
    private readonly dialogsMessages$ = this.dialogsMessages.asObservable()

    private readonly requestLoading = new BehaviorSubject<boolean>(false)
    private readonly requestLoading$ = this.requestLoading.asObservable()

    getActiveReceiverID$() {
        return this.activeReceiverID$
    }

    setActiveReceiverID(activeReceiverID: number | null) {
        this.activeReceiverID.next(activeReceiverID)
    }

    getDialogs$() {
        return this.dialogs$
    }

    getDialogs() {
        return this.dialogs.getValue()
    }

    hasDialog(receiverID: number) {
        const dialogs = this.dialogs.getValue()

        if (receiverID === null) return false

        const index = dialogs.findIndex((dialog) => {
            return dialog.receiverID === receiverID
        })

        return index > -1
    }

    addDialog(dialog: IDialog) {
        const dialogs = this.dialogs.getValue().concat()

        const dialogIndex = dialogs.findIndex((dlg) => {
            return dlg.receiverID === dialog.receiverID ? true : false
        })

        if (dialogIndex > -1) {
            dialogs[dialogIndex] = dialog
        } else {
            dialogs.push(dialog)
        }

        this.dialogs.next(dialogs)
    }

    getDialogMessages$(receiverID: number) {
        return this.dialogsMessages$.pipe(
            map((dialogsMessages) => {
                const dialogMessages = dialogsMessages.find((dialogMessages) => {
                    return dialogMessages.receiverID === receiverID ? true : false
                })

                if (!dialogMessages) return null
                return dialogMessages
            })
        )
    }

    getDialogMessages(receiverID: number) {
        const dialogsMessages = this.dialogsMessages.getValue()

        const dialogMessages = dialogsMessages.find((dialogMessages) => {
            return dialogMessages.receiverID === receiverID ? true : false
        })

        if (!dialogMessages) return null
        return dialogMessages
    }

    addDialogMessages(receiverID: number, ...messages: IMessage[]) {
        const dialogsMessages = this.dialogsMessages.getValue().concat()

        const dialogMessagesIndex = dialogsMessages.findIndex(
            (dialogMessages) => dialogMessages.receiverID === receiverID
        )

        if (dialogMessagesIndex > -1) {
            messages.forEach((message) => {
                const messageIndex = dialogsMessages[dialogMessagesIndex].messages.findIndex(
                    (msg) => msg.messageID === message.messageID
                )

                if (messageIndex > -1) {
                    dialogsMessages[dialogMessagesIndex].messages[messageIndex] = message
                } else {
                    dialogsMessages[dialogMessagesIndex].messages.push(message)
                }
            })

            this.dialogsMessages.next(dialogsMessages)
        } else {
            const index = this.getDialogs().findIndex((dialog) => dialog.receiverID === receiverID)

            if (index > -1) {
                dialogsMessages.push({
                    receiverID,
                    messages,
                })

                this.dialogsMessages.next(dialogsMessages)
            }
        }
    }

    // addDialogMessage(receiverID: number, message: IMessage) {
    //     const dialogsMessages = this.dialogsMessages.getValue().concat()

    //     const dialogMessagesIndex = dialogsMessages.findIndex((dialogMessages) => {
    //         return dialogMessages.receiverID === receiverID ? true : false
    //     })

    //     if (dialogMessagesIndex > -1) {
    //         const messageIndex = dialogsMessages[dialogMessagesIndex].messages.findIndex((msg) => {
    //             return msg.messageID === message.messageID ? true : false
    //         })

    //         if (messageIndex > -1) {
    //             dialogsMessages[dialogMessagesIndex].messages[messageIndex] = message
    //         } else {
    //             dialogsMessages[dialogMessagesIndex].messages.push(message)
    //         }

    //         this.dialogsMessages.next(dialogsMessages)
    //     } else {
    //         const isExist = this.getDialogs().find((dialog) => {
    //             if (dialog.receiverID === receiverID) return true
    //             return false
    //         })

    //         if (isExist) {
    //             this.dialogsMessages.next([
    //                 ...dialogsMessages,
    //                 {
    //                     receiverID,
    //                     messages: [message],
    //                 },
    //             ])
    //         }
    //     }
    // }

    getRequestLoading() {
        return this.requestLoading.getValue()
    }

    getRequestLoading$() {
        return this.requestLoading$
    }

    setRequestLoading(requestLoading: boolean) {
        this.requestLoading.next(requestLoading)
    }
}
