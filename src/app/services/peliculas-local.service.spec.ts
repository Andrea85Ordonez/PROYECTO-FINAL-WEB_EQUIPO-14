import { TestBed } from '@angular/core/testing';

import { peliculaslocalService } from './peliculas-local.service';

describe('PeliculasLocalService', () => {
  let service: peliculaslocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(peliculaslocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
