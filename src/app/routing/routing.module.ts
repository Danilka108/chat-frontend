import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './routing.routes';
import { RedirectComponent } from './components/redirect/redirect.component';
import { RoutingVerifyService } from './routing-verify.service';
import { AuthSectionGuard } from './guards/auth-section.guard';
import { MainSectionGuard } from './guards/main-section.guard';
import { RedirectGuard } from './guards/redirect.guard';
import { AuthLocalStorageService } from '../auth/services/auth-local-storage.service';
import { AuthHttpService } from '../auth/services/auth-http.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [RedirectComponent],
  providers: [
    RoutingVerifyService,
    AuthLocalStorageService,
    AuthHttpService,
    AuthSectionGuard,
    MainSectionGuard,
    RedirectGuard,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class RoutingModule { }
