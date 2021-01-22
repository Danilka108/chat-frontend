import { Routes } from '@angular/router'
import {
    authSectionCompleteRegistrationPath,
    authSectionResetPasswordCheckEmailPath,
    authSectionResetPasswordPath,
    authSectionSignInPath,
    authSectionSignUpPath,
} from '../../routing.constants'
import { CompleteRegistrationComponent } from './pages/complete-registration/complete-registration.component'
import { ResetPasswordCheckEmailComponent } from './pages/reset-password-check-email/reset-password-check-email.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { SignUpComponent } from './pages/sign-up/sign-up.component'

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: authSectionSignInPath.full,
    },
    {
        path: authSectionSignInPath.relative,
        component: SignInComponent,
    },
    {
        path: authSectionSignUpPath.relative,
        component: SignUpComponent,
    },
    {
        path: authSectionCompleteRegistrationPath.relative,
        component: CompleteRegistrationComponent,
    },
    {
        path: authSectionResetPasswordPath.relative,
        component: ResetPasswordComponent,
    },
    {
        path: authSectionResetPasswordCheckEmailPath.relative,
        component: ResetPasswordCheckEmailComponent,
    },
]
