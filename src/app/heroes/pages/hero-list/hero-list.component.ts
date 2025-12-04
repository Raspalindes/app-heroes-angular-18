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
  public allHeroes = signal<Hero[]>([]);

  /** Signal para mostrar/ocultar el diálogo de confirmación. */
  public showConfirmDialog = signal<boolean>(false);

  /** ID del héroe pendiente de eliminar. */
  private _heroToDeleteId: string | null = null;

  /** Carga inicial de héroes. */
  public ngOnInit(): void {
    this._loadHeroes();
  }

  /** Carga la lista de héroes desde el servicio. */
  private _loadHeroes(): void {
    this._heroesService.getHeroes().subscribe(heroes => {
      this.allHeroes.set(heroes);
    });
  }

  /** Edita un héroe. */
  public editHero(id: string): void {
    this._router.navigate([HeroRoutes.FORM, id]);
  }

  /** Abre el diálogo de confirmación para eliminar un héroe. */
  public deleteHero(id: string): void {
    this._heroToDeleteId = id;
    this.showConfirmDialog.set(true);
  }

  /** Confirma la eliminación del héroe. */
  public confirmDelete(): void {
    if (this._heroToDeleteId) {
      this._heroesService.deleteHeroById(this._heroToDeleteId).subscribe(() => {
        this._loadHeroes();
        this._closeDialog();
      });
    }
  }

  /** Cancela la eliminación y cierra el diálogo. */
  public cancelDelete(): void {
    this._closeDialog();
  }

  /** Cierra el diálogo y limpia el estado. */
  private _closeDialog(): void {
    this.showConfirmDialog.set(false);
    this._heroToDeleteId = null;
  }

  /** Navega al formulario para crear un nuevo héroe. */
  public addHero(): void {
    this._router.navigate([HeroRoutes.FORM, 'new']);
  }
}
