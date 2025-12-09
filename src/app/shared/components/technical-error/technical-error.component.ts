import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente que muestra una pantalla de error técnico.
 * Proporciona información al usuario sobre un error y un botón para volver al inicio.
 */
@Component({
  selector: 'app-technical-error',
  standalone: true,
  templateUrl: './technical-error.component.html',
  styleUrl: './technical-error.component.scss',
})
export class TechnicalErrorComponent {
  /** Inyecta el servicio de navegación de Angular. */
  private readonly _router = inject(Router);

  /** Navega al inicio de la aplicación. */
  public goHome(): void {
    this._router.navigate(['/']);
  }
}
