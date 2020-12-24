import { Routes } from '@angular/router'
import { CompleteRegistrationComponent } from './pages/complete-registration/complete-registration.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { SignUpComponent } from './pages/sign-up/sign-up.component'

export const routes: Routes = [
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'complete-registration', component: CompleteRegistrationComponent }
]