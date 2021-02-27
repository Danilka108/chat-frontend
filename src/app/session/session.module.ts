import { NgModule } from '@angular/core'
import { SessionHttpService } from './session-http.service'
import { SessionLocalStorageService } from './session-local-storage.service'
import { SessionService } from './session.service'

@NgModule({
    providers: [SessionHttpService, SessionLocalStorageService, SessionService],
})
export class SessionModule {}
