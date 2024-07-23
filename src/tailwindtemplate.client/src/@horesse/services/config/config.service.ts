import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HORESSE_CONFIG } from './config.constants';
import { merge } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _config: BehaviorSubject<any>;

  /**
   * Конструтор
   */
  constructor(@Inject(HORESSE_CONFIG) config: any) {
    this._config = new BehaviorSubject(config);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Методы доступа
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter для конфига
   */
  set config(value: any) {
    // Объединить новую конфигурацию с текущей
    const config = merge({}, this._config.getValue(), value);
    localStorage.setItem('CONFIG', JSON.stringify(config));
    this._config.next(config);
  }

  get config$(): Observable<any> {
    return this._config.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Публичные методы
  // -----------------------------------------------------------------------------------------------------

  /**
   * Загрузка уже настроенного пользовательского конфига
   */
  loadConfig() {
    this.config = JSON.parse(localStorage.getItem('CONFIG'));

    return of(true);
  }

  /**
   * Сбор конфинга до стандартного
   */
  reset(): void {
    this._config.next(this.config);
  }
}
