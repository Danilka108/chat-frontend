export interface IAuthState {
    userID: number | null
    accessToken: string
    connectionError: boolean
}

export const authInitialState: IAuthState = {
    userID: null,
    accessToken: '',
    connectionError: false,
}
