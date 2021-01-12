import { Routes } from "@angular/router";
import { mainSectionPath } from "../../routing.constants";
import { MainComponent } from "./pages/main/main.component";

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
    }
]