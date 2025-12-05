/**
 * Componente que muestra la lista de héroes.
 * Utiliza el servicio de héroes para obtener los datos y los gestiona con signals.
 * Renderiza la lista usando la nueva sintaxis de control de flujo de Angular.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HeroRoutes } from '../../enums/hero-routes.enum';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [HeroImagePipe, RouterLink, ConfirmDialogComponent],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent implements OnInit {
  /** Inyecta el servicio de héroes para obtener los datos desde la API. */
  private readonly _heroesService = inject(HeroesService);

  /** Inyecta el servicio de navegación de Angular para cambiar de ruta. */
  private readonly _router = inject(Router);

  /** Signal que almacena la lista de héroes. */
  public $allHeroes = signal<Hero[]>([]);

  /** Héroe seleccionado para eliminar. */
  public $heroToDelete = signal<Hero | null>(null);

  /** Carga inicial de héroes. */
  public ngOnInit(): void {
    this._loadHeroes();
  }

  /** Edita un héroe. */
  public editHero(id: string): void {
    this._router.navigate([HeroRoutes.FORM, id]);
  }

  /** Abre el diálogo con el héroe seleccionado */
  public onDeleteHero(hero: Hero): void {
    this.$heroToDelete.set(hero);
  }

  /** Recibe el id desde el output y lo borra */
  public confirmDelete(): void {
    const id = this.$heroToDelete()?.id;
    if (!id) {
      this.$heroToDelete.set(null);
      console.error('No se proporcionó un ID de héroe válido para eliminar.');
      return;
    }

    this._heroesService.deleteHeroById(id).subscribe({
      next: () => {
        this._loadHeroes();
        this.$heroToDelete.set(null);
      },
    });
  }

  /** Cancela la eliminación y cierra el diálogo. */
  public cancelDelete(): void {
    this.$heroToDelete.set(null);
  }

  /** Navega al formulario para crear un nuevo héroe. */
  public addHero(): void {
    this._router.navigate([HeroRoutes.FORM, 'new']);
  }

  /** Carga la lista de héroes desde el servicio. */
  private _loadHeroes(): void {
    this._heroesService.getHeroes().subscribe({
      next: heroes => {
        this.$allHeroes.set(heroes);
      },
    });
  }
}
