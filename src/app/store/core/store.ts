import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { ISelectFn } from '../interfaces/select-fn.interface'
import { IAction } from './interfaces/action.interface'
import { ReducersMap } from './interfaces/reducers-map.type'
import { ISelectorFn } from './interfaces/selector.interface'

export class Store<StateType> {
    private state!: BehaviorSubject<StateType>
    private state$!: Observable<StateType>
    private reducers!: ReducersMap<StateType>

    constructor(reducers: ReducersMap<StateType>, initialState: StateType) {
        this.state = new BehaviorSubject(initialState)
        this.state$ = this.state.asObservable()
        this.reducers = reducers
    }

    dispatch(action: IAction<unknown, unknown>) {
        const state = { ...this.state.getValue() }
        const stateKeys = Object.keys(state) as Array<keyof StateType>

        stateKeys.forEach((key) => {
            state[key] = this.reducers[key](state[key], action)
        })

        this.state.next(state)
    }

    select(): Observable<StateType>
    select<KeyType>(selectorFn: ISelectorFn<StateType, KeyType>): Observable<KeyType>
    select<KeyType>(selectorFn?: ISelectorFn<StateType, KeyType>) {
        if (selectorFn) {
            return this.state$.pipe(map(selectorFn), distinctUntilChanged())
        }
        return this.state$
    }

    selectSnapshot(): StateType
    selectSnapshot<KeyType>(selectorFn: ISelectFn<StateType, KeyType>): KeyType
    selectSnapshot<KeyType>(selectorFn?: ISelectFn<StateType, KeyType>) {
        if (selectorFn) return selectorFn({ ...this.state.getValue() })
        return { ...this.state.getValue() }
    }
}
