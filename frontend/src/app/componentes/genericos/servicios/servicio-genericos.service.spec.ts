import { TestBed } from '@angular/core/testing';

import { ServicioGenericosService } from './servicio-genericos.service';

describe('ServicioGenericosService', () => {
  let service: ServicioGenericosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioGenericosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
