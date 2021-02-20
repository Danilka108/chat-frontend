import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RoutingModule } from './routing/routing.module'
import { StoreCoreModule } from './store/core/store-core.module'
import { appInitialState } from './store/states/app.state'
import { appReducersMap } from './store/reducers/app.reducer'
import { NG_EVENT_PLUGINS } from '@tinkoff/ng-event-plugins'

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RoutingModule,
        StoreCoreModule.forRoot(appInitialState, appReducersMap),
    ],
    providers: [...NG_EVENT_PLUGINS],
    bootstrap: [AppComponent],
})
export class AppModule {}
