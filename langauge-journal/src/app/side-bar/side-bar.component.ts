import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavProfleComponent } from '../nav-profle/nav-profle.component';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NavProfleComponent, NgOptimizedImage],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  logOut() {
    this.authService.logout$.next();
  }
}
