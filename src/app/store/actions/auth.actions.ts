import { createAction, props } from '@ngrx/store'

export const updateUserID = createAction('[Auth] Update User ID', props<{ userID: number }>())

export const updateAccessToken = createAction('[Auth] Update Access Token', props<{ accessToken: string }>())

export const updateConnectionError = createAction(
    '[Auth] Update Connection Error',
    props<{ connectionError: boolean }>()
)

export const updateUserName = createAction('[Auth] Update User Name', props<{ userName: string }>())
