import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionBlockPostComponent } from './selection-block-post.component';

describe('SelectionBlockPostComponent', () => {
  let component: SelectionBlockPostComponent;
  let fixture: ComponentFixture<SelectionBlockPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionBlockPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionBlockPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
