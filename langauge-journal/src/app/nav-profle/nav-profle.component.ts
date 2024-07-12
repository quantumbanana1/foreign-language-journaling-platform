import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-profle',
  standalone: true,
  imports: [],
  templateUrl: './nav-profle.component.html',
  styleUrl: './nav-profle.component.scss'
})
export class NavProfleComponent {


  constructor(private router: Router) {

  }

  goToProfile() {

    this.router.navigate(['layout/profile'])



  }
}
