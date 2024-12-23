import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavProfleComponent } from '../nav-profle/nav-profle.component';
import { NgOptimizedImage } from '@angular/common';
import { ApiService } from '../api-service.service';
import { response } from 'express';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { error } from '@angular/compiler-cli/src/transformers/util';

interface respond {
  message?: string;
  logOut: boolean;
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NavProfleComponent, NgOptimizedImage],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  logOut() {
    this.apiService.logOut().subscribe({
      next: (response: respond) => {
        if (!response.logOut) {
        }

        this.authService.updateLoggedInState(false);
        return this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.error(error.message);
      },
    });
  }
}
