import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RoutingModule } from './routing/routing.module'
import { environment } from 'src/environments/environment'
import { StoreModule } from '@ngrx/store'
import { appReducer } from './store/reducers/app.reducer'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { MaterialModule } from './material/material.module'

@NgModule({
    declarations: [AppComponent],
    imports: [
        MaterialModule,
        BrowserModule,
        BrowserAnimationsModule,
        RoutingModule,
        StoreModule.forRoot(appReducer),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
