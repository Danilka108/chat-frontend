import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { IAction } from './interfaces/action.interface'
import { ReducersMap } from './interfaces/reducers-map.type'
import { ISelect, ISelectAndParse } from './interfaces/select.interface'

const instanceOfISelect = <StateType, KeyType>(object: unknown): object is ISelect<StateType, KeyType> => {
    return (
        (object as ISelect<StateType, KeyType>).selectorFn !== undefined &&
        (object as ISelect<StateType, KeyType>).parserFn === undefined
    )
}

const instanceOfISelectAndParse = <StateType, KeyType, ReturnType>(
    object: unknown
): object is ISelectAndParse<StateType, KeyType, ReturnType> => {
    const obj = object as ISelectAndParse<StateType, KeyType, ReturnType>
    if (obj.selectorFn !== undefined && obj.parserFn !== undefined) {
        return true
    }
    return false
}

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

    select<KeyType>(select: ISelect<StateType, KeyType>): Observable<KeyType>
    select<KeyType, ReturnType>(select: ISelect<StateType, KeyType, ReturnType>): Observable<ReturnType>
    select<KeyType, ReturnType>(select: unknown) {
        if (instanceOfISelect<StateType, KeyType>(select)) {
            return this.state$.pipe(map(select.selectorFn), distinctUntilChanged())
        } else if (instanceOfISelectAndParse<StateType, KeyType, ReturnType>(select)) {
            return this.state$.pipe(map(select.selectorFn), distinctUntilChanged(), map(select.parserFn))
        } else {
            return this.state$
        }
    }

    selectSnapshot<KeyType>(select: ISelect<StateType, KeyType>): KeyType
    selectSnapshot<KeyType, ReturnType>(select: ISelect<StateType, KeyType, ReturnType>): ReturnType
    selectSnapshot<KeyType, ReturnType>(select: unknown) {
        const state = { ...this.state.getValue() }

        if (instanceOfISelect<StateType, KeyType>(select)) {
            return select.selectorFn(state)
        } else if (instanceOfISelectAndParse<StateType, KeyType, ReturnType>(select)) {
            return select.parserFn(select.selectorFn(state))
        } else {
            return state
        }
    }
}
