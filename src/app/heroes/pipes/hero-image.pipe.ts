import { Pipe, PipeTransform } from '@angular/core';

import { Hero } from '../interfaces/hero.interface';

/**
 * Pipe para determinar la fuente de imagen correcta para un héroe.
 */
@Pipe({
  name: 'heroImage',
  standalone: true,
})
export class HeroImagePipe implements PipeTransform {
  /**
   * Transforma un objeto Hero en la URL de su imagen.
   * Retorna una imagen por defecto 'no-image.svg' si no se proporciona imagen o alt_img.
   * @param hero El objeto Hero o null.
   * @returns La URL de la imagen del héroe.
   */
  transform(hero: Hero | null): string {
    if (!hero || (!hero.img && !hero.alt_img)) {
      return 'assets/no-image/no-image.svg';
    }
    return hero.alt_img || `assets/heroes/${hero.img}.jpg`;
  }
}
