import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavProfleComponent } from './nav-profle.component';

describe('NavProfleComponent', () => {
  let component: NavProfleComponent;
  let fixture: ComponentFixture<NavProfleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavProfleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavProfleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
