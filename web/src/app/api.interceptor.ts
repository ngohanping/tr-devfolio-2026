import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigurationService } from './configurations/configuration.service';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const configurationService = inject(ConfigurationService);
  const newRequest = request.clone({
    url: `${configurationService.configurations.baseUrl}${request.url}`,
  });

  return next(newRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      return throwError(() => error);
    }),
  );
};
