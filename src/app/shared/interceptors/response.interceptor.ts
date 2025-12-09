/**
 * Interceptor HTTP que maneja las respuestas de las peticiones.
 * Muestra notificaciones usando PrimeNG Toast:
 * - Notificaciones de éxito para POST, PUT y DELETE exitosos.
 * - Notificaciones de error para cualquier petición fallida.
 */
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, tap, throwError } from 'rxjs';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    tap(event => {
      // Solo procesa respuestas HTTP exitosas (tipo 4 = HttpEventType.Response)
      if (event.type === 4) {
        const method = req.method.toUpperCase();

        // Muestra notificación solo para POST, PUT y DELETE
        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
          messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'La operación se completó correctamente',
            life: 3000,
          });
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Muestra notificación de error para cualquier petición fallida
      messageService.add({
        severity: 'error',
        summary: 'Ha ocurrido un error',
        detail: 'No se pudo completar la operación',
        life: 3000,
      });
      //TODO enviar a la pantalla de tecnichal error con más detalles

      // Re-lanza el error para que lo manejen los suscriptores
      return throwError(() => error);
    })
  );
};
