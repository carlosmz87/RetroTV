import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAboutComponent } from './vista-about.component';

describe('VistaAboutComponent', () => {
  let component: VistaAboutComponent;
  let fixture: ComponentFixture<VistaAboutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAboutComponent]
    });
    fixture = TestBed.createComponent(VistaAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
