import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { routes } from './global-routing.routes'
import { AuthGuard } from './guards/auth.guard'
import { MainGuard } from './guards/main.guard'
import { RedirectComponent } from './redirect.component'
import { RedirectGuard } from './guards/redirect.guard'
import { VerifyService } from './verify.service'

@NgModule({
    declarations: [
        RedirectComponent,
    ],
    imports: [RouterModule.forRoot(routes), CommonModule],
    providers: [AuthGuard, MainGuard, RedirectGuard, VerifyService],
    exports: [RouterModule],
})
export class GlobalRoutingModule {}
