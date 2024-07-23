import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { catchError, of, throwError } from 'rxjs';


// Получение данных

export const branchesResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryService);
  const router = inject(Router);

  return service.getBranches(route.parent.paramMap.get('title')).pipe(
    catchError((error) => {
      console.error(error);

      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      router.navigateByUrl(parentUrl);

      return throwError(error);
    })
  );
};

export const tagsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryService);
  const router = inject(Router);

  return service.getTags(route.parent.paramMap.get('title')).pipe(
    catchError((error) => {
      console.error(error);

      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      router.navigateByUrl(parentUrl);

      return throwError(error);
    })
  );
};

export const lastCommitResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryService);
  const router = inject(Router);

  return service.getLastCommit(route.parent.paramMap.get('title'), route.paramMap.get('path')).pipe(
    catchError((error) => {
      console.error(error);

      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      router.navigateByUrl(parentUrl);

      return throwError(error);
    })
  );
};

// Запоминание параметров

export const repoNameResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryService);

  service.repositoryName$ = route.paramMap.get('title');

  return of(true);
};

export const pathResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryService);

  service.currentPath$ = route.paramMap.get('path');

  return of(true);
};






