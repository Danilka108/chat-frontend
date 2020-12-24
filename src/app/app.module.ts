import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './material/material.module'
import { AuthModule } from './auth/auth.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'

@NgModule({
    declarations: [AppComponent, PageNotFoundComponent],
    imports: [BrowserModule, BrowserAnimationsModule, MaterialModule, AuthModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
