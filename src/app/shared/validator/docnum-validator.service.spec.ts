import { TestBed } from '@angular/core/testing';

import { DocnumValidatorService } from './docnum-validator.service';

describe('DocnumValidatorService', () => {
  let service: DocnumValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocnumValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
