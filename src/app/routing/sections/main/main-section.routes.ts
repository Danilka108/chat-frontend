import { Routes } from '@angular/router'
import { mainSectionDialogsPath } from '../../routing.constants'

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: mainSectionDialogsPath.full,
    },
    {
        path: mainSectionDialogsPath.relative,
        loadChildren: () => import('./dialogs/dialogs.module').then((m) => m.DialogsModule),
    },
]
