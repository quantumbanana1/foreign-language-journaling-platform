import {Component, ElementRef, ViewChild} from '@angular/core';

interface activeToggleButtons {
  published: boolean,
  private: boolean,
  draft: boolean,

}



@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})



export class MyPostsComponent {

  @ViewChild('ContainerButtons') ContainerButtons: ElementRef;

  activeButtons: activeToggleButtons = {
    'published': true,
    'private': false,
    'draft': false,
  }

  setClass(event: Event) {
    // Add a class active to the element that triggered the event
    const target = event.target as HTMLElement;
    if (target.classList.contains('active')) {
      return;
    }
    this.checkActiveButtons(target.classList)
    this.removeActiveClass(this.activeButtons)
    target.classList.add('active');


  }


  checkActiveButtons(classList:DOMTokenList) {

    const classElement = classList[0]
    Object.keys(this.activeButtons).forEach((key:string) => {
      this.activeButtons[key] = key === classElement;

    });


  }

  removeActiveClass(activeButtons: activeToggleButtons) {
    const buttons: HTMLCollection = this.ContainerButtons.nativeElement.children;
    const activeElement = Object.keys(activeButtons).filter((key) => activeButtons[key] === true)[0];

    for (let i=0; buttons.length >i; i++ ) {
      const button = buttons[i]
      if (button.classList.contains('active') && !button.classList.contains(activeElement)) {
        button.classList.remove('active');
      }

    }

  }


}
