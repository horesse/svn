import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { animations } from '@horesse/animations';
import { AlertService } from '@horesse/components/alert/alert.service';
import { AlertAppearance, AlertType } from '@horesse/components/alert/alert.types';
import { UtilsService } from '@horesse/services/utils';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'alert',
  templateUrl    : './alert.component.html',
  styleUrls      : ['./alert.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations     : animations,
  exportAs       : 'alert',
  standalone     : true,
  imports        : [NgIf, MatIconModule, MatButtonModule]
})
export class AlertComponent implements OnChanges, OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_dismissible: BooleanInput;
  static ngAcceptInputType_dismissed: BooleanInput;
  static ngAcceptInputType_showIcon: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() appearance: AlertAppearance = 'soft';
  @Input() dismissed: boolean = false;
  @Input() dismissible: boolean = false;
  @Input() name: string = this._utilsService.randomId();
  @Input() showIcon: boolean = true;
  @Input() type: AlertType = 'primary';
  @Output() readonly dismissedChanged: EventEmitter<boolean> =
                       new EventEmitter<boolean>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _alertService: AlertService,
    private _utilsService: UtilsService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  @HostBinding('class') get classList(): any {
    /* eslint-disable @typescript-eslint/naming-convention */
    return {
      'alert-appearance-border' : this.appearance === 'border',
      'alert-appearance-fill'   : this.appearance === 'fill',
      'alert-appearance-outline': this.appearance === 'outline',
      'alert-appearance-soft'   : this.appearance === 'soft',
      'alert-dismissed'         : this.dismissed,
      'alert-dismissible'       : this.dismissible,
      'alert-show-icon'         : this.showIcon,
      'alert-type-primary'      : this.type === 'primary',
      'alert-type-accent'       : this.type === 'accent',
      'alert-type-warn'         : this.type === 'warn',
      'alert-type-basic'        : this.type === 'basic',
      'alert-type-info'         : this.type === 'info',
      'alert-type-success'      : this.type === 'success',
      'alert-type-warning'      : this.type === 'warning',
      'alert-type-error'        : this.type === 'error'
    };
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On changes
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('dismissed' in changes) {
      this.dismissed = coerceBooleanProperty(
        changes.dismissed.currentValue
      );

      // Показать / скрыть алерт
      this._toggleDismiss(this.dismissed);
    }

    if ('dismissible' in changes) {
      this.dismissible = coerceBooleanProperty(
        changes.dismissible.currentValue
      );
    }

    if ('showIcon' in changes) {
      this.showIcon = coerceBooleanProperty(
        changes.showIcon.currentValue
      );
    }
  }

  ngOnInit(): void {
    this._alertService.onShow
      .pipe(
        filter((name) => this.name === name),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.show();
      });

    this._alertService.onDismiss
      .pipe(
        filter((name) => this.name === name),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.dismiss();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  dismiss(): void {
    if (this.dismissed) {
      return;
    }
    this._toggleDismiss(true);
  }

  /**
   * Show the dismissed alert
   */
  show(): void {
    if (!this.dismissed) {
      return;
    }

    this._toggleDismiss(false);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _toggleDismiss(dismissed: boolean): void {
    if (!this.dismissible) {
      return;
    }

    this.dismissed = dismissed;
    this.dismissedChanged.next(this.dismissed);

    this._changeDetectorRef.markForCheck();
  }
}