import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaCanalesComponent } from './vista-canales.component';

describe('VistaCanalesComponent', () => {
  let component: VistaCanalesComponent;
  let fixture: ComponentFixture<VistaCanalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaCanalesComponent]
    });
    fixture = TestBed.createComponent(VistaCanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
