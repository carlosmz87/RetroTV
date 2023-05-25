import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaGestionClientesComponent } from './vista-gestion-clientes.component';

describe('VistaGestionClientesComponent', () => {
  let component: VistaGestionClientesComponent;
  let fixture: ComponentFixture<VistaGestionClientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaGestionClientesComponent]
    });
    fixture = TestBed.createComponent(VistaGestionClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
