import {Routes} from "@angular/router";
import {FeedComponent} from "../feed/feed.component";
import {ProfileComponent} from "../profile/profile.component";


export const LAYOUT_ROUTS: Routes = [{
  path: '',
  pathMatch: 'prefix',
  children: [


    {path: 'my-feed', component: FeedComponent},
    {path: 'profile', component: ProfileComponent},
  ]
}
]



