import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { AppConfig, ConfigService } from '@horesse/services/config';
import { combineLatest, filter, map, Subject, takeUntil } from 'rxjs';
import { DOCUMENT, NgIf } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MediaWatcherService } from '@horesse/services/media-watcher';
import { PlatformService } from '@horesse/services/platform';
import { EmptyLayoutComponent } from 'app/layout/layouts/empty/empty.component';
import { ClassicLayoutComponent } from 'app/layout/layouts/vertical/classic/classic.component';
import { ModernLayoutComponent } from 'app/layout/layouts/horizontal/modern/modern.component';

@Component({
  selector     : 'layout',
  standalone   : true,
  templateUrl  : './layout.component.html',
  styleUrl     : './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports      : [NgIf, EmptyLayoutComponent, ClassicLayoutComponent, ModernLayoutComponent]
})
export class LayoutComponent implements OnInit, OnDestroy {
  config: AppConfig;
  layout: string;
  scheme: 'dark' | 'light';
  theme: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: any,
    private _renderer2: Renderer2,
    private _router: Router,
    private _configService: ConfigService,
    private _mediaWatcherService: MediaWatcherService,
    private _platformService: PlatformService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Перехватчики жизненного цикла
  // -----------------------------------------------------------------------------------------------------

  /**
   * При открытии
   */
  ngOnInit(): void {
    // тема и схема на основе конфига
    combineLatest([
      this._configService.config$,
      this._mediaWatcherService.onMediaQueryChange$(['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)'])
    ]).pipe(
      takeUntil(this._unsubscribeAll),
      map(([config, mql]) => {
        const options = {
          scheme: config.scheme,
          theme : config.theme
        };

        // Если тема авто...
        if (config.scheme === 'auto') {
          // Определитесь со схемой с помощью медиа-запроса
          options.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
        }

        return options;
      })
    ).subscribe((options) => {
      // Сохраняем параметры
      this.scheme = options.scheme;
      this.theme = options.theme;

      // Обновить схему и тему
      this._updateScheme();
      this._updateTheme();
    });

    // Подписаться на изменения конфигурации
    this._configService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: AppConfig) => {
        // Запомнить конфиг
        this.config = config;

        // Обновить макет
        this._updateLayout();
      });

    // Подписаться на событие NavigationEnd
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      // Обновить макет
      this._updateLayout();
    });

    // Устанавливаем имя ОС
    this._renderer2.addClass(this._document.body, this._platformService.osName);
  }

  /**
   * При закрытии
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Приватные методы
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update the selected layout
   */
  private _updateLayout(): void {
    // Получить текущий маршрут
    let route = this._activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    // 1. Установить макет из конфига
    this.layout = this.config.layout;

    // 2. Get the query parameter from the current route and
    // Получите параметр запроса из текущего маршрута, установите макет и сохраните макет в конфигурации.
    const layoutFromQueryParam = route.snapshot.queryParamMap.get('layout');
    if (layoutFromQueryParam) {
      this.layout = layoutFromQueryParam;
      if (this.config) {
        this.config.layout = layoutFromQueryParam;
      }
    }

    // Перебираем пути и меняем макет по мере того, как находим для него конфигурацию.
    const paths = route.pathFromRoot;
    paths.forEach((path) => {
      // Есть ли данные «макета»
      if (path.routeConfig && path.routeConfig.data && path.routeConfig.data.layout) {
        // Установить макет
        this.layout = path.routeConfig.data.layout;
      }
    });
  }

  /**
   * Обновить выбранную схему
   *
   * @private
   */
  private _updateScheme(): void {
    // Удалить имена классов для всех схем
    this._document.body.classList.remove('light', 'dark');

    // Добавить имя класса для выбранной в данный момент схемы
    this._document.body.classList.add(this.scheme);
  }

  /**
   * Обновить выбранную тему
   *
   * @private
   */
  private _updateTheme(): void {
    // Имя класса для ранее выбранной темы и удалите его.
    this._document.body.classList.forEach((className: string) => {
      if (className.startsWith('theme-')) {
        this._document.body.classList.remove(className, className.split('-')[1]);
      }
    });

    // Имя класса для выбранной в данный момент темы
    this._document.body.classList.add(this.theme);
  }
}
