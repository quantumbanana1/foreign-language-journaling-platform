import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPostComponent } from './header-post.component';

describe('HeaderPostComponent', () => {
  let component: HeaderPostComponent;
  let fixture: ComponentFixture<HeaderPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
