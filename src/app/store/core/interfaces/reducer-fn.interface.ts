import { IAction } from './action.interface'

export interface IReducerFn<StateType, ActionsType extends IAction<unknown, unknown>> {
    (state: StateType, action: ActionsType): StateType
}
