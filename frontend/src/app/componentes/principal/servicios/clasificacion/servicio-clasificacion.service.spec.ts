import { TestBed } from '@angular/core/testing';

import { ServicioClasificacionService } from './servicio-clasificacion.service';

describe('ServicioClasificacionService', () => {
  let service: ServicioClasificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioClasificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
