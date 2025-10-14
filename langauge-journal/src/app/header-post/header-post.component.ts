import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LanguageIndicatorComponent } from '../language-indicator/language-indicator.component';
import { InterestsIndicatorComponent } from '../interests-indicator/interests-indicator.component';
import { InputPostBindingService } from '../input-post-binding.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ImageUploadService } from '../image-upload.service';
import { ApiService } from '../api-service.service';
import { FormArray, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-header-post',
  standalone: true,
  imports: [
    LanguageIndicatorComponent,
    InterestsIndicatorComponent,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './header-post.component.html',
  styleUrl: './header-post.component.scss',
})
export class HeaderPostComponent implements OnInit, OnDestroy {
  public title: string = '';
  @ViewChild('TitleElement') titleElement: ElementRef;
  @Input() isButtonActive!: boolean;
  @Input() selectedLanguage!: string;
  rowTitleState: boolean = false;
  public formattedData: string;
  private currentDate: Date = new Date();
  private currentDataWithoutTimeZone = this.currentDate.setMinutes(
    this.currentDate.getMinutes() + this.currentDate.getTimezoneOffset(),
  );
  public postImageUrl: string = encodeURI(
    '../../assets/images/img-new-post/img3.jpg',
  );
  private titleSubscription: Subscription;
  private newPhotoImageSubscription: Subscription;
  public username: string;
  private nameSubscription: Subscription;
  private form: FormGroup;

  constructor(
    private inputBindingsService: InputPostBindingService,
    private datePipe: DatePipe,
    private imageService: ImageUploadService,
    private apiService: ApiService,
    private rootFormGroup: FormGroupDirective,
  ) {
    this.formattedData = this.datePipe.transform(
      this.currentDataWithoutTimeZone,
      'MMMM d, yyyy',
    );
  }

  subscribeToTitle() {
    this.titleSubscription = this.inputBindingsService.inputData.subscribe(
      (data: string) => {
        this.title = data;
        if (this.title === '') {
          this.rowTitleState = false;
        }

        if (this.title !== '') {
          this.rowTitleState = true;
        }
      },
    );
  }

  subscribeToNewPostImage() {
    this.newPhotoImageSubscription =
      this.imageService.notifyUrlPicturePostPhotoUrlChange.subscribe((url) => {
        if (url !== 'null') {
          this.postImageUrl = url;
          this.setUrlImageInForm();
        }
      });
  }

  private setPostData() {
    this.form.patchValue({ data: this.currentDataWithoutTimeZone });
  }

  private setUrlImageInForm() {
    this.form.patchValue({ image: this.postImageUrl });
  }
  private getUsername() {
    this.nameSubscription = this.apiService
      .getUserInfo({ username: true })
      .subscribe((response) => {
        this.username = response.data.username;
      });
  }

  chooseImg(event: Event) {
    event.preventDefault();
    this.inputBindingsService.updatePopUpState(true);
  }

  private get formImage() {
    return this.form.controls['image'] as FormArray;
  }

  private get formData() {
    return this.form.controls['data'] as FormArray;
  }

  private setFormFromRootForm() {
    this.form = this.rootFormGroup.control.get('post_info') as FormGroup;
  }

  ngOnInit() {
    this.subscribeToTitle();
    this.subscribeToNewPostImage();
    this.getUsername();
    this.setFormFromRootForm();
    this.setPostData();
    this.setUrlImageInForm();
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
    if (this.newPhotoImageSubscription) {
      this.newPhotoImageSubscription.unsubscribe();
    }

    if (this.nameSubscription) {
      this.nameSubscription.unsubscribe();
    }
  }
}
