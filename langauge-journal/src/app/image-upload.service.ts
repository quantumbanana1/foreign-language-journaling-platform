import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  public setProfilePictureUrl = new BehaviorSubject<string>('null');
  notifyUrlPicturePhotoUrlChange = this.setProfilePictureUrl.asObservable();

  public setPostImageUrl = new BehaviorSubject<string>('null');
  notifyUrlPicturePostPhotoUrlChange = this.setPostImageUrl.asObservable();

  constructor() {}

  public setNewProfilePhotoUrl(url: string) {
    return this.setProfilePictureUrl.next(url);
  }

  public setNewPostImageUrl(url: string) {
    return this.setPostImageUrl.next(url);
  }
}
