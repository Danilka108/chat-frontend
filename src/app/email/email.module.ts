import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component'
import { RouterModule } from '@angular/router'
import { GlobalComponentsModule } from '../global-components/global-components.module'
import { EmailHttpService } from './email-http.service'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MaterialModule } from '../material/material.module'
import { PasswordResetedComponent } from './pages/password-reseted/password-reseted.component'
import { EmailRoutingModule } from './email-routing.module'

@NgModule({
    declarations: [ConfirmEmailComponent, ResetPasswordComponent, PasswordResetedComponent],
    imports: [
        CommonModule,
        RouterModule,
        GlobalComponentsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        EmailRoutingModule,
    ],
    providers: [EmailHttpService],
})
export class EmailModule {}
