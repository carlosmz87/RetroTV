import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaFavoritosComponent } from './vista-favoritos.component';

describe('VistaFavoritosComponent', () => {
  let component: VistaFavoritosComponent;
  let fixture: ComponentFixture<VistaFavoritosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaFavoritosComponent]
    });
    fixture = TestBed.createComponent(VistaFavoritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
