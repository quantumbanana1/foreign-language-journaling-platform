import {Component, OnInit} from '@angular/core';
import {InputPostBindingService} from "../input-post-binding.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-pop-up-block-new-post-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up-block-new-post-img.component.html',
  styleUrl: './pop-up-block-new-post-img.component.scss'
})
export class PopUpBlockNewPostImgComponent implements OnInit {

  public popUpImgState: boolean = false;


  constructor(private inputBindingsService: InputPostBindingService) {
  }

  ngOnInit() {
    this.subscribeToPopUpState()
  }


  subscribeToPopUpState() {
    this.inputBindingsService.popUpStateSubject.subscribe((data) => {
      this.popUpImgState = true;

    })

  }

  closePopUp() {
    this.popUpImgState = false;

  }
}
