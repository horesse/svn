import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '@horesse/components/navigation/navigation.service';
import { NavigationItem } from '@horesse/components/navigation/navigation.types';
import { VerticalNavigationBasicItemComponent } from '@horesse/components/navigation/vertical/components/basic/basic.component';
import { VerticalNavigationCollapsableItemComponent } from '@horesse/components/navigation/vertical/components/collapsable/collapsable.component';
import { VerticalNavigationDividerItemComponent } from '@horesse/components/navigation/vertical/components/divider/divider.component';
import { VerticalNavigationSpacerItemComponent } from '@horesse/components/navigation/vertical/components/spacer/spacer.component';
import { VerticalNavigationComponent } from '@horesse/components/navigation/vertical/vertical.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'vertical-navigation-group-item',
  templateUrl    : './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [
    NgClass,
    NgIf,
    MatIconModule,
    NgFor,
    VerticalNavigationBasicItemComponent,
    VerticalNavigationCollapsableItemComponent,
    VerticalNavigationDividerItemComponent,
    forwardRef(() => VerticalNavigationGroupItemComponent),
    VerticalNavigationSpacerItemComponent
  ]
})
export class VerticalNavigationGroupItemComponent implements OnInit, OnDestroy {
  static ngAcceptInputType_autoCollapse: BooleanInput;

  @Input() autoCollapse: boolean;
  @Input() item: NavigationItem;
  @Input() name: string;

  private _verticalNavigationComponent: VerticalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _NavigationService: NavigationService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Жизненный цикл
  // -----------------------------------------------------------------------------------------------------

  /**
   * При инициализации
   */
  ngOnInit(): void {
    this._verticalNavigationComponent = this._NavigationService.getComponent(this.name);

    this._verticalNavigationComponent.onRefreshed.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * При закрытии
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Публичные методы
  // -----------------------------------------------------------------------------------------------------

  /**
   * Отслеживание по функции для циклов ngFor
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
