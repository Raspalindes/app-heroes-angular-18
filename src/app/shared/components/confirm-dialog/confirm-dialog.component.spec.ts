import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    // Provide required input before change detection
    Object.defineProperty(component, 'hero', {
      value: () => ({
        id: 'test-id',
        superhero: 'Test Hero',
        publisher: 'Test Publisher',
        alter_ego: 'Test Alter Ego',
        first_appearance: 'Test Appearance',
        img: '',
        alt_img: '',
      }),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmed when onConfirm is called', () => {
    const spy = spyOn(component.confirmed, 'emit');
    component.onConfirm();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancelled when onCancel is called', () => {
    const spy = spyOn(component.cancelled, 'emit');
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });
});
