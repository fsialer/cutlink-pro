import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLink } from './form-link';

describe('FormLink', () => {
  let component: FormLink;
  let fixture: ComponentFixture<FormLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
