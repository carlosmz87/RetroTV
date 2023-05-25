import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaGestionContenidoComponent } from './vista-gestion-contenido.component';

describe('VistaGestionContenidoComponent', () => {
  let component: VistaGestionContenidoComponent;
  let fixture: ComponentFixture<VistaGestionContenidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaGestionContenidoComponent]
    });
    fixture = TestBed.createComponent(VistaGestionContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
