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

  describe('initialization', () => {
    it('should load hero data when id input changes', () => {
      Object.defineProperty(component, 'id', {
        value: () => '1',
      });

      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockHero);

      expect(component.$hero()).toEqual(mockHero);
    });

    it('should display hero information from signal', () => {
      Object.defineProperty(component, 'id', {
        value: () => '2',
      });

      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/2');
      req.flush(mockHero);

      expect(component.$hero()).toEqual(mockHero);
      expect(component.$hero()?.superhero).toBe('Batman');
    });

    it('should handle undefined id input initially', () => {
      Object.defineProperty(component, 'id', {
        value: () => '',
      });

      fixture.detectChanges();

      httpMock.expectNone('http://localhost:3000/heroes/');
      expect(component.$hero()).toBeUndefined();
    });
  });

  describe('goBack', () => {
    it('should navigate to list route', () => {
      Object.defineProperty(component, 'id', {
        value: () => '1',
      });

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith([HeroRoutes.LIST]);
    });
  });

  describe('hero signal updates', () => {
    it('should update hero when id changes', () => {
      Object.defineProperty(component, 'id', {
        value: () => '1',
      });

      fixture.detectChanges();

      const req1 = httpMock.expectOne('http://localhost:3000/heroes/1');
      req1.flush(mockHero);

      expect(component.$hero()).toEqual(mockHero);

      // Change id
      Object.defineProperty(component, 'id', {
        value: () => '2',
      });

      fixture.detectChanges();

      const req2 = httpMock.expectOne('http://localhost:3000/heroes/2');
      req2.flush({ ...mockHero, id: '2', superhero: 'Superman' });

      expect(component.$hero()?.id).toBe('2');
    });

    it('should handle error response and show undefined', () => {
      Object.defineProperty(component, 'id', {
        value: () => '999',
      });

      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });

      expect(component.$hero()).toBeUndefined();
    });

    it('should not make request if id is empty', () => {
      Object.defineProperty(component, 'id', {
        value: () => '',
      });

      fixture.detectChanges();

      httpMock.expectNone('http://localhost:3000/heroes/');
    });
  });

  describe('image display', () => {
    it('should display hero with image', () => {
      const heroWithImage: Hero = {
        ...mockHero,
        img: 'batman.jpg',
      };

      Object.defineProperty(component, 'id', {
        value: () => '1',
      });

      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(heroWithImage);

      expect(component.$hero()?.img).toBe('batman.jpg');
    });

    it('should display hero with alternate image', () => {
      const heroWithAltImage: Hero = {
        ...mockHero,
        alt_img: 'batman-alt.jpg',
      };

      Object.defineProperty(component, 'id', {
        value: () => '1',
      });

      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush(heroWithAltImage);

      expect(component.$hero()?.alt_img).toBe('batman-alt.jpg');
    });
  });
});
