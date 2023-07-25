import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaEditarVideoComponent } from './vista-editar-video.component';

describe('VistaEditarVideoComponent', () => {
  let component: VistaEditarVideoComponent;
  let fixture: ComponentFixture<VistaEditarVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaEditarVideoComponent]
    });
    fixture = TestBed.createComponent(VistaEditarVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
