import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KerdesComponent } from './kerdes.component';

describe('KerdesComponent', () => {
  let component: KerdesComponent;
  let fixture: ComponentFixture<KerdesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KerdesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KerdesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
