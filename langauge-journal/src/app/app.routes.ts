import { Routes } from '@angular/router';
import {FeedComponent} from "./feed/feed.component";
import {SingInUpComponent} from "./sing-in-up/sing-in-up.component";
import {LayoutComponent} from "./layout/layout.component";

export const routes: Routes = [


  {path: ''   , component: SingInUpComponent },
  {path: 'layout', component: LayoutComponent, loadChildren: ()=> import('./layout/layoutRoutes').then(m => m.LAYOUT_ROUTS)},


];


