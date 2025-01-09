import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-nav-profle',
  standalone: true,
  imports: [],
  templateUrl: './nav-profle.component.html',
  styleUrl: './nav-profle.component.scss',
})
export class NavProfleComponent implements OnInit {
  public username: string;
  public photo_url: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  goToProfile() {
    this.router.navigate(['profile']);
  }

  getUsername() {
    this.apiService.getUserInfo({ username: true }).subscribe((res) => {
      this.username = res.username;
    });
  }

  ngOnInit() {
    this.getUsername();
  }
}
