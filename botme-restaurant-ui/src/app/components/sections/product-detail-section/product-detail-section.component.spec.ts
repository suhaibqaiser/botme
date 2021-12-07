import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailSectionComponent } from './product-detail-section.component';

describe('ProductDetailSectionComponent', () => {
  let component: ProductDetailSectionComponent;
  let fixture: ComponentFixture<ProductDetailSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
