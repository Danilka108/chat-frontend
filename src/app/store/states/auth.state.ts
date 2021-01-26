export interface IAuthState {
    userID: number | null
    accessToken: string
}

export const authInitialState: IAuthState = {
    userID: null,
    accessToken: '',
}
