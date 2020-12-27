import { Routes } from '@angular/router'
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component'
import { completeRegistrationPath, emailConfirmEmailPath, emailPasswordResetedPath, emailResetPasswordPath, resetPasswordCheckEmailPath, resetPasswordPath, signInPath, signUpPath } from '../routes.constants'
import { CompleteRegistrationComponent } from './pages/complete-registration/complete-registration.component'
import { EmailConfirmEmailComponent } from './pages/email/email-confirm-email/email-confirm-email.component'
import { EmailResetPasswordComponent } from './pages/email/email-reset-password/email-reset-password.component'
import { PasswordResetedComponent } from './pages/email/password-reseted/password-reseted.component'
import { ResetPasswordCheckEmailComponent } from './pages/reset-password-check-email/reset-password-check-email.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { SignUpComponent } from './pages/sign-up/sign-up.component'

export const routes: Routes = [
    { path: signInPath.relative, component: SignInComponent },
    { path: signUpPath.relative, component: SignUpComponent },
    { path: completeRegistrationPath.relative, component: CompleteRegistrationComponent },
    { path: resetPasswordPath.relative, component: ResetPasswordComponent },
    { path: resetPasswordCheckEmailPath.relative, component: ResetPasswordCheckEmailComponent },
    { path: emailConfirmEmailPath.relative, component: EmailConfirmEmailComponent },
    { path: emailResetPasswordPath.relative, component: EmailResetPasswordComponent },
    { path: emailPasswordResetedPath.relative, component: PasswordResetedComponent },
]
