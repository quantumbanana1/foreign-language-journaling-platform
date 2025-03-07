import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputPostBindingService } from '../input-post-binding.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { failedUploadImageResponse } from '../types/Response/uploadImageResponse';
import { ApiService } from '../api-service.service';
import { ImageUploadService } from '../image-upload.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UnsplashService } from '../unsplash.service';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

interface IImageObject {
  imageUrl: string;
  id: string;
}

@Component({
  selector: 'app-pop-up-block-new-post-img',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './pop-up-block-new-post-img.component.html',
  styleUrl: './pop-up-block-new-post-img.component.scss',
})
export class PopUpBlockNewPostImgComponent implements OnInit, OnDestroy {
  public popUpImgState: boolean = false;
  isLoading: boolean = false;
  unsplashPopUpState: boolean = false;
  public imageObj: IImageObject[] = [];

  searchControl = new FormControl();
  private destroy$ = new Subject<void>();

  constructor(
    private inputBindingsService: InputPostBindingService,
    private apiService: ApiService,
    private imageService: ImageUploadService,
    private unsplashService: UnsplashService,
  ) {}

  subscribeToPopUpState() {
    this.inputBindingsService.popUpStateSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.popUpImgState = true;
      });
  }

  closePopUp() {
    this.resetPopUpState();
  }

  onFileSelected(event: Event) {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    this.apiService
      .uploadPostImage(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toggleLoading(true);
          if (response.success) {
            this.imageService.setNewPostImageUrl(response.url);
            this.toggleLoading(false);
            this.resetPopUpState();
          }
        },
        error: (error: failedUploadImageResponse) => {
          this.toggleLoading(false);
        },
      });
  }

  private subscribeToValueChange() {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((value) => this.loadImagesFromUnsplash(value)),
      )
      .subscribe((value) => {
        if (value) {
          this.imageObj = value.response.results.map((image) => ({
            imageUrl: image.urls.full,
            id: image.id,
          }));
        } else {
          this.imageObj = [];
        }
      });
  }
  private loadImagesFromUnsplash(query: string) {
    if (query !== '') {
      return this.unsplashService
        .loadImageCollection(query)
        .pipe(takeUntil(this.destroy$));
    }
    return of(null);
  }

  private toggleLoading(state: boolean) {
    this.unsplashPopUpState = state;
  }

  updateUnsplashPopUpState(boolean: boolean) {
    this.unsplashPopUpState = boolean;
  }

  private resetPopUpState() {
    this.popUpImgState = false;
    this.unsplashPopUpState = false;
  }

  selectImage(image: IImageObject) {
    this.imageService.setNewPostImageUrl(image.imageUrl);
    this.resetPopUpState();
  }

  ngOnInit() {
    this.subscribeToPopUpState();
    this.subscribeToValueChange();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
