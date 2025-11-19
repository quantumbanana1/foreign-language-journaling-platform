import { Component } from '@angular/core';
import {
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SingInUpComponent } from './sing-in-up/sing-in-up.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SingInUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'langauge-journal';

  constructor(private router: Router) {
    // this.router.events.subscribe((e) => {
    //   if (e instanceof NavigationStart)
    //     console.log('[Router] navigating to:', e.url);
    //   console.trace(e);
    //
    //   if (e instanceof NavigationError)
    //     console.error('[Router] error at:', e.url, e.error);
    // });
  }
}
