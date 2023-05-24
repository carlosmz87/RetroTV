import { TestBed } from '@angular/core/testing';

import { ServicioAuthService } from './servicio-auth.service';

describe('ServicioAuthService', () => {
  let service: ServicioAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
