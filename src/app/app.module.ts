import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './material/material.module'
import { AuthModule } from './auth/auth.module'
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'
import { GlobalRoutingModule } from './global-routing/global-routing.module'
import { MainModule } from './main/main.module'
import { HttpService } from './services/http.service'
import { LocalStorageService } from './services/local-storage.service'

@NgModule({
    declarations: [AppComponent, PageNotFoundComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        GlobalRoutingModule,
        AuthModule,
        MainModule,
    ],
    providers: [
        HttpService,
        LocalStorageService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
