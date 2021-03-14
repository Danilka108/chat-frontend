import { Routes } from '@angular/router'
import { mainSectionDialogsPath } from '../../routing.constants'
import { DialogsDetailNotSelectedComponent } from './components/dialogs-detail-not-selected/dialogs-detail-not-selected.component'
import { DialogsDetailComponent } from './components/dialogs-detail/dialogs-detail.component'
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
        children: [
            {
                path: '',
                component: DialogsDetailNotSelectedComponent,
            },
            {
                path: ':id',
                component: DialogsDetailComponent,
            },
        ],
    },
]
