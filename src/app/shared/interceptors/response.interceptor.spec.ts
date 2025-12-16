import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { responseInterceptor } from './response.interceptor';

describe('responseInterceptor', () => {
  let messageService: MessageService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService],
    });

    messageService = TestBed.inject(MessageService);
    router = TestBed.inject(Router);

    spyOn(messageService, 'add');
    spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(responseInterceptor).toBeTruthy();
  });

  describe('successful POST requests', () => {
    it('should show success message for POST request', done => {
      const req = new HttpRequest('POST', '/api/heroes', {});

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () =>
          of({
            type: 4,
            body: { id: '1', superhero: 'Batman' },
            status: 200,
            statusText: 'OK',
            url: '/api/heroes',
          } as any)
        ).subscribe(() => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'La operación se completó correctamente',
            life: 3000,
          });
          done();
        });
      });
    });
  });

  describe('successful PUT requests', () => {
    it('should show success message for PUT request', done => {
      const req = new HttpRequest('PUT', '/api/heroes/1', {});

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () =>
          of({
            type: 4,
            body: { id: '1', superhero: 'Superman' },
            status: 200,
            statusText: 'OK',
            url: '/api/heroes/1',
          } as any)
        ).subscribe(() => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'La operación se completó correctamente',
            life: 3000,
          });
          done();
        });
      });
    });
  });

  describe('successful DELETE requests', () => {
    it('should show success message for DELETE request', done => {
      const req = new HttpRequest('DELETE', '/api/heroes/1', null);

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () =>
          of({
            type: 4,
            body: {},
            status: 200,
            statusText: 'OK',
            url: '/api/heroes/1',
          } as any)
        ).subscribe(() => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'La operación se completó correctamente',
            life: 3000,
          });
          done();
        });
      });
    });
  });

  describe('GET requests', () => {
    it('should not show success message for GET request', done => {
      const req = new HttpRequest('GET', '/api/heroes', null);

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () =>
          of({
            type: 4,
            body: [],
            status: 200,
            statusText: 'OK',
            url: '/api/heroes',
          } as any)
        ).subscribe(() => {
          expect(messageService.add).not.toHaveBeenCalled();
          done();
        });
      });
    });

    it('should pass through GET response without messages', done => {
      const req = new HttpRequest('GET', '/api/heroes', null);
      const expectedData = [{ id: '1', superhero: 'Batman' }];

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () =>
          of({
            type: 4,
            body: expectedData,
            status: 200,
            statusText: 'OK',
            url: '/api/heroes',
          } as any)
        ).subscribe((event: any) => {
          expect(event.body).toEqual(expectedData);
          expect(messageService.add).not.toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('error handling', () => {
    it('should show error message on request failure', done => {
      const req = new HttpRequest('GET', '/api/heroes/999', null);
      const errorObj = { status: 404, statusText: 'Not Found' };

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () => throwError(() => errorObj)).subscribe(
          () => fail('should have failed'),
          () => {
            expect(messageService.add).toHaveBeenCalledWith({
              severity: 'error',
              summary: 'Ha ocurrido un error',
              detail: 'No se pudo completar la operación',
              life: 3000,
            });
            done();
          }
        );
      });
    });

    it('should navigate to error page on request failure', done => {
      const req = new HttpRequest('GET', '/api/heroes/999', null);
      const errorObj = { status: 404, statusText: 'Not Found' };

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () => throwError(() => errorObj)).subscribe(
          () => fail('should have failed'),
          () => {
            expect(router.navigate).toHaveBeenCalledWith(['/error']);
            done();
          }
        );
      });
    });

    it('should show error message on 500 error', done => {
      const req = new HttpRequest('POST', '/api/heroes', {});
      const errorObj = { status: 500, statusText: 'Internal Server Error' };

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () => throwError(() => errorObj)).subscribe(
          () => fail('should have failed'),
          () => {
            expect(messageService.add).toHaveBeenCalledWith({
              severity: 'error',
              summary: 'Ha ocurrido un error',
              detail: 'No se pudo completar la operación',
              life: 3000,
            });
            done();
          }
        );
      });
    });

    it('should navigate to error page on 500 error', done => {
      const req = new HttpRequest('POST', '/api/heroes', {});
      const errorObj = { status: 500, statusText: 'Internal Server Error' };

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () => throwError(() => errorObj)).subscribe(
          () => fail('should have failed'),
          () => {
            expect(router.navigate).toHaveBeenCalledWith(['/error']);
            done();
          }
        );
      });
    });

    it('should show error message on 403 error', done => {
      const req = new HttpRequest('DELETE', '/api/heroes/1', null);
      const errorObj = { status: 403, statusText: 'Forbidden' };

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () => throwError(() => errorObj)).subscribe(
          () => fail('should have failed'),
          () => {
            expect(messageService.add).toHaveBeenCalledWith({
              severity: 'error',
              summary: 'Ha ocurrido un error',
              detail: 'No se pudo completar la operación',
              life: 3000,
            });
            done();
          }
        );
      });
    });

    it('should navigate to error page on 403 error', done => {
      const req = new HttpRequest('DELETE', '/api/heroes/1', null);
      const errorObj = { status: 403, statusText: 'Forbidden' };

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () => throwError(() => errorObj)).subscribe(
          () => fail('should have failed'),
          () => {
            expect(router.navigate).toHaveBeenCalledWith(['/error']);
            done();
          }
        );
      });
    });

    it('should re-throw the error after handling', done => {
      const req = new HttpRequest('GET', '/api/heroes', null);
      const errorObj = { status: 404, statusText: 'Not Found' };

      TestBed.runInInjectionContext(() => {
        responseInterceptor(req, () => throwError(() => errorObj)).subscribe(
          () => fail('should have failed'),
          error => {
            expect(error).toEqual(errorObj);
            done();
          }
        );
      });
    });
  });

  describe('request method detection', () => {
    it('should only show messages for POST, PUT, DELETE', done => {
      const postReq = new HttpRequest('POST', '/api/heroes', {});
      const putReq = new HttpRequest('PUT', '/api/heroes/1', {});
      const deleteReq = new HttpRequest('DELETE', '/api/heroes/1', null);
      const response = {
        type: 4,
        body: {},
        status: 200,
        statusText: 'OK',
      } as any;

      let completed = 0;
      const checkDone = () => {
        completed++;
        if (completed === 3) {
          expect(messageService.add).toHaveBeenCalledTimes(3);
          done();
        }
      };

      TestBed.runInInjectionContext(() => {
        responseInterceptor(postReq, () => of(response)).subscribe(() =>
          checkDone()
        );
        responseInterceptor(putReq, () => of(response)).subscribe(() =>
          checkDone()
        );
        responseInterceptor(deleteReq, () => of(response)).subscribe(() =>
          checkDone()
        );
      });
    });

    it('should not show messages for other methods', done => {
      const getReq = new HttpRequest('GET', '/api/heroes', null);
      const patchReq = new HttpRequest('PATCH', '/api/heroes/1', {});
      const response = {
        type: 4,
        body: {},
        status: 200,
        statusText: 'OK',
      } as any;

      let completed = 0;
      const checkDone = () => {
        completed++;
        if (completed === 2) {
          expect(messageService.add).not.toHaveBeenCalled();
          done();
        }
      };

      TestBed.runInInjectionContext(() => {
        responseInterceptor(getReq, () => of(response)).subscribe(() =>
          checkDone()
        );
        responseInterceptor(patchReq, () => of(response)).subscribe(() =>
          checkDone()
        );
      });
    });
  });
});
