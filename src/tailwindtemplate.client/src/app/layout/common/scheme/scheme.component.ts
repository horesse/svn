import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppConfig, ConfigService, Scheme } from '@horesse/services/config';
import { Subject, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector   : 'scheme',
  standalone : true,
  templateUrl: './scheme.component.html',
  imports    : [MatButtonModule, MatIconModule, MatTooltipModule]
})
export class SchemeComponent implements OnInit, OnDestroy {
  config: AppConfig;
  scheme: 'dark' | 'light';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _configService: ConfigService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Жизненный цикл
  // -----------------------------------------------------------------------------------------------------

  /**
   * При инициализации
   */
  ngOnInit(): void {
    this._configService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: AppConfig) => {
        this.config = config;
      });
  }

  /**
   * При закрытии
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   * Выбрать схему
   *
   * @param scheme
   */
  setScheme(scheme: Scheme): void {
    this._configService.config = { scheme };
  }
}
