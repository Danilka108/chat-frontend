import { Routes } from '@angular/router'
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component'
import { authPath, emailPath, mainPath } from '../routes.constants'
import { AuthGuard } from './guards/auth.guard'
import { MainGuard } from './guards/main.guard'

export const routes: Routes = [
    {
        path: authPath.relative,
        loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
        canActivateChild: [AuthGuard],
        runGuardsAndResolvers: 'always',
    },
    {
        path: mainPath.relative,
        loadChildren: () => import('../main/main.module').then((m) => m.MainModule),
        canActivateChild: [MainGuard],
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
