import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { routes } from './global-routing.routes'
import { AuthGuard } from './guards/auth.guard'
import { MainGuard } from './guards/main.guard'

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes), CommonModule],
    providers: [AuthGuard, MainGuard],
    exports: [RouterModule],
})
export class GlobalRoutingModule {}
