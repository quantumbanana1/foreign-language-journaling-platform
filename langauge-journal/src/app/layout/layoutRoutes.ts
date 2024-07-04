import {Routes} from "@angular/router";
import {FeedComponent} from "../feed/feed.component";


export const LAYOUT_ROUTS: Routes = [{
  path: '',
  pathMatch: 'prefix',
  children: [


    {path: 'my-feed', component: FeedComponent},
  ]
}
]



