import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCircuitComponent } from './add-circuit.component';

describe('AddCircuitComponent', () => {
  let component: AddCircuitComponent;
  let fixture: ComponentFixture<AddCircuitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCircuitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCircuitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
