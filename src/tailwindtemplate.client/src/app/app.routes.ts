import { Route } from '@angular/router';
import { baseDataResolver, initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [

  // Авторедирект на главную страницу
  { path: '', pathMatch: 'full', redirectTo: 'ui/page-layouts/overview' },

  {
    path      : 'signed-in-redirect',
    pathMatch : 'full',
    redirectTo: '/'
  },

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

  // Роутсы авторизации для гостей
  {
    path            : '',
    canActivate     : [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component       : LayoutComponent,
    resolve         : {
      baseData: baseDataResolver
    },
    data            : {
      layout: 'empty'
    },
    children        : [
      {
        path        : 'sign-in',
        loadChildren: () =>
          import('app/modules/auth/sign-in/sign-in.routes')
      }
    ]
  },

  // Роутсы для авторизованных юзеров
  {
    path            : '',
    canActivate     : [AuthGuard],
    canActivateChild: [AuthGuard],
    component       : LayoutComponent,
    data            : {
      layout: 'empty'
    },
    children        : [
      {
        path        : 'sign-out',
        loadChildren: () =>
          import('app/modules/auth/sign-out/sign-out.routes')
      }
    ]
  },

  // Основной контент
  {
    path            : '',
    component       : LayoutComponent,
    canActivate     : [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve         : {
      initialData: initialDataResolver,
      baseData   : baseDataResolver
    },
    children        : [
      {
        path: 'ui', children: [
          {
            path: 'page-layouts', loadChildren: () => import('app/modules/admin/ui/page-layouts/page-layouts.routes')
          }
        ]
      },
      {
        path: 'repositories', loadChildren: () => import('app/modules/admin/repositories/repositories.routes')
      },
      {
        path: 'profile', loadChildren: () => import('app/modules/admin/personal/profile/profile.routes')
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
