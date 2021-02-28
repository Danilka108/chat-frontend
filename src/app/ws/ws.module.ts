import { NgModule } from '@angular/core'
import { SessionModule } from '../session/session.module'
import { WsService } from './ws.service'

@NgModule({
    imports: [SessionModule],
    providers: [WsService],
})
export class WsModule {}
