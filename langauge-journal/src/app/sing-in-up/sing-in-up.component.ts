import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators,
} from "@angular/forms";

import { CommonModule } from '@angular/common';
import {NgClass} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Router} from "@angular/router";


function createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
  return () => {
    const validationPassword = controlOne.value !== controlTwo.value;
    return validationPassword ? {'passwordMismatch': {errorMessage: "Passwords are not the same"}} : null;

  };

}


@Component({
  selector: 'app-sing-in-up',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive, FormsModule
  ],
  templateUrl: './sing-in-up.component.html',
  styleUrl: './sing-in-up.component.scss'
})
export class SingInUpComponent implements AfterViewInit, OnInit{

  constructor(private formBuilder: FormBuilder, private router: Router) {
  }

  registrationForm: FormGroup;

  username = new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15)]))
  email = new FormControl('', [Validators.email, Validators.required])
  password = new FormControl('', [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);
  confirmPassword = new FormControl('', [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);



  @ViewChild('container',) container! : ElementRef

  signUpClick() {
    this.container.nativeElement.classList.add("right-panel-active");
    console.log(this.container.nativeElement.classList)

  }

  signInClick() {
    this.container.nativeElement.classList.remove('right-panel-active')


  }

  get usernameControl(): AbstractControl {
    return this.registrationForm.get('username')

  }

  get emailControl(): AbstractControl {
    return this.registrationForm.get('email')
  }

  get passwordControl(): AbstractControl {
    return this.registrationForm.get('password')
  }

  get confirmPasswordControl(): AbstractControl {
    return this.registrationForm.get('confirmPassword')
  }

  get passwordForm(): FormGroup {
    return this.registrationForm
  }


  onSubmit() {
    console.log(this.registrationForm)
  }

  signInOnSubmit() {
    this.router.navigate(['/layout/my-feed']).then(() => {
      console.log('Navigation successful');
    }).catch(err => {
      console.error('Navigation error:', err);
    });


  }

  ngAfterViewInit() {
    console.log(this.container.nativeElement.classList)

  }

  ngOnInit() {

    this.registrationForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    });
    this.registrationForm.setValidators(createCompareValidator(this.password, this.confirmPassword))


  }



}




