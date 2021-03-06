import { NgModule } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatRippleModule } from '@angular/material/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatBadgeModule } from '@angular/material/badge'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatMenuModule } from '@angular/material/menu'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

@NgModule({
    declarations: [],
    exports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatRippleModule,
        MatBadgeModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatSlideToggleModule,
    ],
})
export class MaterialModule {}
