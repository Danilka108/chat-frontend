interface IRoutingPath {
    full: string
    relative: string
}

const authSectionPrefix = 'auth'

export const authSectionPath: IRoutingPath = {
    full: `/${authSectionPrefix}`,
    relative: `${authSectionPrefix}`,
}

export const authSectionSignInPath: IRoutingPath = {
    full: `/${authSectionPrefix}/sign-in`,
    relative: `sign-in`,
}

export const authSectionSignUpPath: IRoutingPath = {
    full: `/${authSectionPrefix}/sign-up`,
    relative: `sign-up`,
}

export const authSectionCompleteRegistrationPath: IRoutingPath = {
    full: `/${authSectionPrefix}/complete-registration`,
    relative: `complete-registration`,
}

export const authSectionResetPasswordPath: IRoutingPath = {
    full: `/${authSectionPrefix}/reset-password`,
    relative: `reset-password`,
}

export const authSectionResetPasswordCheckEmailPath: IRoutingPath = {
    full: `/${authSectionPrefix}/reset-password-check-email`,
    relative: `reset-password-check-email`,
}

const emailSectionPrefix = 'email'

export const emailSectionPath: IRoutingPath = {
    full: `/${emailSectionPrefix}`,
    relative: `${emailSectionPrefix}`,
}

export const emailSectionConfirmEmailPath: IRoutingPath = {
    full: `/${emailSectionPrefix}/confirm-email`,
    relative: `confirm-email`,
}

export const emailSectionResetPasswordPath: IRoutingPath = {
    full: `/${emailSectionPrefix}/reset-password`,
    relative: `reset-password`,
}

export const emailSectionPasswordResetedPath: IRoutingPath = {
    full: `/${emailSectionPrefix}/password-reseted`,
    relative: `password-reseted`,
}

const mainSectionPrefix = 'main'

export const mainSectionPath: IRoutingPath = {
    full: `/${mainSectionPrefix}`,
    relative: `${mainSectionPrefix}`,
}

export const mainSectionDialogsPath: IRoutingPath = {
    full: `/${mainSectionPrefix}/dialogs`,
    relative: `dialogs`,
}
