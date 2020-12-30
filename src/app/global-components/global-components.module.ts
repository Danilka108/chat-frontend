import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoadingComponent } from './components/loading/loading.component'
import { MaterialModule } from '../material/material.module'
import { WrapperComponent } from './components/wrapper/wrapper.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HeaderComponent } from './components/header/header.component'
import { ErrorComponent } from './components/error/error.component'

@NgModule({
    declarations: [LoadingComponent, WrapperComponent, HeaderComponent, ErrorComponent],
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
    exports: [LoadingComponent, WrapperComponent, HeaderComponent, ErrorComponent],
})
export class GlobalComponentsModule {}
