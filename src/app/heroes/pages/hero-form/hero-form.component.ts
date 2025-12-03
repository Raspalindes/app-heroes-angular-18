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

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [ReactiveFormsModule, HeroImagePipe],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent {
  /** ID del héroe recibido desde la ruta. 'new' para crear, ID para editar. */
  public id = input.required<string>();

  /** Signal que almacena el héroe actual cuando está en modo edición. */
  public hero = signal<Hero | null>(null);

  /** Servicio para operaciones CRUD de héroes. */
  private readonly _heroesService = inject(HeroesService);

  /** FormBuilder de Angular para crear formularios reactivos. */
  private readonly _fb = inject(FormBuilder);

  /** Router de Angular para navegación programática. */
  private readonly _router = inject(Router);

  /** Formulario reactivo con validaciones. */
  public heroForm: FormGroup = this._fb.group(FORM_CONTROLS_CONFIG);

  /** Constante que identifica la creación de un nuevo héroe. */
  public readonly newId = NEW_ID;

  constructor() {
    toObservable(this.id)
      .pipe(
        tap(id => {
          if (id === NEW_ID) {
            this.hero.set(null);
            this.heroForm.reset();
          }
        }),
        filter(id => id !== NEW_ID),
        switchMap(id => this._heroesService.getHeroById(id)),
        takeUntilDestroyed()
      )
      .subscribe({
        next: heroById => {
          if (heroById) {
            this.hero.set(heroById);
            this.heroForm.patchValue(heroById);
          }
        },
        error: err => {
          console.error('Error al cargar héroe:', err);
        },
      });
  }

  public goBack(): void {
    this._router.navigate(['/heroes/list']);
  }

  public onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }
    const id = this.id();
    if (id === NEW_ID) {
      this._createHero();
    } else {
      this._updateHero(id!);
    }
  }

  private _createHero(): void {
    this._heroesService.createHero(this.heroForm.value).subscribe({
      next: () => {
        this.goBack();
      },
    });
  }

  private _updateHero(id: string): void {
    const updatedHero: Hero = { ...this.heroForm.value, id };
    this._heroesService.updateHero(updatedHero).subscribe({
      next: () => {
        this.goBack();
      },
    });
  }
}
