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

import { HeroListComponent } from './hero-list.component';

const mockHeroes: Hero[] = [
  {
    id: '1',
    superhero: 'Batman',
    alter_ego: 'Bruce Wayne',
    publisher: 'DC Comics',
  },
  {
    id: '2',
    superhero: 'Superman',
    alter_ego: 'Clark Kent',
    publisher: 'DC Comics',
  },
];

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
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

  describe('ngOnInit', () => {
    it('should load heroes on component initialization', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      expect(req.request.method).toBe('GET');

      req.flush(mockHeroes);

      expect(component.$allHeroes()).toEqual(mockHeroes);
    });

    it('should handle empty heroes list', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      req.flush([]);

      expect(component.$allHeroes()).toEqual([]);
    });
  });

  describe('editHero', () => {
    it('should navigate to form with hero id', () => {
      const heroId = '1';
      component.editHero(heroId);

      expect(router.navigate).toHaveBeenCalledWith([HeroRoutes.FORM, heroId]);
    });

    it('should navigate to form with different hero ids', () => {
      component.editHero('5');
      expect(router.navigate).toHaveBeenCalledWith([HeroRoutes.FORM, '5']);

      component.editHero('999');
      expect(router.navigate).toHaveBeenCalledWith([HeroRoutes.FORM, '999']);
    });
  });

  describe('addHero', () => {
    it('should navigate to form with new route', () => {
      component.addHero();

      expect(router.navigate).toHaveBeenCalledWith([HeroRoutes.FORM, 'new']);
    });
  });

  describe('onDeleteHero', () => {
    it('should set the hero to delete', () => {
      const hero: Hero = mockHeroes[0];
      component.onDeleteHero(hero);

      expect(component.$heroToDelete()).toEqual(hero);
    });

    it('should overwrite previous hero to delete', () => {
      component.onDeleteHero(mockHeroes[0]);
      expect(component.$heroToDelete()).toEqual(mockHeroes[0]);

      component.onDeleteHero(mockHeroes[1]);
      expect(component.$heroToDelete()).toEqual(mockHeroes[1]);
    });
  });

  describe('confirmDelete', () => {
    it('should delete hero and reload heroes on success', () => {
      spyOn(console, 'error');
      fixture.detectChanges();

      const deleteReq = httpMock.expectOne('http://localhost:3000/heroes');
      deleteReq.flush(mockHeroes);

      const heroToDelete = mockHeroes[0];
      component.onDeleteHero(heroToDelete);
      component.confirmDelete();

      const deleteHeroReq = httpMock.expectOne(
        `http://localhost:3000/heroes/${heroToDelete.id}`
      );
      expect(deleteHeroReq.request.method).toBe('DELETE');
      deleteHeroReq.flush({});

      const reloadReq = httpMock.expectOne('http://localhost:3000/heroes');
      reloadReq.flush(mockHeroes);

      expect(component.$heroToDelete()).toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should show error and reset if no hero id provided', () => {
      spyOn(console, 'error');
      component.$heroToDelete.set(null);
      component.confirmDelete();

      expect(component.$heroToDelete()).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'No se proporcionó un ID de héroe válido para eliminar.'
      );
    });

    it('should show error when hero has no id', () => {
      spyOn(console, 'error');
      const heroWithoutId = { ...mockHeroes[0], id: '' };
      component.onDeleteHero(heroWithoutId);
      component.confirmDelete();

      expect(console.error).toHaveBeenCalledWith(
        'No se proporcionó un ID de héroe válido para eliminar.'
      );
      expect(component.$heroToDelete()).toBeNull();
    });
  });

  describe('onSearchChange', () => {
    it('should update search term after debounce delay', done => {
      const searchTerm = 'Batman';
      component.onSearchChange(searchTerm);

      expect(component.$searchTerm()).toBe('');

      setTimeout(() => {
        expect(component.$searchTerm()).toBe(searchTerm);
        done();
      }, 600);
    });

    it('should cancel previous timeout on new search', done => {
      component.onSearchChange('first');
      setTimeout(() => {
        component.onSearchChange('second');
      }, 200);

      setTimeout(() => {
        expect(component.$searchTerm()).toBe('second');
        done();
      }, 800);
    });

    it('should handle empty search term', done => {
      component.onSearchChange('');

      setTimeout(() => {
        expect(component.$searchTerm()).toBe('');
        done();
      }, 600);
    });

    it('should debounce rapid consecutive searches', done => {
      component.onSearchChange('S');
      setTimeout(() => {
        component.onSearchChange('Su');
      }, 100);

      setTimeout(() => {
        component.onSearchChange('Sup');
      }, 200);

      setTimeout(() => {
        expect(component.$searchTerm()).toBe('Sup');
        done();
      }, 800);
    });
  });
});
