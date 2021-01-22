import { Routes } from '@angular/router'
import { PageNotFoundComponent } from '../global-components/components/page-not-found/page-not-found.component'
import { RedirectComponent } from './components/redirect/redirect.component'
import { AuthSectionGuard } from './guards/auth-section.guard'
import { MainSectionGuard } from './guards/main-section.guard'
import { RedirectGuard } from './guards/redirect.guard'
import { authSectionPath, emailSectionPath, mainSectionPath } from './routing.constants'

export const routes: Routes = [
    {
        path: '',
        canActivate: [RedirectGuard],
        component: RedirectComponent,
        runGuardsAndResolvers: 'always',
    },
    {
        path: authSectionPath.relative,
        loadChildren: () => import('./sections/auth/auth-section.module').then((m) => m.AuthSectionModule),
        canActivate: [AuthSectionGuard],
        runGuardsAndResolvers: 'always',
    },
    {
        path: mainSectionPath.relative,
        loadChildren: () => import('./sections/main/main-section.module').then((m) => m.MainSectionModule),
        canActivate: [MainSectionGuard],
        runGuardsAndResolvers: 'always',
    },
    {
        path: emailSectionPath.relative,
        loadChildren: () => import('./sections/email/email-section.module').then((m) => m.EmailSectionModule),
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        pathMatch: 'full',
    },
]
