import { IAccessTokenSelectAction, IUpdateAccessTokenDispatchAction } from './actions/access-token.actions'
import { IConnectionErrorSelectAction, IUpdateConnectionErrorDispatchAction } from './actions/connection-error.actions'
import { IUpdateUserIDDispatchAction, IUserIDSelectAction } from './actions/user-id.actions'
import { ACCESS_TOKEN, CONNECTION_ERROR, USER_ID } from './keys'

export type AuthStoreDipsatchActionsType =
    | IUpdateUserIDDispatchAction
    | IUpdateAccessTokenDispatchAction
    | IUpdateConnectionErrorDispatchAction

export type AuthStoreSelectActionsType<State, Item> =
    | IUserIDSelectAction<State, Item>
    | IAccessTokenSelectAction<State, Item>
    | IConnectionErrorSelectAction<State, Item>

export type AuthStoreKeysType = typeof USER_ID | typeof ACCESS_TOKEN | typeof CONNECTION_ERROR
