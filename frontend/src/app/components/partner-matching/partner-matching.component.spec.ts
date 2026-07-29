import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMatchingComponent } from './partner-matching.component';

describe('PartnerMatchingComponent', () => {
  let component: PartnerMatchingComponent;
  let fixture: ComponentFixture<PartnerMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerMatchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
