import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NyilvanosKerdoivekComponent } from './nyilvanos-kerdoivek.component';

describe('NyilvanosKerdoivekComponent', () => {
  let component: NyilvanosKerdoivekComponent;
  let fixture: ComponentFixture<NyilvanosKerdoivekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NyilvanosKerdoivekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NyilvanosKerdoivekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
