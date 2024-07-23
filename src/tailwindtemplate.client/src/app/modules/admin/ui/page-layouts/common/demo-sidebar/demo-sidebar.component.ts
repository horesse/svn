import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VerticalNavigationComponent } from '@horesse/components/navigation';
import { NavigationItem } from '@horesse/components/navigation/navigation.types';

@Component({
  selector     : 'demo-sidebar',
  template     : `
    <div class="py-10">
      <!-- Дополнительный контент, который может быть предоставлен вместе с компонентом. -->
      <div class="extra-content">
        <ng-content></ng-content>
      </div>

      <!-- Фиксированный демонстрационный сайдбар -->
      <div class="mx-6 text-3xl font-bold tracking-tighter">Демо-сайдбар</div>
      <vertical-navigation
        [appearance]="'default'"
        [navigation]="menuData"
        [inner]="true"
        [mode]="'side'"
        [name]="'demo-sidebar-navigation'"
        [opened]="true"></vertical-navigation>

      <!-- Хранилище -->
      <div class="mx-6 mt-2">
        <div class="flex items-center">
          <mat-icon
            class="mr-2 icon-size-5"
            [svgIcon]="'heroicons_solid:circle-stack'"></mat-icon>
          <div class="text-lg font-semibold">Хранилище</div>
        </div>
        <div class="flex flex-col flex-auto mt-4">
          <span class="text-sm leading-none mb-3">19.9 GB из 100 GB используется</span>
          <mat-progress-bar
            [mode]="'determinate'"
            [color]="'primary'"
            [value]="19.9"></mat-progress-bar>
        </div>
      </div>

      <!-- Пользователи -->
      <div class="mx-6 mt-10">
        <div class="flex items-center">
          <mat-icon
            class="mr-2 icon-size-5"
            [svgIcon]="'heroicons_solid:users'"></mat-icon>
          <div class="text-lg font-semibold">Пользователи</div>
        </div>
        <div class="flex flex-col flex-auto mt-4">
          <span class="text-sm leading-none mb-3">8 из 20 пользователей используется</span>
          <mat-progress-bar
            [mode]="'determinate'"
            [color]="'accent'"
            [value]="40"></mat-progress-bar>
        </div>
      </div>
    </div>
  `,
  styles       : [
    `
      demo-sidebar vertical-navigation .vertical-navigation-wrapper {
        box-shadow: none !important;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  standalone   : true,
  imports      : [VerticalNavigationComponent, MatIconModule, MatProgressBarModule]
})
export class DemoSidebarComponent {
  menuData: NavigationItem[];

  /**
   * Constructor
   */
  constructor() {
    this.menuData = [
      {
        title   : 'Действия',
        subtitle: 'Задачи, проект & команда',
        type    : 'group',
        children: [
          {
            title: 'Создать задачу',
            type : 'basic',
            icon : 'heroicons_outline:plus-circle'
          },
          {
            title: 'Создать команду',
            type : 'basic',
            icon : 'heroicons_outline:user-group'
          },
          {
            title: 'Создать проект',
            type : 'basic',
            icon : 'heroicons_outline:briefcase'
          },
          {
            title: 'Создать пользователя',
            type : 'basic',
            icon : 'heroicons_outline:user-plus'
          },
          {
            title   : 'Назначить пользователя или команду',
            subtitle: 'Назначение задаче или проекту',
            type    : 'basic',
            icon    : 'heroicons_outline:check-badge'
          }
        ]
      },
      {
        title   : 'Задачи',
        type    : 'group',
        children: [
          {
            title: 'Все задачи',
            type : 'basic',
            icon : 'heroicons_outline:clipboard-document-list',
            badge: {
              title  : '49',
              classes: 'px-2 bg-primary text-on-primary rounded-full'
            }
          },
          {
            title: 'Текущие задачи',
            type : 'basic',
            icon : 'heroicons_outline:clipboard-document-check'
          },
          {
            title: 'Выполненные задачи',
            type : 'basic',
            icon : 'heroicons_outline:clipboard-document-check'
          },
          {
            title: 'Заброшенные задачи',
            type : 'basic',
            icon : 'heroicons_outline:clipboard'
          },
          {
            title: 'Назначено мне',
            type : 'basic',
            icon : 'heroicons_outline:user'
          },
          {
            title: 'Назначено команде',
            type : 'basic',
            icon : 'heroicons_outline:users'
          }
        ]
      },
      {
        title   : 'Настройки',
        type    : 'group',
        children: [
          {
            title   : 'Общие',
            type    : 'collapsable',
            icon    : 'heroicons_outline:cog-8-tooth',
            children: [
              {
                title: 'Задачи',
                type : 'basic'
              },
              {
                title: 'Пользователи',
                type : 'basic'
              },
              {
                title: 'Команды',
                type : 'basic'
              }
            ]
          },
          {
            title   : 'Аккаунт',
            type    : 'collapsable',
            icon    : 'heroicons_outline:user-circle',
            children: [
              {
                title: 'Общие',
                type : 'basic'
              },
              {
                title: 'Оплата',
                type : 'basic'
              },
              {
                title: 'Безопасность',
                type : 'basic'
              }
            ]
          }
        ]
      },
      {
        type: 'divider'
      }
    ];
  }
}
