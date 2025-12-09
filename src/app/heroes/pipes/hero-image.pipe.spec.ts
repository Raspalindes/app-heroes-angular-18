import { Hero } from '../interfaces/hero.interface';

import { HeroImagePipe } from './hero-image.pipe';

describe('HeroImagePipe', () => {
  let pipe: HeroImagePipe;

  const mockHero: Hero = {
    id: '1',
    superhero: 'Batman',
    alter_ego: 'Bruce Wayne',
    publisher: 'DC Comics',
    first_appearance: '1939',
  };

  beforeEach(() => {
    pipe = new HeroImagePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return no-image path when hero is null', () => {
      const result = pipe.transform(null);
      expect(result).toBe('assets/no-image/no-image.svg');
    });

    it('should return no-image path when hero has no img or alt_img', () => {
      const hero: Hero = {
        id: '1',
        superhero: 'Batman',
        alter_ego: 'Bruce Wayne',
        publisher: 'DC Comics',
        first_appearance: '1939',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/no-image/no-image.svg');
    });

    it('should return alt_img path when alt_img is provided', () => {
      const hero: Hero = {
        ...mockHero,
        alt_img: 'batman-alt.jpg',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('batman-alt.jpg');
    });

    it('should prefer alt_img over img when both are provided', () => {
      const hero: Hero = {
        ...mockHero,
        img: 'batman.jpg',
        alt_img: 'batman-alt.jpg',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('batman-alt.jpg');
    });

    it('should return assets path with img when only img is provided', () => {
      const hero: Hero = {
        ...mockHero,
        img: 'batman.jpg',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/heroes/batman.jpg.jpg');
    });

    it('should construct correct path with img property', () => {
      const hero: Hero = {
        ...mockHero,
        img: 'superman',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/heroes/superman.jpg');
    });

    it('should return no-image when hero object is undefined', () => {
      const result = pipe.transform(undefined as any);
      expect(result).toBe('assets/no-image/no-image.svg');
    });

    it('should handle hero with empty img string', () => {
      const hero: Hero = {
        ...mockHero,
        img: '',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/no-image/no-image.svg');
    });

    it('should handle hero with empty alt_img string', () => {
      const hero: Hero = {
        ...mockHero,
        alt_img: '',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/no-image/no-image.svg');
    });

    it('should prioritize alt_img over img even if img is set', () => {
      const hero: Hero = {
        ...mockHero,
        img: 'batman',
        alt_img: 'batman-alternative',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('batman-alternative');
      expect(result).not.toContain('assets/heroes');
      expect(result).toContain('batman');
    });

    it('should return correct path for hero with complex img name', () => {
      const hero: Hero = {
        ...mockHero,
        img: 'spider-man-web-slinger',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/heroes/spider-man-web-slinger.jpg');
    });

    it('should work with different hero data', () => {
      const hero1: Hero = {
        id: '1',
        superhero: 'Batman',
        alter_ego: 'Bruce Wayne',
        publisher: 'DC Comics',
        first_appearance: '1939',
        img: 'batman',
      };

      const hero2: Hero = {
        id: '2',
        superhero: 'Superman',
        alter_ego: 'Clark Kent',
        publisher: 'DC Comics',
        first_appearance: '1938',
        img: 'superman',
      };

      expect(pipe.transform(hero1)).toBe('assets/heroes/batman.jpg');
      expect(pipe.transform(hero2)).toBe('assets/heroes/superman.jpg');
    });

    it('should return no-image when both img and alt_img are empty strings', () => {
      const hero: Hero = {
        ...mockHero,
        img: '',
        alt_img: '',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/no-image/no-image.svg');
    });

    it('should handle alt_img with full path', () => {
      const hero: Hero = {
        ...mockHero,
        alt_img: 'assets/custom/batman.png',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/custom/batman.png');
    });

    it('should handle img with special characters', () => {
      const hero: Hero = {
        ...mockHero,
        img: 'iron-man-3-armor',
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/heroes/iron-man-3-armor.jpg');
    });

    it('should not modify the input hero object', () => {
      const hero: Hero = {
        ...mockHero,
        img: 'batman',
      };

      const originalHero = { ...hero };
      pipe.transform(hero);

      expect(hero).toEqual(originalHero);
    });

    it('should return different paths for heroes with different images', () => {
      const hero1: Hero = {
        ...mockHero,
        img: 'batman',
      };

      const hero2: Hero = {
        ...mockHero,
        alt_img: 'batman-dark',
      };

      const result1 = pipe.transform(hero1);
      const result2 = pipe.transform(hero2);

      expect(result1).not.toBe(result2);
      expect(result1).toBe('assets/heroes/batman.jpg');
      expect(result2).toBe('batman-dark');
    });

    it('should handle null and undefined img/alt_img gracefully', () => {
      const hero: Hero = {
        ...mockHero,
        img: undefined as any,
        alt_img: undefined as any,
      };

      const result = pipe.transform(hero);
      expect(result).toBe('assets/no-image/no-image.svg');
    });
  });
});
