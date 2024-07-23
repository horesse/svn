import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [

  // Авторедирект на главную страницу
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  // Посадочные страницы
  {
    path     : '',
    component: LayoutComponent,
    data     : {
      layout: 'empty'
    },
    children : [
      { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') }
    ]
  },

  // Основной контент
  {
    path     : '',
    component: LayoutComponent,
    resolve  : {
      initialData: initialDataResolver
    },
    children : [
      {
        path: 'ui', children: [
          {
            path: 'page-layouts', loadChildren: () => import('app/modules/admin/ui/page-layouts/page-layouts.routes')
          }
        ]
      },
      {
        path: 'repositories', loadChildren: () => import('app/modules/admin/repositories/repositories.routes')
      }
    ]
  },

  // 404 & Отлов всех
  {
    path        : '404-not-found',
    pathMatch   : 'full',
    loadChildren: () => import('app/modules/pages/error/error-404/error-404.routes')
  },
  { path: '**', redirectTo: '404-not-found' }
];
