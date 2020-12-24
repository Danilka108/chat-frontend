import { Routes } from '@angular/router'
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component'
import { CompleteRegistrationComponent } from './pages/complete-registration/complete-registration.component'
import { EmailConfirmEmailComponent } from './pages/email/email-confirm-email/email-confirm-email.component'
import { EmailResetPasswordComponent } from './pages/email/email-reset-password/email-reset-password.component'
import { PasswordResetedComponent } from './pages/email/password-reseted/password-reseted.component'
import { ResetPasswordCheckEmailComponent } from './pages/reset-password-check-email/reset-password-check-email.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { SignUpComponent } from './pages/sign-up/sign-up.component'

export const routes: Routes = [
    { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'complete-registration', component: CompleteRegistrationComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'reset-password-check-email', component: ResetPasswordCheckEmailComponent },
    { path: 'email/confirm-email', component: EmailConfirmEmailComponent },
    { path: 'email/reset-password', component: EmailResetPasswordComponent },
    { path: 'email/password-reseted', component: PasswordResetedComponent },
    { path: '**', component: PageNotFoundComponent, pathMatch: 'full' }
]