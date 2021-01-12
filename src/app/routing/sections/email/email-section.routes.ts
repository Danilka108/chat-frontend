import { Routes } from '@angular/router';
import { emailSectionConfirmEmailPath, emailSectionPasswordResetedPath, emailSectionResetPasswordPath } from '../../routing.constants';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { PasswordResetedComponent } from './pages/password-reseted/password-reseted.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/',
    },
    {
        path: emailSectionConfirmEmailPath.relative,
        component: ConfirmEmailComponent,
    },
    {
        path: emailSectionPasswordResetedPath.relative,
        component: PasswordResetedComponent,
    },
    {
        path: emailSectionResetPasswordPath.relative,
        component: ResetPasswordComponent,
    }
]