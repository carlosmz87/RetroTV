import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPromocionesComponent } from './vista-promociones.component';

describe('VistaPromocionesComponent', () => {
  let component: VistaPromocionesComponent;
  let fixture: ComponentFixture<VistaPromocionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaPromocionesComponent]
    });
    fixture = TestBed.createComponent(VistaPromocionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
