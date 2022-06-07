import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailComponent } from './device-detail.component';

describe('UserDetailComponent', () => {
  let component: DeviceDetailComponent;
  let fixture: ComponentFixture<DeviceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});