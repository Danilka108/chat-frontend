import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { routes } from './main-section.routes'
import { AuthModule } from 'src/app/auth/auth.module'
import { MainSectionHttpService } from './services/main-section-http.service'
import { DialogsItemComponent } from './components/dialogs-item/dialogs-item.component'
import { DialogsComponent } from './pages/dialogs/dialogs.component'
import { MaterialModule } from 'src/app/material/material.module'
import { DialogsGroupComponent } from './components/dialogs-group/dialogs-group.component'
import { DialogsDetailComponent } from './components/dialogs-detail/dialogs-detail.component'
import { NoConnectionComponent } from './components/no-connection/no-connection.component'
import { DialogsMessageComponent } from './components/dialogs-message/dialogs-message.component'
import { GlobalComponentsModule } from 'src/app/global-components/global-components.module'
import { DialogsInputComponent } from './components/dialogs-input/dialogs-input.component'
import { DialogsSeparatorComponent } from './components/dialogs-separator/dialogs-separator.component'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { MessageService } from './services/message.service'
import { MessageInputDirective } from './directives/message-input.directive'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
    declarations: [
        DialogsItemComponent,
        DialogsGroupComponent,
        DialogsDetailComponent,
        DialogsComponent,
        NoConnectionComponent,
        DialogsMessageComponent,
        DialogsInputComponent,
        DialogsSeparatorComponent,
        MessageInputDirective,
    ],
    imports: [
        MaterialModule,
        CommonModule,
        RouterModule.forChild(routes),
        AuthModule,
        GlobalComponentsModule,
        NgScrollbarModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    providers: [MainSectionHttpService, MessageService],
})
export class MainSectionModule {}
