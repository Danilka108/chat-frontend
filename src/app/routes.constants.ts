interface IPath {
    full: string
    relative: string
}

export const authPath: IPath = {
    full: '/auth',
    relative: 'auth',
}

export const authSignInPath: IPath = {
    full: '/auth/sign-in',
    relative: 'sign-in',
}

export const authSignUpPath: IPath = {
    full: '/auth/sign-up',
    relative: 'sign-up',
}

export const authCompleteRegistrationPath: IPath = {
    full: '/auth/complete-registration',
    relative: 'complete-registration',
}

export const authResetPasswordPath: IPath = {
    full: '/auth/reset-password',
    relative: 'reset-password',
}

export const authResetPasswordCheckEmailPath: IPath = {
    full: '/auth/reset-password-check-email',
    relative: 'reset-password-check-email',
}

export const emailPath = 'email'

export const emailConfirmEmailPath: IPath = {
    full: '/email/confirm-email',
    relative: 'confirm-email',
}

export const emailResetPasswordPath: IPath = {
    full: '/email/reset-password',
    relative: 'reset-password',
}

export const emailPasswordResetedPath: IPath = {
    full: '/email/password-reseted',
    relative: 'password-reseted',
}

export const mainPath: IPath = {
    full: '/main',
    relative: 'main',
}
