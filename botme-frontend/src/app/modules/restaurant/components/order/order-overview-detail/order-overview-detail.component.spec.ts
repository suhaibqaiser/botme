import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOverviewDetailComponent } from './order-overview-detail.component';

describe('OrderOverviewDetailComponent', () => {
  let component: OrderOverviewDetailComponent;
  let fixture: ComponentFixture<OrderOverviewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderOverviewDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderOverviewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
