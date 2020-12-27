interface IPath {
    full: string,
    relative: string,
}

export const authPath = ''

export const signInPath: IPath = {
    full: '/sign-in',
    relative: 'sign-in'
}

export const signUpPath: IPath = {
    full: '/sign-up',
    relative: 'sign-up',
}

export const completeRegistrationPath: IPath = {
    full: '/complete-registration',
    relative: 'complete-registration',
}

export const resetPasswordPath: IPath = {
    full: '/reset-password',
    relative: 'reset-password',
}

export const resetPasswordCheckEmailPath: IPath = {
    full: '/reset-password-check-email',
    relative: 'reset-password-check-email',
}

export const emailConfirmEmailPath: IPath = {
    full: '/email/confirm-email',
    relative: 'email/confirm-email',
}

export const emailResetPasswordPath: IPath = {
    full: '/email/reset-password',
    relative: 'email/reset-password',
}

export const emailPasswordResetedPath: IPath = {
    full: '/email/password-reseted',
    relative: 'email/password-reseted',
}

export const mainPath: IPath = {
    full: '/main',
    relative: 'main',
}