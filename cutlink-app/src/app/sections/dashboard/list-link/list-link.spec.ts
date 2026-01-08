import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLinkDashboardSection } from './list-link';

describe('ListLinkDashboardSection', () => {
  let component: ListLinkDashboardSection;
  let fixture: ComponentFixture<ListLinkDashboardSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLinkDashboardSection]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListLinkDashboardSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
