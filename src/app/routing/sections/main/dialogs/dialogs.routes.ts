import { Routes } from '@angular/router'
import { DialogsComponent } from './components/dialogs/dialogs.component'
import { urlMathcer } from './url-matcher'

export const routes: Routes = [
    {
        matcher: urlMathcer,
        component: DialogsComponent,
    },
]
