

/**
 * Componente que muestra el detalle de un héroe.
 * Utiliza el servicio de héroes para obtener los datos y los gestiona con signals.
 * Renderiza la información del héroe seleccionado y permite volver a la lista.
 */
import { TitleCasePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss',
})
export class HeroDetailComponent implements OnInit {
  /**
   * Inyecta el servicio de héroes para obtener los datos desde la API.
   */
  private readonly _heroService = inject(HeroesService);

  /**
   * Inyecta el servicio de navegación de Angular para cambiar de ruta.
   */
  private readonly _router = inject(Router);

  /**
   * ID del héroe recibido por parámetro de ruta.
   */
  public id = input.required<string>();

  /**
   * Signal que almacena el héroe actual obtenido del servicio.
   */
  public $hero = signal<Hero | null>(null);

  /**
   * Hook de inicialización del componente. Carga los detalles del héroe.
   */
  ngOnInit(): void {
    this._loadHeroDetail();
  }

  /**
   * Navega de vuelta a la lista de héroes.
   */
  public goBack(): void {
    this._router.navigate(['/heroes/list']);
  }

  /**
   * Carga los detalles del héroe usando el servicio y actualiza el signal.
   */
  private _loadHeroDetail(): void {
    const heroId = this.id();

    this._heroService.getHeroById(heroId).subscribe({
      next: (hero: Hero) => {
        this.$hero.set(hero);
      }
    });
  }
}