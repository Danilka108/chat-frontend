import { createSelector } from '@ngrx/store'
import { selectAuth } from './auth.selectors'
import { selectMain } from './main.selectors'

export const selectActiveReceiverIDAndUserID = createSelector(selectMain, selectAuth, (mainState, authState) => ({
    userID: authState.userID,
    activeReceiverID: mainState.activeReceiverID,
}))
