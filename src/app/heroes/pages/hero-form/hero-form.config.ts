import { Validators } from '@angular/forms';

/**
 * Configuración de controles del formulario de héroes.
 * Define la estructura y validaciones de cada campo.
 */
export const FORM_CONTROLS_CONFIG = {
  superhero: ['', [Validators.required, Validators.minLength(3)]],
  publisher: ['', Validators.required],
  alter_ego: ['', Validators.required],
  first_appearance: ['', Validators.required],
  img: [''],
  alt_img: [''],
};
