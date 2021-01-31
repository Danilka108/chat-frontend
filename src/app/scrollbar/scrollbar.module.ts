import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ScrollbarComponent } from './components/scrollbar/scrollbar.component'
import { ScrollbarTrackComponent } from './components/scrollbar-track/scrollbar-track.component'
import {
    ScrollbarHorizontalTrackDirective,
    ScrollbarVerticalTrackDirective,
} from './directives/scrollbar-track.directive'
import {
    ScrollbarHorizontalThumbDirective,
    ScrollbarVerticalThumbDirective,
} from './directives/scrollbar-thumb.directive'
import { ScrollbarViewComponent } from './components/scrollbar-view/scrollbar-view.component'
import { ScrollbarViewDirective, ScrollbarViewWrapperDirective } from './directives/scrollbar-view.directive'

@NgModule({
    declarations: [
        ScrollbarComponent,
        ScrollbarTrackComponent,
        ScrollbarViewComponent,
        ScrollbarVerticalTrackDirective,
        ScrollbarVerticalThumbDirective,
        ScrollbarHorizontalTrackDirective,
        ScrollbarHorizontalThumbDirective,
        ScrollbarViewDirective,
        ScrollbarViewWrapperDirective,
    ],
    imports: [CommonModule],
    exports: [ScrollbarComponent],
})
export class ScrollbarModule {}
