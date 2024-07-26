import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBlockComponent } from './post-block.component';

describe('PostBlockComponent', () => {
  let component: PostBlockComponent;
  let fixture: ComponentFixture<PostBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
