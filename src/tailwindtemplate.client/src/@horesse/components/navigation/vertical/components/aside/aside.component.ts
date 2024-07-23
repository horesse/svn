import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationService } from '@horesse/components/navigation/navigation.service';
import { NavigationItem } from '@horesse/components/navigation/navigation.types';
import { VerticalNavigationBasicItemComponent } from '@horesse/components/navigation/vertical/components/basic/basic.component';
import { VerticalNavigationCollapsableItemComponent } from '@horesse/components/navigation/vertical/components/collapsable/collapsable.component';
import { VerticalNavigationDividerItemComponent } from '@horesse/components/navigation/vertical/components/divider/divider.component';
import { VerticalNavigationGroupItemComponent } from '@horesse/components/navigation/vertical/components/group/group.component';
import { VerticalNavigationSpacerItemComponent } from '@horesse/components/navigation/vertical/components/spacer/spacer.component';
import { VerticalNavigationComponent } from '@horesse/components/navigation/vertical/vertical.component';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'vertical-navigation-aside-item',
  templateUrl    : './aside.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [
    NgClass,
    MatTooltipModule,
    NgIf,
    MatIconModule,
    NgFor,
    VerticalNavigationBasicItemComponent,
    VerticalNavigationCollapsableItemComponent,
    VerticalNavigationDividerItemComponent,
    VerticalNavigationGroupItemComponent,
    VerticalNavigationSpacerItemComponent
  ]
})
export class VerticalNavigationAsideItemComponent implements OnChanges, OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_autoCollapse: BooleanInput;
  static ngAcceptInputType_skipChildren: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() activeItemId: string;
  @Input() autoCollapse: boolean;
  @Input() item: NavigationItem;
  @Input() name: string;
  @Input() skipChildren: boolean;

  active: boolean = false;
  private _VerticalNavigationComponent: VerticalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _router: Router, private _NavigationService: NavigationService) {
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
    // Active item id
    if ('activeItemId' in changes) {
      // Mark if active
      this._markIfActive(this._router.url);
    }
  }

  /**
   * При инициализации
   */
  ngOnInit(): void {
    this._markIfActive(this._router.url);

    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((event: NavigationEnd) => {
        this._markIfActive(event.urlAfterRedirects);
      });

    this._VerticalNavigationComponent = this._NavigationService.getComponent(this.name);

    this._VerticalNavigationComponent.onRefreshed.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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

  // -----------------------------------------------------------------------------------------------------
  // @ Приватные методы
  // -----------------------------------------------------------------------------------------------------

  /**
   * Имеет ли данный элемент указанный URL-адрес в одном из своих дочерних элементов.
   *
   * @param item
   * @param currentUrl
   * @private
   */
  private _hasActiveChild(item: NavigationItem, currentUrl: string): boolean {
    const children = item.children;

    if (!children) {
      return false;
    }

    for (const child of children) {
      if (child.children) {
        if (this._hasActiveChild(child, currentUrl)) {
          return true;
        }
      }

      if (child.type !== 'basic') {
        continue;
      }

      if (child.link && this._router.isActive(child.link, child.exactMatch || false)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Активен ли элемент
   *
   * @private
   */
  private _markIfActive(currentUrl: string): void {
    this.active = this.activeItemId === this.item.id;

    if (this._hasActiveChild(this.item, currentUrl)) {
      this.active = true;
    }

    this._changeDetectorRef.markForCheck();
  }
}
