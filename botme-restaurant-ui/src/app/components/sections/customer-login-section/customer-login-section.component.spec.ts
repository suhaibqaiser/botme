import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLoginSectionComponent } from './customer-login-section.component';

describe('CustomerLoginSectionComponent', () => {
  let component: CustomerLoginSectionComponent;
  let fixture: ComponentFixture<CustomerLoginSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLoginSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLoginSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
