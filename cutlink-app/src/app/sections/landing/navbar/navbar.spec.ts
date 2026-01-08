import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarSection } from './navbar';

describe('NavBarSection', () => {
  let component: NavBarSection;
  let fixture: ComponentFixture<NavBarSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarSection]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavBarSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
