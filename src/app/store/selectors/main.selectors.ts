import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AppState } from '../state/app.state'
import { mainKey, MainState } from '../state/main.state'

export const selectMain = createFeatureSelector<AppState, MainState>(mainKey)

export const selectActiveReceiverID = createSelector(selectMain, (mainState) => mainState.activeReceiverID)

export const selectRequestLoading = createSelector(selectMain, (mainState) => mainState.requestLoading)

export const selectDialogsReceiverIDs = createSelector(selectMain, (state) => {
    if (state.dialogs === null) return []

    return state.dialogs.map((dialog) => dialog.receiverID)
})

export const selectDialogs = createSelector(selectMain, (state) => state.dialogs)

export const selectDialog = createSelector(selectMain, (state: MainState, { receiverID }: { receiverID: number }) => {
    if (state.dialogs === null) return null

    const index = state.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

    if (index === -1) return null

    return state.dialogs[index]
})

export const selectDialogNewMessagesCount = createSelector(
    selectMain,
    (state: MainState, { receiverID }: { receiverID: number }) => {
        if (state.dialogs === null) return null

        const index = state.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (index === -1) return null

        return state.dialogs[index].newMessagesCount
    }
)

export const selectDialogMessages = createSelector(
    selectMain,
    (state: MainState, { receiverID }: { receiverID: number }) => {
        const index = state.messages.findIndex((dialog) => dialog.receiverID === receiverID)

        if (index === -1) return null

        return state.messages[index].messages
    }
)

export const selectDialogConnectionStatus = createSelector(
    selectMain,
    (state: MainState, { receiverID }: { receiverID: number }) => {
        if (state.dialogs === null) return null

        const index = state.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (index === -1) return null

        return state.dialogs[index].connectionStatus
    }
)

export const selectReconnectionLoading = createSelector(
    selectMain,
    (state) => {
        return state.reconnectionLoading
    }
)