import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { IAction } from './interfaces/action.interface'
import { ReducersMap } from './interfaces/reducers-map.type'
import {
    ISelect,
    ISelectAndParse,
    STORE_I_SELECT_AND_PARSE_DISCRIMINATOR,
    STORE_I_SELECT_DISCRIMINATOR
} from './interfaces/select.interface'

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

    instanceOfISelect<KeyType>(object: any): object is ISelect<StateType, KeyType> {
        return object.discriminator === STORE_I_SELECT_DISCRIMINATOR
    }

    instanceOfISelectAndParse<KeyType, ReturnType>(object: any): object is ISelectAndParse<StateType, KeyType, ReturnType> {
        return object.discriminator === STORE_I_SELECT_AND_PARSE_DISCRIMINATOR
    }

    select(): Observable<StateType>
    select<KeyType>(select: ISelect<StateType, KeyType>): Observable<KeyType>
    select<KeyType, ReturnType>(select: ISelectAndParse<StateType, KeyType, ReturnType>): Observable<ReturnType>
    select<KeyType, ReturnType>(select?: unknown) {
        if (this.instanceOfISelect<KeyType>(select)) {
            return this.state$.pipe(
                map(select.selectorFn),
                distinctUntilChanged(),
            )
        } else if (this.instanceOfISelectAndParse<KeyType, ReturnType>(select)) {
            return this.state$.pipe(
                map(select.selectorFn),
                distinctUntilChanged(),
                map(select.parserFn)
            )
        } else {
            return this.state$
        }
    }

    selectSnapshot(): StateType
    selectSnapshot<KeyType>(select: ISelect<StateType, KeyType>): KeyType
    selectSnapshot<KeyType, ReturnType>(select: ISelectAndParse<StateType, KeyType, ReturnType>): ReturnType
    selectSnapshot<KeyType, ReturnType>(select?: unknown) {
        const state = { ...this.state.getValue() }

        if (this.instanceOfISelect<KeyType>(select)) {
            return select.selectorFn(state)
        } else if (this.instanceOfISelectAndParse<KeyType, ReturnType>(select)) {
            return select.parserFn(select.selectorFn(state))
        } else {
            return state
        }
    }
}
