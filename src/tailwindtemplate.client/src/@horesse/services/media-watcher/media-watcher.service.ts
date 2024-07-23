import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { ConfigService } from '@horesse/services/config';
import { fromPairs } from 'lodash-es';
import { map, Observable, ReplaySubject, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaWatcherService {
  private _onMediaChange: ReplaySubject<{ matchingAliases: string[]; matchingQueries: any }> = new ReplaySubject<{
    matchingAliases: string[];
    matchingQueries: any
  }>(1);

  /**
   * Конструктор
   */
  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _configService: ConfigService
  ) {
    this._configService.config$.pipe(
      map(config => fromPairs(Object.entries(config.screens).map(([alias, screen]) => ([alias, `(min-width: ${screen})`])))),
      switchMap(screens => this._breakpointObserver.observe(Object.values(screens)).pipe(
        map((state) => {
          // Подготовка наблюдаемых значений и установка их значения по умолчанию
          const matchingAliases: string[] = [];
          const matchingQueries: any = {};

          // Получаем соответствующие точки останова и используем их для заполнения темы
          const matchingBreakpoints = Object.entries(state.breakpoints).filter(([query, matches]) => matches) ?? [];
          for (const [query] of matchingBreakpoints) {
            // Псевдоним соответствующего запроса
            const matchingAlias = Object.entries(screens).find(([alias, q]) => q === query)[0];

            // Соответствующий запрос к наблюдаемым значениям
            if (matchingAlias) {
              matchingAliases.push(matchingAlias);
              matchingQueries[matchingAlias] = query;
            }
          }

          // Выполнить наблюдаемое
          this._onMediaChange.next({
            matchingAliases,
            matchingQueries
          });
        })
      ))
    ).subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Методы доступа
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for _onMediaChange
   */
  get onMediaChange$(): Observable<{ matchingAliases: string[]; matchingQueries: any }> {
    return this._onMediaChange.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Публичные методы
  // -----------------------------------------------------------------------------------------------------

  /**
   * При изменении медиа
   *
   * @param query
   */
  onMediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
    return this._breakpointObserver.observe(query);
  }
}
