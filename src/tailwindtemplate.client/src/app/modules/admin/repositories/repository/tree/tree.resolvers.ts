import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { RepositoryTreeService } from 'app/modules/admin/repositories/repository/tree/tree.service';
import { catchError, throwError } from 'rxjs';

export const itemsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryTreeService);
  const router = inject(Router);

  return service.getRepoItems(route.parent.paramMap.get('title'), route.paramMap.get('path')).pipe(
    catchError((error) => {
      console.error(error);

      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      router.navigateByUrl(parentUrl);

      return throwError(error);
    })
  );


};

export const repositoryInformationResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(RepositoryService);
  const treeService = inject(RepositoryTreeService);
  const router = inject(Router);

  const repoName = route.parent.paramMap.get('title');
  const path = route.paramMap.get('path');
  const parts = path.split('/');
  const branch = parts[0] === 'trunk' ? parts[0] : `${parts[0]}/${parts[1]}`;

  if (service.currentRepo?.title === repoName && service.currentRepo?.path === branch)
    return treeService.repositoryInformation$;

  service.currentRepo = { title: repoName, path: branch };

  return treeService.getRepositoryInformation().pipe(
    catchError((error) => {
      console.error(error);

      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      router.navigateByUrl(parentUrl);

      return throwError(error);
    })
  );
};
