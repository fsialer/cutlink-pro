import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLinkComponent } from './item-link';

describe('ItemLinkComponent', () => {
  let component: ItemLinkComponent;
  let fixture: ComponentFixture<ItemLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemLinkComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ItemLinkComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
