import { Routes } from '@angular/router'
import { PageNotFoundComponent } from '../global-components/components/page-not-found/page-not-found.component'
import { authPath, emailPath, mainPath } from '../routes.constants'
import { AuthGuard } from './guards/auth.guard'
import { MainGuard } from './guards/main.guard'
import { RedirectGuard } from './guards/redirect.guard'
import { RedirectComponent } from './redirect.component'

export const routes: Routes = [
    {
        path: '',
        canActivate: [RedirectGuard],
        component: RedirectComponent,
        runGuardsAndResolvers: 'always',
    },
    {
        path: authPath.relative,
        loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
    },
    {
        path: mainPath.relative,
        loadChildren: () => import('../main/main.module').then((m) => m.MainModule),
        canActivate: [MainGuard],
        runGuardsAndResolvers: 'always',
    },
    {
        path: emailPath,
        loadChildren: () => import('../email/email.module').then((m) => m.EmailModule),
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        pathMatch: 'full',
    },
]
