import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';

import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';
import { HeroesService } from '../../services/heroes.service';

import { FORM_CONTROLS_CONFIG } from './hero-form.config';
import { NEW_ID } from './hero-form.constants';

/**
 * Formulario reutilizable para crear y editar héroes.
 * Si recibe un id distinto de 'new', carga los datos para editar.
 * Si recibe 'new', prepara el formulario para crear.
 */
@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [ReactiveFormsModule, HeroImagePipe],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent {
  /** ID del héroe recibido desde la ruta. 'new' para crear, ID para editar. */
  public heroId = input.required<string>();

  /** Signal que almacena el héroe actual cuando está en modo edición (para mostrar imagen). */
  public hero = signal<Hero | null>(null);

  /** Servicio para operaciones CRUD de héroes. */
  private readonly _heroesService = inject(HeroesService);

  /** FormBuilder de Angular para crear formularios reactivos. */
  private readonly _fb = inject(FormBuilder);

  /** Router de Angular para navegación programática. */
  private readonly _router = inject(Router);

  /** Formulario reactivo con los controles definidos. */
  public heroForm: FormGroup = this._fb.group(FORM_CONTROLS_CONFIG);

  /** Constante que identifica la creación de un nuevo héroe. */
  public readonly newId = NEW_ID;

  constructor() {
    toObservable(this.heroId)
      .pipe(
        // Maneja el caso 'new' como efecto secundario
        tap(id => {
          if (id === NEW_ID) {
            this.hero.set(null);
            this.heroForm.reset();
          }
        }),
        // Solo deja pasar IDs que NO son 'new'
        filter(id => id !== NEW_ID),
        // Por cada ID válido, obtiene el héroe
        // switchMap cancela peticiones anteriores automáticamente
        switchMap(id => this._heroesService.getHeroById(id)),
        // Se desuscribe automáticamente cuando el componente se destruye
        takeUntilDestroyed()
      )
      .subscribe({
        next: (heroById: Hero) => {
          if (heroById) {
            this.hero.set(heroById);
            this.heroForm.patchValue(heroById);
          }
        },
      });
  }

  /**
   * Guarda el héroe: si es edición, actualiza; si es nuevo, crea.
   */
  public onSave(): void {
    if (!this.heroForm.valid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    const id = this.heroId();
    if (id === NEW_ID) {
      this._addHero();
    } else {
      this._editHero(id);
    }
  }

  /**
   * Crea un nuevo héroe usando el servicio.
   * @private
   */
  private _addHero(): void {
    this._heroesService.createHero(this.heroForm.value).subscribe({
      next: () => this.goBack(),
    });
  }

  /**
   * Edita un héroe existente usando el servicio.
   * @private
   * @param id - ID del héroe a editar
   */
  private _editHero(id: string): void {
    const updatedHero: Hero = { ...this.heroForm.value, id };
    this._heroesService.updateHero(updatedHero).subscribe({
      next: () => this.goBack(),
    });
  }

  /**
   * Navega de vuelta al listado de héroes.
   */
  public goBack(): void {
    this._router.navigate(['/heroes/list']);
  }
}
