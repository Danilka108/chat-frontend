import { IMainStoreState } from '../main.store'

export interface ISelectFn<T> {
    (state: IMainStoreState): T
}
