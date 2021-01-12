import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './main-section.routes';
import { AuthModule } from 'src/app/auth/auth.module';
import { MainSectionHttpService } from './main-section-http.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AuthModule,
  ],
  providers: [
    MainSectionHttpService,
  ]
})
export class MainSectionModule { }
