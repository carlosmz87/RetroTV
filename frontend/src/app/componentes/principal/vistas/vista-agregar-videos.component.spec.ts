import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAgregarVideosComponent } from './vista-agregar-videos.component';

describe('VistaAgregarVideosComponent', () => {
  let component: VistaAgregarVideosComponent;
  let fixture: ComponentFixture<VistaAgregarVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAgregarVideosComponent]
    });
    fixture = TestBed.createComponent(VistaAgregarVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
