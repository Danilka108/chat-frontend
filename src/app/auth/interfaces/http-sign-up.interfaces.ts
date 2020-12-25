export interface IHttpSignUpBody {
    email: string,
    name: string,
    password: string,
    os: string,
    browser: string,
}

export interface IHttpSignUpResponse {
    statusCode: number,
    message: string,
}