import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../api-service.service';
import { AuthService } from '../auth.service';

function createCompareValidator(
  controlOne: AbstractControl,
  controlTwo: AbstractControl,
) {
  return () => {
    const validationPassword = controlOne.value !== controlTwo.value;
    return validationPassword
      ? { passwordMismatch: { errorMessage: 'Passwords are not the same' } }
      : null;
  };
}

@Component({
  selector: 'app-sing-in-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
  ],
  templateUrl: './sing-in-up.component.html',
  styleUrl: './sing-in-up.component.scss',
})
export class SingInUpComponent implements AfterViewInit, OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  public messageFromServer: string = '';
  registrationForm: FormGroup;
  loggingForm: FormGroup;

  username = new FormControl(
    '',
    Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(15),
    ]),
  );
  email = new FormControl('', [Validators.email, Validators.required]);
  password = new FormControl('', [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/,
    ),
  ]);
  confirmPassword = new FormControl('', [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/,
    ),
  ]);

  logInEmail = new FormControl(
    '',
    Validators.compose([Validators.required, Validators.email]),
  );

  logInPassword = new FormControl('', Validators.required);

  @ViewChild('container') container!: ElementRef;

  signUpClick() {
    this.container.nativeElement.classList.add('right-panel-active');
  }

  signInClick() {
    this.container.nativeElement.classList.remove('right-panel-active');
  }

  get usernameControl(): AbstractControl {
    return this.registrationForm.get('username');
  }

  get emailControl(): AbstractControl {
    return this.registrationForm.get('email');
  }

  get passwordControl(): AbstractControl {
    return this.registrationForm.get('password');
  }

  get confirmPasswordControl(): AbstractControl {
    return this.registrationForm.get('confirmPassword');
  }

  get passwordForm(): FormGroup {
    return this.registrationForm;
  }

  get logInEmailControl() {
    return this.loggingForm.get('email');
  }

  get logInPasswordControl() {
    return this.loggingForm.get('userPassword');
  }

  onSubmit() {
    this.apiService
      .createNewUser(this.registrationForm.value)
      .subscribe((response) => {});
  }

  signInOnSubmit() {
    this.authService.login$.next(this.loggingForm.value);
  }

  ngAfterViewInit() {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
    this.registrationForm.setValidators(
      createCompareValidator(this.password, this.confirmPassword),
    );

    this.loggingForm = this.formBuilder.group({
      email: this.logInEmail,
      userPassword: this.logInPassword,
    });
  }
}
