import {Component, ElementRef, ViewChild} from '@angular/core';

interface activeToggleButtons {
  published: boolean,
  private: boolean,
  draft: boolean,

}


interface IactiveButtonClass {
  published: string,
  private: string,
  draft: string,

}


function isActiveClass(element: any): element is activeToggleButtons {
  return typeof element.published === 'boolean' && typeof element.private === 'boolean' && typeof element.draft === 'boolean';
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
  @ViewChild('activeBttn') activeBttn: ElementRef;

  activeButtons: activeToggleButtons = {
    'published': true,
    'private': false,
    'draft': false,
  }


  activeButtonClass: IactiveButtonClass = {
    published: 'eff1',
    private: 'eff2',
    draft: 'eff3',
  }






  setClass(event: Event) {
    // Add a class active to the element that triggered the event
    const target = event.target as HTMLElement;
    if (target.classList.contains('active')) {
      return;
    }
    const classElement = target.classList[0];
    const bttnClassElement = this.activeButtonClass[classElement];
    this.checkButtonsState(target.classList)
    this.removeClass(this.activeButtons, this.ContainerButtons.nativeElement.children, 'active')
    this.removeClass('btn', this.activeBttn.nativeElement, bttnClassElement)
    this.addClass(this.activeButtons, this.activeBttn.nativeElement.children, 'active')
    this.addClass('btn', this.activeBttn.nativeElement, bttnClassElement)


  }


  checkButtonsState(classList: DOMTokenList) {

    const classElement = classList[0]
    Object.keys(this.activeButtons).forEach((key: string) => {
      this.activeButtons[key] = key === classElement;


    });





  }

  // removeActiveClass(activeButtons: activeToggleButtons) {
  //   const buttons: HTMLCollection = this.ContainerButtons.nativeElement.children;
  //   const activeElement = Object.keys(activeButtons).filter((key) => activeButtons[key] === true)[0];
  //   console.log(buttons)
  //
  //   for (let i = 0; buttons.length > i; i++) {
  //     const button = buttons[i]
  //     if (button.classList.contains('active') && !button.classList.contains(activeElement)) {
  //       button.classList.remove('active');
  //     }
  //
  //   }
  //
  // }


  removeClass<T extends HTMLCollection | HTMLElement>(activeButtons: activeToggleButtons| string, element: T, className: string) {
    let activeElement: string;
    if (isActiveClass(activeButtons)) {
      activeElement = Object.keys(activeButtons).filter((key) => activeButtons[key] === true)[0];
    }
    else {
      activeElement = activeButtons

    }

    if (element instanceof HTMLCollection) {

      for (let i = 0; element.length > i; i++) {
        const button = element[i]
        if (button.classList.contains(className) && !button.classList.contains(activeElement)) {
          button.classList.remove(className);
        }



      }

    }

    if (element instanceof HTMLElement) {
      console.log(element.classList.contains(className), element.classList.contains(activeElement))
      if (element.classList.contains(className) && !element.classList.contains(activeElement)) {
        element.classList.remove(className);
      }
    }


  }

  addClass<T extends HTMLCollection | HTMLElement>(activeButtons: activeToggleButtons | string, element: T, className: string) {
    let activeElement: string;
    if (isActiveClass(activeButtons)) {
      activeElement = Object.keys(activeButtons).filter((key) => activeButtons[key] === true)[0];
    }
    else {
      activeElement = activeButtons

    }


    if (element instanceof HTMLCollection) {

      for (let i = 0; element.length > i; i++) {
        const button = element[i]
        if (button.classList.contains(activeElement) && !(button.classList.contains(className))) {
          button.classList.add(className);
        }





      }

    }

    if (element instanceof HTMLElement) {
      console.log(element.classList.contains(className), element.classList.contains(activeElement))
      if (element.classList.contains(activeElement) && !element.classList.contains(className)) {
        element.classList.add(className);
      }
    }

  }
}
