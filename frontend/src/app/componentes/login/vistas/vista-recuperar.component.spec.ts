import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaRecuperarComponent } from './vista-recuperar.component';

describe('VistaRecuperarComponent', () => {
  let component: VistaRecuperarComponent;
  let fixture: ComponentFixture<VistaRecuperarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaRecuperarComponent]
    });
    fixture = TestBed.createComponent(VistaRecuperarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
