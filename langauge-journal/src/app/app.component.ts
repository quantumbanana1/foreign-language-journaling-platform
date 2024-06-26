import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SingInUpComponent} from "./sing-in-up/sing-in-up.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SingInUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'langauge-journal';
}
