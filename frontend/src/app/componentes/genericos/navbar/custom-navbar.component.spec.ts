import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNavbarComponent } from './custom-navbar.component';

describe('CustomNavbarComponent', () => {
  let component: CustomNavbarComponent;
  let fixture: ComponentFixture<CustomNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomNavbarComponent]
    });
    fixture = TestBed.createComponent(CustomNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
