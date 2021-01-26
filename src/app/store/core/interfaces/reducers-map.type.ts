import { IAction } from './action.interface'
import { IReducerFn } from './reducer-fn.interface'

export type ReducersMap<StateType> = {
    [key in keyof StateType]: IReducerFn<StateType[key], IAction<any, any>>
}
