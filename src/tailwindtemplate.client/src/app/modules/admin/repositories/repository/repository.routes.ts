import { UrlSegment } from '@angular/router';
import { RepositoryBlobComponent } from 'app/modules/admin/repositories/repository/blob/blob.component';
import { blobResolver } from 'app/modules/admin/repositories/repository/blob/blob.resolvers';
import { RepositoryCommitsComponent } from 'app/modules/admin/repositories/repository/commits/commits.component';
import { commitsResolver } from 'app/modules/admin/repositories/repository/commits/commits.resolvers';
import { RepositoryCommitDiffComponent } from 'app/modules/admin/repositories/repository/diff/diff.component';
import { changesResolver, commitResolver } from 'app/modules/admin/repositories/repository/diff/diff.resolvers';
import { RepositoryComponent } from 'app/modules/admin/repositories/repository/repository.component';
import { branchesResolver, lastCommitResolver, pathResolver, repoNameResolver, tagsResolver } from 'app/modules/admin/repositories/repository/repository.resolvers';
import { RepositoryTreeComponent } from 'app/modules/admin/repositories/repository/tree/tree.component';
import { itemsResolver, repositoryInformationResolver } from 'app/modules/admin/repositories/repository/tree/tree.resolvers';

export function customMatcher(url: UrlSegment[], path: string) {
  if (url.length >= 2 && url[0].path === path) {
    const fullPath = url.slice(1).map(seg => seg.path).join('/');
    return {
      consumed : url,
      posParams: { path: new UrlSegment(fullPath, {}) }
    };
  }

  return null;
}

export default [
  {
    path     : '',
    component: RepositoryComponent,
    resolve  : [repoNameResolver, branchesResolver, tagsResolver],
    children : [
      {
        matcher  : (s: UrlSegment[]) => customMatcher(s, 'tree'),
        component: RepositoryTreeComponent,
        resolve  : [pathResolver, lastCommitResolver, itemsResolver, repositoryInformationResolver]
      },
      {
        matcher  : (s: UrlSegment[]) => customMatcher(s, 'blob'),
        component: RepositoryBlobComponent,
        resolve  : [pathResolver, lastCommitResolver, blobResolver]
      },
      {
        matcher  : (s: UrlSegment[]) => customMatcher(s, 'commits'),
        component: RepositoryCommitsComponent,
        resolve  : [pathResolver, commitsResolver]
      },
      {
        path     : 'diff/:commit',
        component: RepositoryCommitDiffComponent,
        resolve  : [commitResolver, changesResolver]
      }
    ]
  }
];
