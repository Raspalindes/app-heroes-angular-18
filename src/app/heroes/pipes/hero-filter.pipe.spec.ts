import { Hero } from '../interfaces/hero.interface';

import { HeroFilterPipe } from './hero-filter.pipe';

describe('HeroFilterPipe', () => {
  let pipe: HeroFilterPipe;

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
    {
      id: '3',
      superhero: 'Spider-Man',
      alter_ego: 'Peter Parker',
      publisher: 'Marvel Comics',
      first_appearance: '1962',
    },
    {
      id: '4',
      superhero: 'Wonder Woman',
      alter_ego: 'Diana Prince',
      publisher: 'DC Comics',
      first_appearance: '1941',
    },
  ];

  beforeEach(() => {
    pipe = new HeroFilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return all heroes when searchTerm is empty string', () => {
      const result = pipe.transform(mockHeroes, '');
      expect(result).toEqual(mockHeroes);
      expect(result.length).toBe(4);
    });

    it('should return all heroes when searchTerm is null', () => {
      const resultNull = pipe.transform(mockHeroes, null as any);
      expect(resultNull).toEqual(mockHeroes);
    });

    it('should return all heroes when searchTerm is undefined', () => {
      const resultUndefined = pipe.transform(mockHeroes, undefined as any);
      expect(resultUndefined).toEqual(mockHeroes);
    });

    it('should return all heroes when searchTerm is only whitespace', () => {
      const result = pipe.transform(mockHeroes, '   ');
      expect(result).toEqual(mockHeroes);
      expect(result.length).toBe(4);
    });

    it('should filter heroes by superhero name (case-insensitive)', () => {
      const result = pipe.transform(mockHeroes, 'batman');
      expect(result.length).toBe(1);
      expect(result[0].superhero).toBe('Batman');
    });

    it('should filter heroes by superhero name with uppercase', () => {
      const result = pipe.transform(mockHeroes, 'SUPERMAN');
      expect(result.length).toBe(1);
      expect(result[0].superhero).toBe('Superman');
    });

    it('should filter heroes by alter ego', () => {
      const result = pipe.transform(mockHeroes, 'Peter Parker');
      expect(result.length).toBe(1);
      expect(result[0].alter_ego).toBe('Peter Parker');
    });

    it('should filter heroes by alter ego (case-insensitive)', () => {
      const result = pipe.transform(mockHeroes, 'clark kent');
      expect(result.length).toBe(1);
      expect(result[0].superhero).toBe('Superman');
    });

    it('should filter heroes by publisher', () => {
      const result = pipe.transform(mockHeroes, 'Marvel');
      expect(result.length).toBe(1);
      expect(result[0].publisher).toBe('Marvel Comics');
    });

    it('should filter heroes by publisher (case-insensitive)', () => {
      const result = pipe.transform(mockHeroes, 'dc');
      expect(result.length).toBe(3);
      expect(result.every(hero => hero.publisher === 'DC Comics')).toBe(true);
    });

    it('should return multiple heroes matching the search term', () => {
      const result = pipe.transform(mockHeroes, 'man');
      expect(result.length).toBe(4);
      expect(result.some(hero => hero.superhero === 'Batman')).toBe(true);
      expect(result.some(hero => hero.superhero === 'Superman')).toBe(true);
      expect(result.some(hero => hero.superhero === 'Spider-Man')).toBe(true);
      expect(result.some(hero => hero.superhero === 'Wonder Woman')).toBe(true);
    });

    it('should handle partial matches in superhero name', () => {
      const result = pipe.transform(mockHeroes, 'bat');
      expect(result.length).toBe(1);
      expect(result[0].superhero).toBe('Batman');
    });

    it('should handle partial matches in alter ego', () => {
      const result = pipe.transform(mockHeroes, 'wayne');
      expect(result.length).toBe(1);
      expect(result[0].alter_ego).toBe('Bruce Wayne');
    });

    it('should handle partial matches in publisher', () => {
      const result = pipe.transform(mockHeroes, 'comics');
      expect(result.length).toBe(4);
    });

    it('should return empty array when no matches found', () => {
      const result = pipe.transform(mockHeroes, 'Aquaman');
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });

    it('should return empty array when searching with non-existent term', () => {
      const result = pipe.transform(mockHeroes, 'xyz123');
      expect(result.length).toBe(0);
    });

    it('should preserve hero data when filtering', () => {
      const result = pipe.transform(mockHeroes, 'batman');
      expect(result[0].id).toBe('1');
      expect(result[0].first_appearance).toBe('1939');
    });

    it('should be case-insensitive for all fields', () => {
      const result1 = pipe.transform(mockHeroes, 'BATMAN');
      const result2 = pipe.transform(mockHeroes, 'batman');
      const result3 = pipe.transform(mockHeroes, 'BaTmAn');

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    it('should trim whitespace from search term', () => {
      const result1 = pipe.transform(mockHeroes, '  batman  ');
      const result2 = pipe.transform(mockHeroes, 'batman');

      expect(result1).toEqual(result2);
      expect(result1.length).toBe(1);
    });

    it('should filter multiple heroes with similar names', () => {
      const result = pipe.transform(mockHeroes, 'woman');
      expect(result.length).toBe(1);
      expect(result[0].superhero).toBe('Wonder Woman');
    });

    it('should work with empty heroes array', () => {
      const result = pipe.transform([], 'batman');
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should not modify original array', () => {
      const originalLength = mockHeroes.length;
      pipe.transform(mockHeroes, 'batman');
      expect(mockHeroes.length).toBe(originalLength);
    });

    it('should match heroes by any field combination', () => {
      const result = pipe.transform(mockHeroes, 'clark');
      expect(result.length).toBe(1);
      expect(result[0].superhero).toBe('Superman');
      expect(result[0].alter_ego).toBe('Clark Kent');
    });
  });
});
