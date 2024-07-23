import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable, take } from 'rxjs';
import { LoadingService } from './loading.service';

export const loadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const _loadingService = inject(LoadingService);
  let handleRequestsAutomatically = false;

  _loadingService.auto$
    .pipe(take(1))
    .subscribe((value) => {
      handleRequestsAutomatically = value;
    });

  // Если автоматический режим выключен, ничего не делаем
  if (!handleRequestsAutomatically) {
    return next(req);
  }

  // Устанавливаем статус загрузки на true
  _loadingService._setLoadingStatus(true, req.url);

  return next(req).pipe(
    finalize(() => {
      // Устанавливаем статус false, если есть какие-либо ошибки или запрос выполнен.
      _loadingService._setLoadingStatus(false, req.url);
    }));
};
