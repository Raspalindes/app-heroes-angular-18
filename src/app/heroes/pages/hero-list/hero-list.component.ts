/**
 * Componente que muestra la lista de héroes.
 * Utiliza el servicio de héroes para obtener los datos y los gestiona con signals.
 * Renderiza la lista usando la nueva sintaxis de control de flujo de Angular.
 */
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { HeroRoutes } from '../../enums/hero-routes.enum';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [HeroImagePipe, RouterLink],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  /** Inyecta el servicio de héroes para obtener los datos desde la API. */
  private readonly _heroesService = inject(HeroesService);

  /** Inyecta el servicio de navegación de Angular para cambiar de ruta. */
  private readonly _router = inject(Router);

  /** Signal que almacena la lista de héroes obtenida del servicio. Convierte el Observable a Signal usando toSignal.*/
  public allHeroes = toSignal(this._heroesService.getHeroes());

  /** Edita un héroe (método a implementar). */
  public editHero(id: string): void {
    this._router.navigate([HeroRoutes.FORM, id]);
  }

  /** Elimina un héroe (método a implementar). */
  public deleteHero(id: string): void {
    // TODO: Implementar lógica de eliminación
  }

  /** Navega al formulario para crear un nuevo héroe. */
  public addHero(): void {
    this._router.navigate([HeroRoutes.FORM, 'new']);
  }
}
