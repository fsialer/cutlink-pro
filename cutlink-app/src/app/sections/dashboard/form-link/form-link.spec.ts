import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLinkDashboardSection } from './form-link';

describe('FormLink', () => {
  let component: FormLinkDashboardSection;
  let fixture: ComponentFixture<FormLinkDashboardSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLinkDashboardSection]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormLinkDashboardSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
