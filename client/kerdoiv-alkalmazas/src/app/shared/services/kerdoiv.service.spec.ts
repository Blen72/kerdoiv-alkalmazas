import { TestBed } from '@angular/core/testing';

import { KerdoivService } from './kerdoiv.service';

describe('KerdoivService', () => {
  let service: KerdoivService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KerdoivService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
