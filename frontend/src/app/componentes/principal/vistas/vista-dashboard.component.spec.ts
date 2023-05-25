import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaDashboardComponent } from './vista-dashboard.component';

describe('VistaDashboardComponent', () => {
  let component: VistaDashboardComponent;
  let fixture: ComponentFixture<VistaDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaDashboardComponent]
    });
    fixture = TestBed.createComponent(VistaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
