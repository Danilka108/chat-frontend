export interface IHttpSignInBody {
    email: string
    password: string
    os: string
    browser: string
}

export interface IHttpSingInResponse {
    statusCode: number
    message: string
    data: {
        userID: number
        accessToken: string
        refreshToken: string
    }
}
