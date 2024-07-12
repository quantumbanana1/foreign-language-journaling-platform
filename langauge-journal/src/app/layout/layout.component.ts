import { Component } from '@angular/core';
import {Route, RouterLink, RouterOutlet} from "@angular/router";
import {SideBarComponent} from "../side-bar/side-bar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    SideBarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})


export class LayoutComponent {



}
