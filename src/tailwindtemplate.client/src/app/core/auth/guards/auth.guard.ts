import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { of, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);

  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          const redirectURL =
                  state.url === '/sign-out'
                    ? ''
                    : `redirectURL=${state.url}`;
          const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

          return of(urlTree);
        }

        // Allow the access
        return of(true);
      })
    );
};