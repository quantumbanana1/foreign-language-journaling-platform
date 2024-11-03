import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpBlockNewPostImgComponent } from './pop-up-block-new-post-img.component';

describe('PopUpBlockNewPostImgComponent', () => {
  let component: PopUpBlockNewPostImgComponent;
  let fixture: ComponentFixture<PopUpBlockNewPostImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpBlockNewPostImgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpBlockNewPostImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
