import { ReducersMap } from './interfaces/reducers-map.type'
import { Store } from './store'

export const storeFactory = <StateType>(reducers: ReducersMap<StateType>, initialState: StateType) => () =>
    new Store(reducers, initialState)
