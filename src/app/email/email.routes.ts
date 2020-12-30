import { Routes } from '@angular/router'
import { emailConfirmEmailPath, emailPasswordResetedPath, emailResetPasswordPath } from '../routes.constants'
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component'
import { PasswordResetedComponent } from './pages/password-reseted/password-reseted.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/',
    },
    {
        path: emailConfirmEmailPath.relative,
        component: ConfirmEmailComponent,
    },
    {
        path: emailPasswordResetedPath.relative,
        component: PasswordResetedComponent,
    },
    {
        path: emailResetPasswordPath.relative,
        component: ResetPasswordComponent,
    },
]
