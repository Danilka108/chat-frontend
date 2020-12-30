import { Routes } from '@angular/router'
import {
    authCompleteRegistrationPath,
    authResetPasswordCheckEmailPath,
    authResetPasswordPath,
    authSignInPath,
    authSignUpPath,
} from '../routes.constants'
import { CompleteRegistrationComponent } from './pages/complete-registration/complete-registration.component'
import { ResetPasswordCheckEmailComponent } from './pages/reset-password-check-email/reset-password-check-email.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { SignUpComponent } from './pages/sign-up/sign-up.component'

export const routes: Routes = [
    // { path: '/', pathMatch: 'full', redirectTo: authSignInPath.full },
    { path: authSignInPath.relative, component: SignInComponent },
    { path: authSignUpPath.relative, component: SignUpComponent },
    { path: authCompleteRegistrationPath.relative, component: CompleteRegistrationComponent },
    { path: authResetPasswordPath.relative, component: ResetPasswordComponent },
    { path: authResetPasswordCheckEmailPath.relative, component: ResetPasswordCheckEmailComponent },
]
