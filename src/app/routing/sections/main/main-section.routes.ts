import { Routes } from '@angular/router'
import { mainSectionDialogsPath } from '../../routing.constants'
import { DialogsComponent } from './pages/dialogs/dialogs.component'

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: mainSectionDialogsPath.full,
    },
    {
        path: mainSectionDialogsPath.relative,
        component: DialogsComponent,
    },
    {
        path: mainSectionDialogsPath.relative + '/:id',
        component: DialogsComponent,
    },
]
