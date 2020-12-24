import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpService } from './shared/http.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { AuthWrapperComponent } from './components/auth-wrapper/auth-wrapper.component'
import { AuthGroupComponent } from './components/auth-group/auth-group.component'
import { AuthHeaderComponent } from './components/auth-header/auth-header.component'
import { AuthRedirectComponent } from './components/auth-redirect/auth-redirect.component'
import { MaterialModule } from '../material/material.module'
import { AuthErrorComponent } from './components/auth-error/auth-error.component'
import { CompleteRegistrationComponent } from './pages/complete-registration/complete-registration.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { EmailResetPasswordComponent } from './pages/email/email-reset-password/email-reset-password.component';
import { EmailConfirmEmailComponent } from './pages/email/email-confirm-email/email-confirm-email.component'
import { AuthRoutingModule } from './auth-routing.module'
import { AuthComponent } from './components/auth/auth.component';
import { AuthLoadingComponent } from './components/auth-loading/auth-loading.component'

@NgModule({
    declarations: [
        AuthWrapperComponent,
        AuthGroupComponent,
        AuthHeaderComponent,
        AuthRedirectComponent,
        AuthErrorComponent,
        CompleteRegistrationComponent,
        ResetPasswordComponent,
        SignInComponent,
        SignUpComponent,
        EmailResetPasswordComponent,
        EmailConfirmEmailComponent,
        AuthComponent,
        AuthLoadingComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        AuthRoutingModule,
    ],
    providers: [HttpService],
    exports: [
        AuthComponent
    ],
})
export class AuthModule {}
