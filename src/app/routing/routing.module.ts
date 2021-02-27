import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { routes } from './routing.routes'
import { AuthSectionGuard } from './guards/auth-section.guard'
import { MainSectionGuard } from './guards/main-section.guard'
import { RedirectGuard } from './guards/redirect.guard'
import { HttpClientModule } from '@angular/common/http'
import { AuthModule } from '../auth/auth.module'
import { SessionModule } from '../session/session.module'

@NgModule({
    providers: [AuthSectionGuard, MainSectionGuard, RedirectGuard],
    imports: [
        SessionModule,
        AuthModule,
        HttpClientModule,
        CommonModule,
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'disabled',
        }),
    ],
    exports: [RouterModule],
})
export class RoutingModule {}
