import {
    IActiveReceiverIDSelectAction,
    IUpdateActiveReceiverIDDispatchAction,
} from './actions/active-receiver-id.actions'
import { IAddDialogsMessagesDispatchAction, IDialogMessagesSelectAction } from './actions/dialogs-messages.actions'
import { IAddDialogsDispatchAction, IDialogsSelectAction } from './actions/dialogs.actions'
import { IRequestLoadingSelectAction, IUpdateRequestLoadingSelectAction } from './actions/request-loading.actions'
import { ACTIVE_RECEIVER_ID, DIALOGS, DIALOGS_MESSAGES, REQUEST_LOADING } from './keys'

export type MainStoreDispatchActionsType =
    | IUpdateActiveReceiverIDDispatchAction
    | IAddDialogsDispatchAction
    | IAddDialogsMessagesDispatchAction
    | IUpdateRequestLoadingSelectAction

export type MainStoreSelectActionsType<T> =
    | IActiveReceiverIDSelectAction<T>
    | IDialogsSelectAction<T>
    | IDialogMessagesSelectAction<T>
    | IRequestLoadingSelectAction<T>

export type MainStoreKeysType =
    | typeof ACTIVE_RECEIVER_ID
    | typeof DIALOGS
    | typeof DIALOGS_MESSAGES
    | typeof REQUEST_LOADING
