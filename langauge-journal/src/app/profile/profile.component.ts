import { Component, OnInit } from '@angular/core';
import { IUserProfile } from '../types/User/userTypes';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  public user: IUserProfile;
  constructor(private api: ApiService) {}

  ngOnInit() {}
}
