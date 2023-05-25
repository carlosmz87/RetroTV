import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaReportesComponent } from './vista-reportes.component';

describe('VistaReportesComponent', () => {
  let component: VistaReportesComponent;
  let fixture: ComponentFixture<VistaReportesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaReportesComponent]
    });
    fixture = TestBed.createComponent(VistaReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
