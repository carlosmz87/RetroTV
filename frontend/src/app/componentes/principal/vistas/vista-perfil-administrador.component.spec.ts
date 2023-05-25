import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPerfilAdministradorComponent } from './vista-perfil-administrador.component';

describe('VistaPerfilAdministradorComponent', () => {
  let component: VistaPerfilAdministradorComponent;
  let fixture: ComponentFixture<VistaPerfilAdministradorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaPerfilAdministradorComponent]
    });
    fixture = TestBed.createComponent(VistaPerfilAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
