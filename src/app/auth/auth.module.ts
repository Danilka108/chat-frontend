import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthHttpService } from './services/auth-http.service';
import { AuthLocalStorageService } from './services/auth-local-storage.service';
import { AuthService } from './services/auth.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        AuthLocalStorageService,
        AuthHttpService,
        HttpClientModule,
        AuthService,
    ],
})
export class AuthModule {}