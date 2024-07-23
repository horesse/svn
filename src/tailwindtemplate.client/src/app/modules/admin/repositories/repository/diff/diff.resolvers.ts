import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RepositoryDiffService } from 'app/modules/admin/repositories/repository/diff/diff.service';
import { catchError, throwError } from 'rxjs';

export const commitResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryDiffService);
  const router = inject(Router);

  return service.getCommitByRevision(route.parent.paramMap.get('title'), Number(route.paramMap.get('commit'))).pipe(
    catchError((error) => {
      console.error(error);

      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      router.navigateByUrl(parentUrl);

      return throwError(error);
    })
  );
};

export const changesResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryDiffService);
  const router = inject(Router);

  return service.getChangesByRevision(route.parent.paramMap.get('title'), Number(route.paramMap.get('commit'))).pipe(
    catchError((error) => {
      console.error(error);

      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      router.navigateByUrl(parentUrl);

      return throwError(error);
    })
  );
};
