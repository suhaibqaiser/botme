import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbannerComponent } from './topbanner.component';

describe('TopbannerComponent', () => {
  let component: TopbannerComponent;
  let fixture: ComponentFixture<TopbannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopbannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
