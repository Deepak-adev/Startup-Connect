import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchDeckComponent } from './pitch-deck.component';

describe('PitchDeckComponent', () => {
  let component: PitchDeckComponent;
  let fixture: ComponentFixture<PitchDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchDeckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
