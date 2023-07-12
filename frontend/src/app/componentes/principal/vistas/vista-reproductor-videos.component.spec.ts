import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaReproductorVideosComponent } from './vista-reproductor-videos.component';

describe('VistaReproductorVideosComponent', () => {
  let component: VistaReproductorVideosComponent;
  let fixture: ComponentFixture<VistaReproductorVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaReproductorVideosComponent]
    });
    fixture = TestBed.createComponent(VistaReproductorVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
