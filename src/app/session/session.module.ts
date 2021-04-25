import { NgModule } from '@angular/core'
import { StorageModule } from '../storage/storage.module'
import { SessionHttpService } from './session-http.service'
import { SessionService } from './session.service'

@NgModule({
    providers: [SessionHttpService, SessionService],
    imports: [StorageModule],
})
export class SessionModule {}
