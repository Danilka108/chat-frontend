import { NgModule } from '@angular/core'
import { SessionModule } from '../session/session.module'
import { AuthService } from './auth.service'

@NgModule({
    imports: [SessionModule],
    providers: [AuthService],
})
export class AuthModule {}
