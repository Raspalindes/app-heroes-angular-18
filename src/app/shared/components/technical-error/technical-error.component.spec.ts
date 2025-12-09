import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { TechnicalErrorComponent } from './technical-error.component';

describe('TechnicalErrorComponent', () => {
  let component: TechnicalErrorComponent;
  let fixture: ComponentFixture<TechnicalErrorComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicalErrorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goHome', () => {
    it('should navigate to root path', () => {
      component.goHome();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
