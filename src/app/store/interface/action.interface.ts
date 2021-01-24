import { State } from './state.interface'

export interface DispatchAction {
    (state: State): State
}

export interface SelectAction<T> {
    filter([previousState, state]: [State, State]): boolean,
    select(state: State): T
}

export const setActiveReceiverID = (activeReceiverID: number | null): DispatchAction => {
    return (state: State) => {
        return {
            ...state,
            main: {
                ...state.main,
                activeReceiverID,
            }
        }
    }
}



// export const getActiveReceiverID: SelectAction<number | null> = () => ({
//     filter: ([PreviousState, state]) => (
//         PreviousState.main.activeReceiverID !== state.main.activeReceiverID
//     ),
//     select: (state) => {
//         return state.main.activeReceiverID
//     }
// })