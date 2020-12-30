import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './material/material.module'
import { AuthModule } from './auth/auth.module'
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'
import { GlobalRoutingModule } from './global-routing/global-routing.module'
import { MainModule } from './main/main.module'
import { AuthStoreModule } from './store/auth/auth-store.module'
import { GlobalComponentsModule } from './global-components/global-components.module'
import { EmailModule } from './email/email.module'

@NgModule({
    declarations: [AppComponent, PageNotFoundComponent],
    imports: [
        GlobalComponentsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        GlobalRoutingModule,
        AuthModule,
        MainModule,
        AuthStoreModule,
        EmailModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
