import { createFeatureSelector, createSelector } from '@ngrx/store'
import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { AppState } from '../state/app.state'
import { mainKey, MainState } from '../state/main.state'

export const selectMain = createFeatureSelector<AppState, MainState>(mainKey)

export const selectActiveReceiverID = createSelector(selectMain, (mainState) => mainState.activeReceiverID)

export const selectDialogs = createSelector(selectMain, (mainState: MainState): IDialog[] => mainState.dialogs)

export const selectDialogsReceiverIDs = createSelector(selectMain, (mainState) => {
    return mainState.dialogs.map((dialog) => {
        return dialog.receiverID
    })
})

export const selectDialog = createSelector(
    selectMain,
    (mainState: MainState, { receiverID }: { receiverID: number }): IDialog | null => {
        const dialogIndex = mainState.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            const { receiverID, receiverName, lastMessage, createdAt, newMessagesCount } = mainState.dialogs[
                dialogIndex
            ]

            return {
                receiverID,
                receiverName,
                lastMessage,
                createdAt,
                newMessagesCount,
            }
        }

        return null
    }
)

export const selectDialogMessages = createSelector(
    selectMain,
    (mainState: MainState, { receiverID }: { receiverID: number }) => {
        const dialogIndex = mainState.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            return mainState.dialogs[dialogIndex].messages
        } else {
            return null
        }
    }
)

export const selectDialogScroll = createSelector(
    selectMain,
    (mainState: MainState, { receiverID }: { receiverID: number }) => {
        const dialogIndex = mainState.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            return mainState.dialogs[dialogIndex].scroll
        } else {
            return null
        }
    }
)

export const selectDialogSkip = createSelector(
    selectMain,
    (mainState: MainState, { receiverID }: { receiverID: number }) => {
        const dialogIndex = mainState.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            return mainState.dialogs[dialogIndex].skip
        } else {
            return null
        }
    }
)

export const selectDialogIsUploaded = createSelector(
    selectMain,
    (mainState: MainState, { receiverID }: { receiverID: number }) => {
        const dialogIndex = mainState.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            return mainState.dialogs[dialogIndex].isUploaded
        } else {
            return null
        }
    }
)

export const selectRequestLoading = createSelector(selectMain, (mainState) => mainState.requestLoading)
