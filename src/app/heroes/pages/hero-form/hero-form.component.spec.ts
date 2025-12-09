import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HeroRoutes } from '../../enums/hero-routes.enum';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

import { HeroFormComponent } from './hero-form.component';
import { NEW_ID } from './hero-form.constants';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockHero: Hero = {
    id: '1',
    superhero: 'Batman',
    alter_ego: 'Bruce Wayne',
    publisher: 'DC Comics',
    first_appearance: '1939',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroFormComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Configurar el signal input heroId
    Object.defineProperty(component, 'heroId', {
      value: () => NEW_ID,
    });

    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hasFieldError', () => {
    it('should return true if field is invalid and touched', () => {
      const field = component.heroForm.get('superhero');
      field?.markAsTouched();
      field?.setErrors({ required: true });

      expect(component.hasFieldError('superhero')).toBe(true);
    });

    it('should return false if field is valid', () => {
      const field = component.heroForm.get('superhero');
      field?.setValue('Batman');
      field?.markAsTouched();

      expect(component.hasFieldError('superhero')).toBe(false);
    });

    it('should return false if field is invalid but not touched', () => {
      const field = component.heroForm.get('superhero');
      field?.setErrors({ required: true });

      expect(component.hasFieldError('superhero')).toBe(false);
    });
  });

  describe('goBack', () => {
    it('should navigate to list route', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith([HeroRoutes.LIST]);
    });
  });

  describe('onSave', () => {
    it('should mark all fields as touched if form is invalid', () => {
      spyOn(component.heroForm, 'markAllAsTouched');
      component.heroForm.setErrors({ invalid: true });

      component.onSave();

      expect(component.heroForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should call _addHero when heroId is NEW_ID', () => {
      component.heroForm.patchValue({
        superhero: 'Batman',
        publisher: 'DC Comics',
        alter_ego: 'Bruce Wayne',
        first_appearance: '1939',
      });

      component.onSave();

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      expect(req.request.method).toBe('POST');
      req.flush({ ...mockHero });
    });

    it('should call _editHero when heroId is not NEW_ID', () => {
      // Reconfigurar el signal input heroId para edit
      Object.defineProperty(component, 'heroId', {
        value: () => '1',
      });

      fixture.detectChanges();

      // Manejar la request GET del effect que carga el héroe
      const getReq = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(getReq.request.method).toBe('GET');
      getReq.flush(mockHero);

      component.heroForm.patchValue({
        superhero: 'Superman',
        publisher: 'DC Comics',
        alter_ego: 'Clark Kent',
        first_appearance: '1938',
      });

      component.onSave();

      const putReq = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(putReq.request.method).toBe('PUT');
      putReq.flush({ ...mockHero });
    });

    it('should navigate to list after successful save', () => {
      component.heroForm.patchValue({
        superhero: 'Batman',
        publisher: 'DC Comics',
        alter_ego: 'Bruce Wayne',
        first_appearance: '1939',
      });

      component.onSave();

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      req.flush(mockHero);

      expect(router.navigate).toHaveBeenCalledWith([HeroRoutes.LIST]);
    });
  });

  describe('_loadHeroData', () => {
    it('should load hero data and populate form when heroId changes', () => {
      // Reconfigurar el signal input heroId
      Object.defineProperty(component, 'heroId', {
        value: () => '1',
      });

      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockHero);

      expect(component.heroForm.get('superhero')?.value).toBe(
        mockHero.superhero
      );
      expect(component.$hero()).toEqual(mockHero);
    });

    it('should not load data if heroId is NEW_ID', () => {
      fixture.detectChanges();

      httpMock.expectNone('http://localhost:3000/heroes/new');
      expect(component.$hero()).toBeNull();
    });

    it('should handle null hero response', () => {
      // Reconfigurar el signal input heroId
      Object.defineProperty(component, 'heroId', {
        value: () => '999',
      });

      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/999');
      req.flush(null);

      expect(component.$hero()).toBeNull();
    });
  });

  describe('form validation', () => {
    it('should mark form as invalid when required fields are empty', () => {
      expect(component.heroForm.valid).toBe(false);
    });

    it('should mark form as valid when all required fields are filled', () => {
      component.heroForm.patchValue({
        superhero: 'Batman',
        publisher: 'DC Comics',
        alter_ego: 'Bruce Wayne',
        first_appearance: '1939',
      });

      expect(component.heroForm.valid).toBe(true);
    });

    it('should validate superhero field min length', () => {
      const field = component.heroForm.get('superhero');
      field?.setValue('ab');

      expect(field?.hasError('minlength')).toBe(true);

      field?.setValue('abc');
      expect(field?.hasError('minlength')).toBe(false);
    });

    it('should allow optional img field to be empty', () => {
      component.heroForm.patchValue({
        superhero: 'Batman',
        publisher: 'DC Comics',
        alter_ego: 'Bruce Wayne',
        first_appearance: '1939',
        img: '',
      });

      expect(component.heroForm.valid).toBe(true);
    });
  });
});
