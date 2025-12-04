import { Component, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  /** Evento emitido al confirmar */
  public confirmed = output<void>();

  /** Evento emitido al cancelar */
  public cancelled = output<void>();

  /** Ejecuta la acción de confirmar y emite el evento */
  public onConfirm(): void {
    this.confirmed.emit();
  }

  /** Ejecuta la acción de cancelar y emite el evento */
  public onCancel(): void {
    this.cancelled.emit();
  }
}
