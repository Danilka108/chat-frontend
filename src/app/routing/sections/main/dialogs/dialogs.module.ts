import { ScrollingModule } from '@angular/cdk/scrolling'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { AuthModule } from 'src/app/auth/auth.module'
import { GlobalComponentsModule } from 'src/app/global-components/global-components.module'
import { MaterialModule } from 'src/app/material/material.module'
import { SessionModule } from 'src/app/session/session.module'
import { StorageModule } from 'src/app/storage/storage.module'
import { WsModule } from 'src/app/ws/ws.module'
import { DialogsAvatarComponent } from './components/dialogs-avatar/dialogs-avatar.component'
import { DialogsDetailComponent } from './components/dialogs-detail/dialogs-detail.component'
import { DialogsGroupComponent } from './components/dialogs-group/dialogs-group.component'
import { DialogsInfoComponent } from './components/dialogs-info/dialogs-info.component'
import { DialogsInputComponent } from './components/dialogs-input/dialogs-input.component'
import { DialogsItemComponent } from './components/dialogs-item/dialogs-item.component'
import { DialogsMenuComponent } from './components/dialogs-menu/dialogs-menu.component'
import { DialogsMessageComponent } from './components/dialogs-message/dialogs-message.component'
import { DialogsMessagesSectionBySenderComponent } from './components/dialogs-messages-section-by-sender/dialogs-messages-section-by-sender.component'
import { DialogsMessagesSectionComponent } from './components/dialogs-messages-section/dialogs-messages-section.component'
import { DialogsScrollBottomComponent } from './components/dialogs-scroll-bottom/dialogs-scroll-bottom.component'
import { DialogsScrollComponent } from './components/dialogs-scroll/dialogs-scroll.component'
import { DialogsSearchInputComponent } from './components/dialogs-search-input.component/dialogs-search-input.component'
import { DialogsSearchItemComponent } from './components/dialogs-search-item/dialogs-search-item.component'
import { DialogsSearchComponent } from './components/dialogs-search/dialogs-search.component'
import { DialogsSeparatorComponent } from './components/dialogs-separator/dialogs-separator.component'
import { DialogsSidebarComponent } from './components/dialogs-sidebar/dialogs-sidebar.component'
import { DialogsToggleSidebarComponent } from './components/dialogs-toggle-sidebar/dialogs-toggle-sidebar.component'
import { DialogsComponent } from './components/dialogs/dialogs.component'
import { NoConnectionComponent } from './components/no-connection/no-connection.component'
import { routes } from './dialogs.routes'
import { HttpService } from './services/http.service'
import { MessageService } from './services/message.service'
import { ScrollService } from './services/scroll.service'
import { SearchService } from './services/search.service'
import { SidebarService } from './services/sidebar.service'

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
        DialogsScrollComponent,
        DialogsScrollBottomComponent,
        DialogsInfoComponent,
        DialogsAvatarComponent,
        DialogsSidebarComponent,
        DialogsSearchInputComponent,
        DialogsSearchComponent,
        DialogsSearchItemComponent,
        DialogsMenuComponent,
        DialogsMessagesSectionBySenderComponent,
        DialogsMessagesSectionComponent,
        DialogsToggleSidebarComponent,
    ],
    imports: [
        MaterialModule,
        CommonModule,
        RouterModule.forChild(routes),
        AuthModule,
        GlobalComponentsModule,
        ReactiveFormsModule,
        FormsModule,
        WsModule,
        ScrollingModule,
        SessionModule,
        StorageModule,
    ],
    providers: [HttpService, MessageService, ScrollService, SearchService, SidebarService],
})
export class DialogsModule {}
