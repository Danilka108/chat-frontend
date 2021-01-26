import { IAction } from '../core/interfaces/action.interface'

export const MAIN_ACTIVE_RECEIVER_ID_UPDATE_ACTION = 'MAIN_ACTIVE_RECEIVER_ID_UPDATE_ACTION'
export const updateActiveReceiverID = (
    activeReceiverID: number | null
): IAction<typeof MAIN_ACTIVE_RECEIVER_ID_UPDATE_ACTION, number | null> => {
    return {
        type: MAIN_ACTIVE_RECEIVER_ID_UPDATE_ACTION,
        payload: activeReceiverID,
    }
}

export type MainActions = ReturnType<typeof updateActiveReceiverID>
