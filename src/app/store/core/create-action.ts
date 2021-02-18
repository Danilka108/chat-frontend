import { IAction } from './interfaces/action.interface'

export const createAction = <T, P>(type: T, payload: P): IAction<T, P> => {
    return {
        type,
        payload,
    }
}
