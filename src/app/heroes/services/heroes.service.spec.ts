import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Hero } from '../interfaces/hero.interface';

import { HeroesService } from './heroes.service';

fdescribe('HeroesService', () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  const mockHeroes: Hero[] = [
    {
      id: '1',
      superhero: 'Batman',
      alter_ego: 'Bruce Wayne',
      publisher: 'DC Comics',
      first_appearance: '1939',
    },
    {
      id: '2',
      superhero: 'Superman',
      alter_ego: 'Clark Kent',
      publisher: 'DC Comics',
      first_appearance: '1938',
    },
  ];

  const mockHero: Hero = mockHeroes[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HeroesService,
      ],
    });
    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHeroes', () => {
    it('should return an array of heroes', () => {
      service.getHeroes().subscribe(heroes => {
        expect(heroes.length).toBe(2);
        expect(heroes).toEqual(mockHeroes);
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      expect(req.request.method).toBe('GET');
      req.flush(mockHeroes);
    });

    it('should handle empty heroes list', () => {
      service.getHeroes().subscribe(heroes => {
        expect(heroes).toEqual([]);
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      req.flush([]);
    });

    it('should handle error response', () => {
      service.getHeroes().subscribe({
        next: () => {
          fail('should have failed with 500 error');
        },
        error: error => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getHeroById', () => {
    it('should return a single hero by id', () => {
      service.getHeroById('1').subscribe(hero => {
        expect(hero).toEqual(mockHero);
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockHero);
    });

    it('should return null for non-existent hero', () => {
      service.getHeroById('999').subscribe(hero => {
        expect(hero).toBeNull();
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes/999');
      req.flush(null);
    });

    it('should handle error response for getHeroById', () => {
      service.getHeroById('error-id').subscribe(
        () => {
          fail('should have failed with 404 error');
        },
        error => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne('http://localhost:3000/heroes/error-id');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('addHero', () => {
    it('should add a new hero', () => {
      const newHero: Omit<Hero, 'id'> = {
        superhero: 'Wonder Woman',
        alter_ego: 'Diana Prince',
        publisher: 'DC Comics',
        first_appearance: '1941',
      };

      const createdHero: Hero = { id: '3', ...newHero };

      service.addHero(newHero).subscribe(hero => {
        expect(hero).toEqual(createdHero);
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newHero);
      req.flush(createdHero);
    });

    it('should send correct payload to API', () => {
      const newHero: Omit<Hero, 'id'> = {
        superhero: 'Flash',
        alter_ego: 'Barry Allen',
        publisher: 'DC Comics',
        first_appearance: '1956',
      };

      service.addHero(newHero).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      expect(req.request.body).toEqual(newHero);
      req.flush({ id: '4', ...newHero });
    });

    it('should handle error response for addHero', () => {
      const newHero: Omit<Hero, 'id'> = {
        superhero: 'Invalid',
        alter_ego: 'Invalid',
        publisher: 'Invalid',
        first_appearance: 'Invalid',
      };

      service.addHero(newHero).subscribe({
        next: () => {
          fail('should have failed with 400 error');
        },
        error: error => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes');
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('editHero', () => {
    it('should update an existing hero', () => {
      const updatedHero: Hero = {
        ...mockHero,
        superhero: 'Batman Updated',
      };

      service.editHero(updatedHero).subscribe(hero => {
        expect(hero).toEqual(updatedHero);
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedHero);
      req.flush(updatedHero);
    });

    it('should send correct hero id in URL', () => {
      const updatedHero: Hero = { ...mockHero, superhero: 'Updated' };

      service.editHero(updatedHero).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(req.request.body).toEqual(updatedHero);
      req.flush(updatedHero);
    });

    it('should handle error response for editHero', () => {
      service.editHero(mockHero).subscribe({
        next: () => {
          fail('should have failed with 500 error');
        },
        error: error => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('deleteHeroById', () => {
    it('should delete a hero and return true', () => {
      service.deleteHeroById('1').subscribe(result => {
        expect(result).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should return false on deletion error', () => {
      service.deleteHeroById('error-id').subscribe(result => {
        expect(result).toBe(false);
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes/error-id');
      req.error(new ErrorEvent('Network error'));
    });

    it('should return false on 404 error', () => {
      service.deleteHeroById('999').subscribe(result => {
        expect(result).toBe(false);
      });

      const req = httpMock.expectOne('http://localhost:3000/heroes/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should send DELETE request to correct URL', () => {
      const heroId = '5';
      service.deleteHeroById(heroId).subscribe();

      const req = httpMock.expectOne(`http://localhost:3000/heroes/${heroId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
