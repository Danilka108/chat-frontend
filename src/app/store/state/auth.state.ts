export const authKey = 'auth'

export interface AuthState {
    userID: number | null
    accessToken: string
    connectionError: boolean
}

export const authInitialState: AuthState = {
    userID: null,
    accessToken: '',
    connectionError: false,
}
