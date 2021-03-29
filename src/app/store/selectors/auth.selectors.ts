import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AppState } from '../state/app.state'
import { authKey, AuthState } from '../state/auth.state'

export const selectAuth = createFeatureSelector<AppState, AuthState>(authKey)

export const selectUserID = createSelector(selectAuth, (authState) => authState.userID)

export const selectAccessToken = createSelector(selectAuth, (authState) => authState.accessToken)

export const selectConnectionError = createSelector(selectAuth, (authState) => authState.connectionError)

export const selectUserName = createSelector(selectAuth, (authState) => authState.userName)