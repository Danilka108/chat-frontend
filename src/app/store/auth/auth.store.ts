import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { distinctUntilKeyChanged, map } from 'rxjs/operators'
import { UPDATE_ACCESS_TOKEN } from './actions/access-token.actions'
import { UPDATE_CONNECTION_ERROR } from './actions/connection-error.actions'
import { UPDATE_USER_ID } from './actions/user-id.actions'
import { ACCESS_TOKEN, CONNECTION_ERROR, USER_ID } from './keys'
import { AuthStoreDipsatchActionsType, AuthStoreSelectActionsType } from './types'

export interface IAuthStoreState {
    [USER_ID]: number | null
    [ACCESS_TOKEN]: string
    [CONNECTION_ERROR]: boolean
}

const initialState: IAuthStoreState = {
    [USER_ID]: null,
    [ACCESS_TOKEN]: '',
    [CONNECTION_ERROR]: false,
}

@Injectable({
    providedIn: 'root',
})
export class AuthStore {
    state = new BehaviorSubject(initialState)
    state$ = this.state.asObservable()

    dispatch(action: AuthStoreDipsatchActionsType) {
        switch (action.type) {
            case UPDATE_USER_ID: {
                this.state.next({
                    ...this.state.getValue(),
                    [USER_ID]: action.payload,
                })

                break
            }
            case UPDATE_ACCESS_TOKEN: {
                this.state.next({
                    ...this.state.getValue(),
                    [ACCESS_TOKEN]: action.payload,
                })

                break
            }
            case UPDATE_CONNECTION_ERROR: {
                this.state.next({
                    ...this.state.getValue(),
                    [CONNECTION_ERROR]: action.payload,
                })

                break
            }
        }
    }

    select<Item>({ key, selectFn }: AuthStoreSelectActionsType<IAuthStoreState, Item>) {
        return this.state$.pipe(distinctUntilKeyChanged(key), map(selectFn))
    }

    selectSync<Item>({ selectFn }: AuthStoreSelectActionsType<IAuthStoreState, Item>) {
        return selectFn(Object.create(this.state.getValue()))
    }
}
