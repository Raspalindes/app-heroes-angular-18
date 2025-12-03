/**
 * Componente que muestra el detalle de un héroe.
 * Utiliza el servicio de héroes para obtener los datos y los gestiona con signals.
 * Renderiza la información del héroe seleccionado y permite volver a la lista.
 */
import { TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';

import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss',
})
export class HeroDetailComponent {
  /**Inyecta el servicio de héroes para obtener los datos desde la API.*/
  private readonly _heroService = inject(HeroesService);

  /**Inyecta el servicio de navegación de Angular para cambiar de ruta.*/
  private readonly _router = inject(Router);

  /**ID del héroe recibido por parámetro de ruta.*/
  public id = input.required<string>();

  /**Signal que almacena el héroe actual obtenido del servicio.*/
  public $hero = toSignal<Hero>(
    toObservable(this.id).pipe(
      filter(Boolean),
      switchMap(id => this._heroService.getHeroById(id))
    )
  );

  /**Navega de vuelta a la lista de héroes.*/
  public goBack(): void {
    this._router.navigate(['/heroes/list']);
  }

  /**Obtiene la ruta completa de la imagen del héroe.*/
  public getHeroImage(imageName: string | undefined): string {
    return imageName ? `assets/heroes/${imageName}.jpg` : 'assets/no-image.png';
  }
}
