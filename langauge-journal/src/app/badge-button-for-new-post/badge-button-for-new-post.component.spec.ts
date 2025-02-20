import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeButtonForNewPostComponent } from './badge-button-for-new-post.component';

describe('BadgeButtonForNewPostComponent', () => {
  let component: BadgeButtonForNewPostComponent;
  let fixture: ComponentFixture<BadgeButtonForNewPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeButtonForNewPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BadgeButtonForNewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
