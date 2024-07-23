import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RepositoryBlobService } from 'app/modules/admin/repositories/repository/blob/blob.service';
import { catchError, throwError } from 'rxjs';

export const blobResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryBlobService);
  const router = inject(Router);

  return service.getFileContent(route.parent.paramMap.get('title'), route.paramMap.get('path')).pipe(
    catchError((error) => {
      console.error(error);

      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      router.navigateByUrl(parentUrl);

      return throwError(error);
    })
  );
};
