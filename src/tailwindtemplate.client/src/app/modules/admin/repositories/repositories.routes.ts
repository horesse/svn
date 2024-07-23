import { RepositoriesComponent } from 'app/modules/admin/repositories/repositories.component';

export default [
  {
    path     : 'list',
    component: RepositoriesComponent
  },
  {
    path        : 'repo/:title',
    loadChildren: () => import('app/modules/admin/repositories/repository/repository.routes')
  }
];
