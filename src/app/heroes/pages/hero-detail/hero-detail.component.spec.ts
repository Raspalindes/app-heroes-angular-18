import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { HeroRoutes } from '../../enums/hero-routes.enum';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

import { HeroDetailComponent } from './hero-detail.component';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
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
      imports: [HeroDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goBack', () => {
    it('should navigate to list route', () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      // Capturar y completar la petición GET que genera el signal
      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(mockHero);

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith([HeroRoutes.LIST]);
    });
  });

  describe('hero loading', () => {
    it('should load hero data when id input is set', () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockHero);

      fixture.detectChanges();

      expect(component.$hero()).toEqual(mockHero);
    });

    it('should display hero information from signal', () => {
      fixture.componentRef.setInput('id', '2');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/2');
      req.flush({ ...mockHero, id: '2' });

      fixture.detectChanges();

      expect(component.$hero()?.superhero).toBe('Batman');
    });
  });

  describe('goBack navigation', () => {
    it('should have hero signal defined', () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      // Capturar y completar la petición que genera el signal
      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(mockHero);

      expect(component.$hero).toBeDefined();
    });
  });

  describe('hero signal properties', () => {
    it('should display hero with superhero name', () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(mockHero);

      fixture.detectChanges();

      expect(component.$hero()?.superhero).toBe('Batman');
    });

    it('should display hero with alter ego', () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(mockHero);

      fixture.detectChanges();

      expect(component.$hero()?.alter_ego).toBe('Bruce Wayne');
    });
  });

  describe('image display', () => {
    it('should display hero with image', () => {
      const heroWithImage: Hero = {
        ...mockHero,
        img: 'batman.jpg',
      };

      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(heroWithImage);

      fixture.detectChanges();

      expect(component.$hero()?.img).toBe('batman.jpg');
    });

    it('should display hero with alternate image', () => {
      const heroWithAltImage: Hero = {
        ...mockHero,
        alt_img: 'batman-alt.jpg',
      };

      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(heroWithAltImage);

      fixture.detectChanges();

      expect(component.$hero()?.alt_img).toBe('batman-alt.jpg');
    });
  });

  describe('error handling', () => {
    it('should handle different hero IDs correctly', () => {
      fixture.componentRef.setInput('id', '5');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/5');
      const hero: Hero = { ...mockHero, id: '5', superhero: 'Wonder Woman' };
      req.flush(hero);

      fixture.detectChanges();

      expect(component.$hero()?.id).toBe('5');
      expect(component.$hero()?.superhero).toBe('Wonder Woman');
    });

    it('should update hero when id signal changes', () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      let req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(mockHero);

      fixture.detectChanges();
      expect(component.$hero()?.id).toBe('1');

      // Cambiar el ID del input
      fixture.componentRef.setInput('id', '3');
      fixture.detectChanges();

      req = httpMock.expectOne('http://localhost:3000/heroes/3');
      const hero3: Hero = { ...mockHero, id: '3', superhero: 'Aquaman' };
      req.flush(hero3);

      fixture.detectChanges();
      expect(component.$hero()?.id).toBe('3');
      expect(component.$hero()?.superhero).toBe('Aquaman');
    });
  });

  describe('component integration', () => {
    it('should have all required properties and methods', () => {
      expect(component.id).toBeDefined();
      expect(component.$hero).toBeDefined();
      expect(component.goBack).toBeDefined();
    });

    it('should properly initialize with required input', () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(req).toBeDefined();
      req.flush(mockHero);

      expect(component.$hero()).toBeDefined();
    });

    it('should handle hero with all properties', () => {
      const completeHero: Hero = {
        id: '1',
        superhero: 'Batman',
        alter_ego: 'Bruce Wayne',
        publisher: 'DC Comics',
        first_appearance: '1939',
        img: 'batman.jpg',
        alt_img: 'batman-alt.jpg',
      };

      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(completeHero);

      fixture.detectChanges();

      const hero = component.$hero();
      expect(hero?.id).toBe('1');
      expect(hero?.superhero).toBe('Batman');
      expect(hero?.alter_ego).toBe('Bruce Wayne');
      expect(hero?.publisher).toBe('DC Comics');
      expect(hero?.first_appearance).toBe('1939');
      expect(hero?.img).toBe('batman.jpg');
      expect(hero?.alt_img).toBe('batman-alt.jpg');
    });

    it('should navigate back to list from detail view', () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(mockHero);

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith([HeroRoutes.LIST]);
    });
  });
});
