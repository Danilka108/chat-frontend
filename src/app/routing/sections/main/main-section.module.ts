import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './main-section.routes';
import { AuthModule } from 'src/app/auth/auth.module';
import { MainSectionHttpService } from './main-section-http.service';
import { DialogsItemComponent } from './components/dialogs-item/dialogs-item.component';
import { DialogsComponent } from './pages/dialogs/dialogs.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogsGroupComponent } from './components/dialogs-group/dialogs-group.component';
import { SectionComponent } from './components/section/section.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { DialogsDetailComponent } from './components/dialogs-detail/dialogs-detail.component';

@NgModule({
  declarations: [
    DialogsItemComponent,
    DialogsGroupComponent,
    DialogsDetailComponent,
    DialogsComponent,
    SectionComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild(routes),
    AuthModule,
    SimplebarAngularModule,
  ],
  providers: [
    MainSectionHttpService,
  ]
})
export class MainSectionModule { }
