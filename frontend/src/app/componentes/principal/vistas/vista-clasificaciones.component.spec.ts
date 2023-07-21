import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaClasificacionesComponent } from './vista-clasificaciones.component';

describe('VistaClasificacionesComponent', () => {
  let component: VistaClasificacionesComponent;
  let fixture: ComponentFixture<VistaClasificacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaClasificacionesComponent]
    });
    fixture = TestBed.createComponent(VistaClasificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
