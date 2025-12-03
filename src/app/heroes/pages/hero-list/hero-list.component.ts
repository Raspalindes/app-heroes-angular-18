/**
 * Componente que muestra la lista de héroes.
 * Utiliza el servicio de héroes para obtener los datos y los gestiona con signals.
 * Renderiza la lista usando la nueva sintaxis de control de flujo de Angular.
 */
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  /**Inyecta el servicio de héroes para obtener los datos desde la API.*/
  private readonly _heroesService = inject(HeroesService);

  /**Signal que almacena la lista de héroes obtenida del servicio. Convierte el Observable a Signal usando toSignal.*/
  public allHeroes = toSignal(this._heroesService.getHeroes());

  /**Obtiene la ruta completa de la imagen del héroe.*/
  public getHeroImage(imageName: string | undefined): string {
    return imageName ? `assets/heroes/${imageName}.jpg` : 'assets/no-image.png';
  }

  /**Edita un héroe (método a implementar).*/
  public editHero(id: string): void {
    // TODO: Implementar lógica de edición
  }

  /**Elimina un héroe (método a implementar).*/
  public deleteHero(id: string): void {
    // TODO: Implementar lógica de eliminación
  }
}
