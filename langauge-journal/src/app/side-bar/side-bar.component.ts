import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NavProfleComponent} from "../nav-profle/nav-profle.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NavProfleComponent,
    NgOptimizedImage
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

}
