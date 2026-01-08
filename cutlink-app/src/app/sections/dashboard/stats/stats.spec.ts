import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsDashBoardSection } from './stats';

describe('Stats', () => {
  let component: StatsDashBoardSection;
  let fixture: ComponentFixture<StatsDashBoardSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsDashBoardSection]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StatsDashBoardSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
