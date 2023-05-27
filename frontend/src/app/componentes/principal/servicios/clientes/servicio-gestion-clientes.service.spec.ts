import { TestBed } from '@angular/core/testing';

import { ServicioGestionClientesService } from './servicio-gestion-clientes.service';

describe('ServicioGestionClientesService', () => {
  let service: ServicioGestionClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioGestionClientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
