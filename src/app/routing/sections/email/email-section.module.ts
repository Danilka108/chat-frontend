import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './email-section.routes';
import { EmailSectionHttpService } from './email-section-http.service';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { PasswordResetedComponent } from './pages/password-reseted/password-reseted.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { GlobalComponentsModule } from 'src/app/global-components/global-components.module';

@NgModule({
  declarations: [
    ConfirmEmailComponent,
    PasswordResetedComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GlobalComponentsModule,
    RouterModule.forChild(routes)
  ],
  providers: [EmailSectionHttpService]
})
export class EmailSectionModule { }
