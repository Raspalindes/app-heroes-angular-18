/**
 * Servicio para gestionar operaciones relacionadas con héroes.
 * Proporciona métodos para obtener la lista completa de héroes desde la API.
 */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  /** Inyecta HttpClient para realizar peticiones HTTP a la API. */
  private readonly _http = inject(HttpClient);

  /**URL base de la API de héroes.*/
  private readonly _apiUrl: string = environment.apiUrl;

  /**
   * Obtiene la lista completa de héroes desde la API.
   * @returns Observable con el array de héroes
   */
  public getHeroes(): Observable<Hero[]> {
    return this._http.get<Hero[]>(this._apiUrl);
  }

  /**
   * Obtiene los datos de un héroe específico por su ID.
   * @param id - ID del héroe a buscar
   * @returns Observable con el héroe encontrado
   */
  public getHeroById(id: string): Observable<Hero> {
    return this._http.get<Hero>(`${this._apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo héroe en la API.
   * @param hero - Objeto héroe sin id (el backend lo genera)
   * @returns Observable con el héroe creado
   */
  public addHero(hero: Omit<Hero, 'id'>): Observable<Hero> {
    return this._http.post<Hero>(this._apiUrl, hero);
  }

  /**
   * Actualiza un héroe existente en la API.
   * @param updatedHero - Objeto héroe con id
   * @returns Observable con el héroe actualizado
   */
  public editHero(updatedHero: Hero): Observable<Hero> {
    return this._http.put<Hero>(
      `${this._apiUrl}/${updatedHero.id}`,
      updatedHero
    );
  }
}
