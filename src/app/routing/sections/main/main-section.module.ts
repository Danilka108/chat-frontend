import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { routes } from './main-section.routes'
import { AuthModule } from 'src/app/auth/auth.module'
import { MainHttpService } from './services/main-http.service'
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
import { MessageService } from './services/message.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DialogsScrollComponent } from './components/dialogs-scroll/dialogs-scroll.component'
import { DialogsScrollBottomComponent } from './components/dialogs-scroll-bottom/dialogs-scroll-bottom.component'
import { ScrollService } from './services/scroll.service'
import { WsModule } from 'src/app/ws/ws.module'
import { DialogsDetailNotSelectedComponent } from './components/dialogs-detail-not-selected/dialogs-detail-not-selected.component'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { DialogsInfoComponent } from './components/dialogs-info/dialogs-info.component'
import { DialogsAvatarComponent } from './components/dialogs-avatar/dialogs-avatar.component'
import { DialogsSidebarComponent } from './components/dialogs-sidebar/dialogs-sidebar.component'
import { DialogsSearchInputComponent } from './components/dialogs-search-input.component.ts/dialogs-search-input.component'
import { DialogsSearchComponent } from './components/dialogs-search/dialogs-search.component'
import { DialogsSearchItemComponent } from './components/dialogs-search-item/dialogs-search-item.component'
import { SearchService } from './services/search.service'

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
        DialogsDetailNotSelectedComponent,
        DialogsInfoComponent,
        DialogsAvatarComponent,
        DialogsSidebarComponent,
        DialogsSearchInputComponent,
        DialogsSearchComponent,
        DialogsSearchItemComponent,
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
    ],
    providers: [MainHttpService, MessageService, ScrollService, SearchService],
})
export class MainSectionModule {}
