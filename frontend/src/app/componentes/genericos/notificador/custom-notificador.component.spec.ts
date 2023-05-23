import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNotificadorComponent } from './custom-notificador.component';

describe('CustomNotificadorComponent', () => {
  let component: CustomNotificadorComponent;
  let fixture: ComponentFixture<CustomNotificadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomNotificadorComponent]
    });
    fixture = TestBed.createComponent(CustomNotificadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
