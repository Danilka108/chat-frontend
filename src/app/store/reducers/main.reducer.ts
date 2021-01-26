import { MainActions, MAIN_ACTIVE_RECEIVER_ID_UPDATE_ACTION } from '../actions/main.actions'
import { IReducerFn } from '../core/interfaces/reducer-fn.interface'
import { IMainState } from '../states/main.state'

export const mainReducer: IReducerFn<IMainState, MainActions> = (state, action) => {
    switch (action.type) {
        case MAIN_ACTIVE_RECEIVER_ID_UPDATE_ACTION: {
            return {
                ...state,
                activeReceiverID: action.payload,
            }
        }
        default:
            return state
    }
}
