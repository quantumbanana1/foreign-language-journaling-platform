import { TestBed } from '@angular/core/testing';

import { InputPostBindingService } from './input-post-binding.service';

describe('InputPostBindingService', () => {
  let service: InputPostBindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputPostBindingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
