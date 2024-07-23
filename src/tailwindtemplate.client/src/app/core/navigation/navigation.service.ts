import { Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, of, ReplaySubject } from 'rxjs';
import { compactNavigation, defaultNavigation, futuristicNavigation, horizontalNavigation } from 'app/core/navigation/navigation.constants';
import { NavigationItem } from '@horesse/components/navigation';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

  private readonly _compactNavigation: NavigationItem[] = compactNavigation;
  private readonly _defaultNavigation: NavigationItem[] = defaultNavigation;
  private readonly _futuristicNavigation: NavigationItem[] = futuristicNavigation;
  private readonly _horizontalNavigation: NavigationItem[] = horizontalNavigation;

  // -----------------------------------------------------------------------------------------------------
  // @ Методы данных
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter для навигации
   */
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Публичные методы
  // -----------------------------------------------------------------------------------------------------

  /**
   * Получить все пункты навигации
   */
  get(): Observable<boolean> {
    this._compactNavigation.forEach((compactNavItem) => {
      this._defaultNavigation.forEach((defaultNavItem) => {
        if (defaultNavItem.id === compactNavItem.id) {
          compactNavItem.children = cloneDeep(defaultNavItem.children);
        }
      });
    });

    this._futuristicNavigation.forEach((futuristicNavItem) => {
      this._defaultNavigation.forEach((defaultNavItem) => {
        if (defaultNavItem.id === futuristicNavItem.id) {
          futuristicNavItem.children = cloneDeep(defaultNavItem.children);
        }
      });
    });

    this._horizontalNavigation.forEach((horizontalNavItem) => {
      this._defaultNavigation.forEach((defaultNavItem) => {
        if (defaultNavItem.id === horizontalNavItem.id) {
          horizontalNavItem.children = cloneDeep(defaultNavItem.children);
        }
      });
    });

    const navigation = {
      compact   : cloneDeep(this._compactNavigation),
      default   : cloneDeep(this._defaultNavigation),
      futuristic: cloneDeep(this._futuristicNavigation),
      horizontal: cloneDeep(this._horizontalNavigation)
    };

    this._navigation.next(navigation);

    return of(true);
  }
}
