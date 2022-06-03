import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSignupSectionComponent } from './customer-signup-section.component';

describe('CustomerSignupSectionComponent', () => {
  let component: CustomerSignupSectionComponent;
  let fixture: ComponentFixture<CustomerSignupSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSignupSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSignupSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
