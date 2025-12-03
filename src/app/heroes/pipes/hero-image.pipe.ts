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
   * Retorna una imagen por defecto 'no-image.png' si no se proporciona imagen o alt_img.
   * @param hero El objeto Hero.
   * @returns La URL de la imagen del héroe.
   */
  transform(hero: Hero): string {
    if (!hero.img && !hero.alt_img) {
      return 'assets/no-image.png';
    }
    return hero.alt_img || `assets/heroes/${hero.img}.jpg`;
  }
}
