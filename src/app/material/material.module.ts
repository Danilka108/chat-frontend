import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatRippleModule } from '@angular/material/core'

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatRippleModule,
    ],
    exports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatRippleModule,
    ],
})
export class MaterialModule {}
