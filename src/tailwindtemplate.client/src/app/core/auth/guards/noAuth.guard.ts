import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { of, switchMap } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (
  route,
  state
) => {
  const router: Router = inject(Router);

  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        if (authenticated) {
          return of(router.parseUrl(''));
        }

        return of(true);
      })
    );
};