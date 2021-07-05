import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGridSectionComponent } from './search-grid-section.component';

describe('SearchGridSectionComponent', () => {
  let component: SearchGridSectionComponent;
  let fixture: ComponentFixture<SearchGridSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchGridSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGridSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
