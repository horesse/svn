import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RepositoryCommitsService } from 'app/modules/admin/repositories/repository/commits/commits.service';
import { catchError, throwError } from 'rxjs';

export const commitsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryCommitsService);

  const router = inject(Router);
  const app = route.parent.paramMap.get('title');
  const path = route.paramMap.get('path');

  return service.getCommits(app, path, 0).pipe(
    catchError((error) => {
      console.error(error);

      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      router.navigateByUrl(parentUrl);

      return throwError(error);
    })
  );
};
