import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-sing-in-up',
  standalone: true,
  imports: [],
  templateUrl: './sing-in-up.component.html',
  styleUrl: './sing-in-up.component.scss'
})
export class SingInUpComponent implements AfterViewInit{


  // @ViewChild('SignUp') signUp! : ElementRef
  // @ViewChild('SignIn') signIn! : ElementRef
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
}




