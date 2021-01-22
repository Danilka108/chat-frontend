import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MaterialModule } from 'src/app/material/material.module'
import { RouterModule } from '@angular/router'
import { routes } from './auth-section.routes'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RedirectComponent } from './components/redirect/redirect.component'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { GlobalComponentsModule } from 'src/app/global-components/global-components.module'
import { SignUpComponent } from './pages/sign-up/sign-up.component'
import { CompleteRegistrationComponent } from './pages/complete-registration/complete-registration.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { ResetPasswordCheckEmailComponent } from './pages/reset-password-check-email/reset-password-check-email.component'
import { HttpClientModule } from '@angular/common/http'
import { AuthSectionHttpService } from './services/auth-section-http.service'

@NgModule({
    declarations: [
        RedirectComponent,
        SignInComponent,
        SignUpComponent,
        CompleteRegistrationComponent,
        ResetPasswordComponent,
        ResetPasswordCheckEmailComponent,
    ],
    imports: [
        CommonModule,
        GlobalComponentsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(routes),
        HttpClientModule,
    ],
    providers: [AuthSectionHttpService],
})
export class AuthSectionModule {}
