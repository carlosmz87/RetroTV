import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaReproductorCanalesComponent } from './vista-reproductor-canales.component';

describe('VistaReproductorCanalesComponent', () => {
  let component: VistaReproductorCanalesComponent;
  let fixture: ComponentFixture<VistaReproductorCanalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaReproductorCanalesComponent]
    });
    fixture = TestBed.createComponent(VistaReproductorCanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
