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
import { AuthHttpService } from './services/auth-http.service'
import { SessionModule } from 'src/app/session/session.module'
import { StorageModule } from 'src/app/storage/storage.module'

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
        StorageModule,
        SessionModule,
        GlobalComponentsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(routes),
        HttpClientModule,
        CommonModule,
    ],
    providers: [AuthHttpService],
})
export class AuthSectionModule {}
