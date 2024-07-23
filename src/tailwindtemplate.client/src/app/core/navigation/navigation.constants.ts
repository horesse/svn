/* eslint-disable */
import { NavigationItem } from '@horesse/components/navigation';

export const defaultNavigation: NavigationItem[] = [
  {
    id      : 'user-interface',
    title   : 'Интерфейс',
    subtitle: 'UI & UX',
    type    : 'group',
    icon    : 'heroicons_outline:rectangle-stack',
    children: [
      {
        id      : 'user-interface.page-layouts',
        title   : 'Макеты страниц',
        type    : 'collapsable',
        icon    : 'heroicons_outline:rectangle-group',
        children: [
          {
            id   : 'user-interface.page-layouts.overview',
            title: 'Введение',
            type : 'basic',
            link : '/ui/page-layouts/overview'
          },
          {
            id   : 'user-interface.page-layouts.empty',
            title: 'Пустые',
            type : 'basic',
            link : '/ui/page-layouts/empty'
          },
          {
            id: 'user-interface.page-layouts.carded',

            title   : 'Карточка',
            type    : 'collapsable',
            children: [
              {
                id   : 'user-interface.page-layouts.carded.fullwidth',
                title: 'Полная длинна',
                type : 'basic',
                link : '/ui/page-layouts/carded/fullwidth'
              },
              {
                id   : 'user-interface.page-layouts.carded.left-sidebar-1',
                title: 'Левый сайдбар #1',
                type : 'basic',
                link : '/ui/page-layouts/carded/left-sidebar-1'
              },
              {
                id   : 'user-interface.page-layouts.carded.left-sidebar-2',
                title: 'Левый сайдбар #2',
                type : 'basic',
                link : '/ui/page-layouts/carded/left-sidebar-2'
              },
              {
                id   : 'user-interface.page-layouts.carded.right-sidebar-1',
                title: 'Правый сайдбар #1',
                type : 'basic',
                link : '/ui/page-layouts/carded/right-sidebar-1'
              },
              {
                id   : 'user-interface.page-layouts.carded.right-sidebar-2',
                title: 'Правый сайдбар #2',
                type : 'basic',
                link : '/ui/page-layouts/carded/right-sidebar-2'
              }
            ]
          },
          {
            id      : 'user-interface.page-layouts.simple',
            title   : 'Simple',
            type    : 'collapsable',
            children: [
              {
                id   : 'user-interface.page-layouts.simple.fullwidth-1',
                title: 'Полная длинна #1',
                type : 'basic',
                link : '/ui/page-layouts/simple/fullwidth-1'
              },
              {
                id   : 'user-interface.page-layouts.simple.fullwidth-2',
                title: 'Полная длинна #2',
                type : 'basic',
                link : '/ui/page-layouts/simple/fullwidth-2'
              },
              {
                id   : 'user-interface.page-layouts.simple.left-sidebar-1',
                title: 'Левый сайдбар #1',
                type : 'basic',
                link : '/ui/page-layouts/simple/left-sidebar-1'
              },
              {
                id   : 'user-interface.page-layouts.simple.left-sidebar-2',
                title: 'Левый сайдбар #2',
                type : 'basic',
                link : '/ui/page-layouts/simple/left-sidebar-2'
              },
              {
                id   : 'user-interface.page-layouts.simple.left-sidebar-3',
                title: 'Левый сайдбар #3',
                type : 'basic',
                link : '/ui/page-layouts/simple/left-sidebar-3'
              },
              {
                id   : 'user-interface.page-layouts.simple.right-sidebar-1',
                title: 'Правый сайдбар #1',
                type : 'basic',
                link : '/ui/page-layouts/simple/right-sidebar-1'
              },
              {
                id   : 'user-interface.page-layouts.simple.right-sidebar-2',
                title: 'Правый сайдбар #2',
                type : 'basic',
                link : '/ui/page-layouts/simple/right-sidebar-2'
              },
              {
                id   : 'user-interface.page-layouts.simple.right-sidebar-3',
                title: 'Правый сайдбар #3',
                type : 'basic',
                link : '/ui/page-layouts/simple/right-sidebar-3'
              }
            ]
          }
        ]
      }
    ]
  }
];
export const compactNavigation: NavigationItem[] = [
  {
    id      : 'user-interface',
    title   : 'Интерфейс',
    tooltip : 'UI',
    type    : 'aside',
    icon    : 'heroicons_outline:rectangle-stack',
    children: []
  }
];
export const futuristicNavigation: NavigationItem[] = [
  {
    id      : 'user-interface',
    title   : 'Пользовательский интерфейс',
    type    : 'aside',
    icon    : 'heroicons_outline:rectangle-stack',
    children: []
  }
];
export const horizontalNavigation: NavigationItem[] = [
  {
    id      : 'user-interface',
    title   : 'Интерфейс',
    type    : 'group',
    icon    : 'heroicons_outline:rectangle-stack',
    children: []
  }
];
