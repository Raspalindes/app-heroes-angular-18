import { Component, input, output } from '@angular/core';

import { Hero } from '../../../heroes/interfaces/hero.interface';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  /** Recibe el héroe completo como input */
  public hero = input.required<Hero>();

  /** Emite el id del héroe al confirmar */
  public confirmed = output<string>();

  /** Emite un evento vacío al cancelar */
  public cancelled = output<void>();

  /** emite el id */
  public onConfirm(): void {
    this.confirmed.emit(this.hero().id);
  }

  /** Cancela */
  public onCancel(): void {
    this.cancelled.emit();
  }
}
