import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HeroRoutes } from '../../enums/hero-routes.enum';
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
  /** Servicio para operaciones CRUD de héroes. */
  private readonly _heroesService = inject(HeroesService);

  /** FormBuilder de Angular para crear formularios reactivos. */
  private readonly _fb = inject(FormBuilder);

  /** Router de Angular para navegación programática. */
  private readonly _router = inject(Router);

  /** ID del héroe recibido desde la ruta. 'new' para crear, ID para editar. */
  public heroId = input.required<string>();

  /** Signal que almacena el héroe actual cuando está en modo edición (para mostrar imagen). */
  public $hero = signal<Hero | null>(null);

  /** Formulario reactivo con los controles definidos. */
  public heroForm: FormGroup = this._fb.group(FORM_CONTROLS_CONFIG);

  /** Constante que identifica la creación de un nuevo héroe. */
  public readonly newId = NEW_ID;

  constructor() {
    effect(() => {
      const id = this.heroId();
      if (id && id !== NEW_ID) {
        this._loadHeroData(id);
      }
    });
  }

  private _loadHeroData(id: string): void {
    this._heroesService.getHeroById(id).subscribe({
      next: (heroById: Hero) => {
        if (heroById) {
          this.heroForm.patchValue(heroById);
          this.$hero.set(heroById);
        }
      },
    });
  }

  /**
   * Verifica si un campo del formulario tiene errores y ha sido tocado.
   * @param fieldName - Nombre del campo a validar
   * @returns true si el campo es inválido y ha sido tocado
   */
  public hasFieldError(fieldName: string): boolean {
    const field = this.heroForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /** Navega de vuelta al listado de héroes. */
  public goBack(): void {
    this._router.navigate([HeroRoutes.LIST]);
  }

  /** Guarda el héroe: si es edición, actualiza; si es nuevo, crea. */
  public onSave(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    const id = this.heroId();
    if (id === NEW_ID) {
      this._addHero();
    } else {
      this._editHero();
    }
  }

  /**
   * Crea un nuevo héroe usando el servicio.
   * @private
   */
  private _addHero(): void {
    const newHero: Omit<Hero, 'id'> = this.heroForm.value;
    this._heroesService.addHero(newHero).subscribe({
      next: () => this.goBack(),
    });
  }

  /**
   * Edita un héroe existente usando el servicio.
   * @private
   * @param id - ID del héroe a editar
   */
  private _editHero(): void {
    const actualHero = this.$hero();
    const updatedHero: Hero = { ...actualHero, ...this.heroForm.value };
    this._heroesService.editHero(updatedHero).subscribe({
      next: () => this.goBack(),
    });
  }
}
