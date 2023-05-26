import { TestBed } from '@angular/core/testing';

import { ServicioGestionContenidoService } from './servicio-gestion-contenido.service';

describe('ServicioGestionContenidoService', () => {
  let service: ServicioGestionContenidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioGestionContenidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
