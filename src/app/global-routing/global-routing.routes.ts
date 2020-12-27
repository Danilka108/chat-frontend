import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { authPath, mainPath } from '../routes.constants';
import { AuthGuard } from './guards/auth.guard';
import { MainGuard } from './guards/main.guard';

export const routes: Routes = [
    {
        path: authPath,
        loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
        canActivateChild: [AuthGuard],
        runGuardsAndResolvers: 'always',
    },
    {
        path: '',
        loadChildren: () => import('../main/main.module').then((m) => m.MainModule),
        canActivateChild: [MainGuard],
        runGuardsAndResolvers: 'always'
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        pathMatch: 'full' 
    },
]