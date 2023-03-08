import { TestBed } from '@angular/core/testing';

import { GenealogyService } from './genealogy.service';

describe('GenealogyService', () => {
  let service: GenealogyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenealogyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
