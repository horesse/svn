import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '@horesse/services/loading';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector     : 'loading-bar',
  templateUrl  : './loading-bar.component.html',
  styleUrls    : ['./loading-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs     : 'loadingBar',
  standalone   : true,
  imports      : [MatProgressBarModule]
})
export class LoadingBarComponent implements OnChanges, OnInit, OnDestroy {
  @Input() autoMode: boolean = true;
  mode: 'determinate' | 'indeterminate';
  progress: number = 0;
  show: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _loadingService: LoadingService;

  /**
   * Конструктор
   */
  constructor(_loadingService: LoadingService) {
    this._loadingService = _loadingService;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Жизненный цикл
  // -----------------------------------------------------------------------------------------------------

  /**
   * При изменениях
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('autoMode' in changes) {
      this._loadingService.setAutoMode(coerceBooleanProperty(changes.autoMode.currentValue));
    }
  }

  /**
   * При загрузке
   */
  ngOnInit(): void {
    this._loadingService.mode$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.mode = value;
      });

    this._loadingService.progress$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.progress = value;
      });

    this._loadingService.show$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.show = value;
      });

  }

  /**
   * При закрытии
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
