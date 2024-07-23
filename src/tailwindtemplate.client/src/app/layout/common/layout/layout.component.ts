import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppConfig, ConfigService } from '@horesse/services/config';
import { Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector   : 'layout-switcher',
  standalone : true,
  imports    : [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './layout.component.html'
})
export class LayoutSwitcherComponent implements OnInit, OnDestroy {
  config: AppConfig;
  layout: 'classic' | 'modern';

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
   * Выбрать макет
   *
   * @param layout
   */
  setLayout(layout: string): void {
    this._configService.config = { layout };
  }
}
