export const authKey = 'auth'

export interface AuthState {
    userID: number | null
    userName: string
    accessToken: string
    connectionError: boolean
}

export const authInitialState: AuthState = {
    userID: null,
    userName: '',
    accessToken: '',
    connectionError: false,
}
