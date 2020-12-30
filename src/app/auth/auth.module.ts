import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthHttpService } from './auth-http.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MaterialModule } from '../material/material.module'
import { CompleteRegistrationComponent } from './pages/complete-registration/complete-registration.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { SignUpComponent } from './pages/sign-up/sign-up.component'
import { AuthRoutingModule } from './auth-routing.module'
import { ResetPasswordCheckEmailComponent } from './pages/reset-password-check-email/reset-password-check-email.component'
import { GlobalComponentsModule } from '../global-components/global-components.module'
import { RedirectComponent } from './components/redirect/redirect.component'

@NgModule({
    declarations: [
        CompleteRegistrationComponent,
        ResetPasswordComponent,
        SignInComponent,
        SignUpComponent,
        ResetPasswordCheckEmailComponent,
        RedirectComponent,
    ],
    imports: [
        GlobalComponentsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        AuthRoutingModule,
    ],
    providers: [AuthHttpService],
})
export class AuthModule {}
