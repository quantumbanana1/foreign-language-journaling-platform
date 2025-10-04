import { TestBed } from '@angular/core/testing';

import { DeleteCommentBindingService } from './delete-comment-binding.service';

describe('DeleteCommentBindingService', () => {
  let service: DeleteCommentBindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteCommentBindingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
