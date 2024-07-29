import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostButtonsBlockComponent } from './post-buttons-block.component';

describe('PostButtonsBlockComponent', () => {
  let component: PostButtonsBlockComponent;
  let fixture: ComponentFixture<PostButtonsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostButtonsBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostButtonsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
