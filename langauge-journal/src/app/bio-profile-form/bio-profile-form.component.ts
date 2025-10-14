import { Component, OnInit } from '@angular/core';
import { SelectLanguagesInpuntComponent } from '../select-languages-inpunt/select-languages-inpunt.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api-service.service';
import { ToastrService } from 'ngx-toastr';
import { toastrService } from '../toastr.service';

@Component({
  selector: 'app-bio-profile-form',
  standalone: true,
  imports: [SelectLanguagesInpuntComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './bio-profile-form.component.html',
  styleUrl: './bio-profile-form.component.scss',
})
export class BioProfileFormComponent implements OnInit {
  public bioForm: FormGroup;
  private toastr: toastrService;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastrs: ToastrService,
  ) {
    this.bioForm = this.fb.group({
      description: ['', [Validators.maxLength(400)]],
    });
    this.toastr = new toastrService(this.toastrs);
  }

  public getBio() {
    return this.apiService.getUserInfo({ description: true }).subscribe({
      next: (value) => {
        this.bioForm.patchValue({
          description: value.data.description || '',
        });
      },
    });
  }

  ngOnInit() {
    this.getBio();
  }

  onSubmit() {
    this.apiService.updateUserInfo(this.bioForm.value).subscribe({
      next: (value) => {
        this.toastr.showToastrMessage(
          'success',
          'Bio updated successfully ☺️',
          'Info',
        );
      },
      error: (value) => {
        this.toastr.showToastrMessage(
          'error',
          'Error occurred when updating bio 😔',
        );
      },
    });
  }
}
