/**
 * Pipe standalone que filtra la lista de héroes según un término de búsqueda.
 * Busca coincidencias en el nombre del superhéroe, el alter ego y el publisher.
 */
import { Pipe, PipeTransform } from '@angular/core';

import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroFilter',
  standalone: true,
})
export class HeroFilterPipe implements PipeTransform {
  /**
   * Transforma la lista de héroes filtrando por el término de búsqueda.
   * @param heroes - Lista completa de héroes
   * @param searchTerm - Término de búsqueda para filtrar
   * @returns Lista de héroes filtrada
   */
  transform(heroes: Hero[], searchTerm: string): Hero[] {
    // Si no hay término de búsqueda, devuelve todos los héroes
    if (!searchTerm || searchTerm.trim() === '') {
      return heroes;
    }

    // Convierte el término de búsqueda a minúsculas para hacer la búsqueda case-insensitive
    const term = searchTerm.toLowerCase().trim();

    // Filtra los héroes que coincidan con el término en superhero, alter_ego o publisher
    return heroes.filter(
      hero =>
        hero.superhero.toLowerCase().includes(term) ||
        hero.alter_ego?.toLowerCase().includes(term) ||
        hero.publisher?.toLowerCase().includes(term)
    );
  }
}
