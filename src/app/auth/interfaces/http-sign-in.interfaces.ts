export interface IHttpSignInBody {
    email: string
    password: string
    os: string
    browser: string
}

export interface IHttpSingInResponse {
    statusCode: number,
    message: string,
    data: {
        id: number,
        accessToken: string,
        refreshToken: string,
    }
}