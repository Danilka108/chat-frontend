import { State } from './state.interface'

export interface Filter {
    ([previousState, state]: [State, State]): boolean
}
