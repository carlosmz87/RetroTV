import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAgregarCanalesComponent } from './vista-agregar-canales.component';

describe('VistaAgregarCanalesComponent', () => {
  let component: VistaAgregarCanalesComponent;
  let fixture: ComponentFixture<VistaAgregarCanalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAgregarCanalesComponent]
    });
    fixture = TestBed.createComponent(VistaAgregarCanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
