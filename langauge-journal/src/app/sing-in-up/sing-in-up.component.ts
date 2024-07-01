import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup, NgForm, ReactiveFormsModule, Validators,
  NgModel
} from "@angular/forms";



function createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
  return () => {
    if (controlOne.value !== controlTwo.value)
      return { match_error: 'Value does not match' };
    return null;
  };

}


@Component({
  selector: 'app-sing-in-up',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './sing-in-up.component.html',
  styleUrl: './sing-in-up.component.scss'
})
export class SingInUpComponent implements AfterViewInit, OnInit{

  constructor(private formBuilder: FormBuilder) {
  }

  registrationForm: FormGroup;

  username = new FormControl('', [Validators.required, Validators.min(5), Validators.max(15)])
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


  onSubmit() {
    console.log(this.registrationForm)
  }
}




