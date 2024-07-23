import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { animations } from '@horesse/animations';
import { NavigationService } from '@horesse/components/navigation/navigation.service';
import { NavigationItem } from '@horesse/components/navigation/navigation.types';
import { VerticalNavigationBasicItemComponent } from '@horesse/components/navigation/vertical/components/basic/basic.component';
import { VerticalNavigationDividerItemComponent } from '@horesse/components/navigation/vertical/components/divider/divider.component';
import { VerticalNavigationGroupItemComponent } from '@horesse/components/navigation/vertical/components/group/group.component';
import { VerticalNavigationSpacerItemComponent } from '@horesse/components/navigation/vertical/components/spacer/spacer.component';
import { VerticalNavigationComponent } from '@horesse/components/navigation/vertical/vertical.component';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'vertical-navigation-collapsable-item',
  templateUrl    : './collapsable.component.html',
  animations     : animations,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [
    NgClass,
    MatTooltipModule,
    NgIf,
    MatIconModule,
    NgFor,
    VerticalNavigationBasicItemComponent,
    forwardRef(() => VerticalNavigationCollapsableItemComponent),
    VerticalNavigationDividerItemComponent,
    VerticalNavigationGroupItemComponent,
    VerticalNavigationSpacerItemComponent
  ]
})
export class VerticalNavigationCollapsableItemComponent implements OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_autoCollapse: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() autoCollapse: boolean;
  @Input() item: NavigationItem;
  @Input() name: string;

  isCollapsed: boolean = true;
  isExpanded: boolean = false;
  private _verticalNavigationComponent: VerticalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _router: Router, private _NavigationService: NavigationService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Методы данных
  // -----------------------------------------------------------------------------------------------------

  /**
   * Привязка хоста для классов компонентов
   */
  @HostBinding('class') get classList(): any {
    /* eslint-disable @typescript-eslint/naming-convention */
    return {
      'vertical-navigation-item-collapsed': this.isCollapsed,
      'vertical-navigation-item-expanded' : this.isExpanded
    };
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Жизненный цикл
  // -----------------------------------------------------------------------------------------------------

  /**
   * При инициализации
   */
  ngOnInit(): void {
    this._verticalNavigationComponent = this._NavigationService.getComponent(this.name);

    if (this._hasActiveChild(this.item, this._router.url)) {
      this.expand();
    } else {
      if (this.autoCollapse) {
        this.collapse();
      }
    }

    this._verticalNavigationComponent.onCollapsableItemCollapsed.pipe(takeUntil(this._unsubscribeAll)).subscribe((collapsedItem) => {
      if (collapsedItem === null) {
        return;
      }

      if (this._isChildrenOf(collapsedItem, this.item)) {
        this.collapse();
      }
    });

    if (this.autoCollapse) {
      this._verticalNavigationComponent.onCollapsableItemExpanded.pipe(takeUntil(this._unsubscribeAll)).subscribe((expandedItem) => {
        if (expandedItem === null) {
          return;
        }

        if (this._isChildrenOf(this.item, expandedItem)) {
          return;
        }

        if (this._hasActiveChild(this.item, this._router.url)) {
          return;
        }

        if (this.item === expandedItem) {
          return;
        }

        this.collapse();
      });
    }

    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((event: NavigationEnd) => {
        if (this._hasActiveChild(this.item, event.urlAfterRedirects)) {
          this.expand();
        } else {
          if (this.autoCollapse) {
            this.collapse();
          }
        }
      });

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
   * Collapse
   */
  collapse(): void {
    if (this.item.disabled) {
      return;
    }

    if (this.isCollapsed) {
      return;
    }

    this.isCollapsed = true;
    this.isExpanded = !this.isCollapsed;

    this._changeDetectorRef.markForCheck();

    this._verticalNavigationComponent.onCollapsableItemCollapsed.next(this.item);
  }

  /**
   * Expand
   */
  expand(): void {
    if (this.item.disabled) {
      return;
    }

    if (!this.isCollapsed) {
      return;
    }

    this.isCollapsed = false;
    this.isExpanded = !this.isCollapsed;

    this._changeDetectorRef.markForCheck();

    this._verticalNavigationComponent.onCollapsableItemExpanded.next(this.item);
  }

  /**
   * Переключить
   */
  toggleCollapsable(): void {
    if (this.isCollapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }

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

      if (child.link && this._router.isActive(child.link, child.exactMatch || false)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Является ли это дочерним элементом данного элемента
   *
   * @param parent
   * @param item
   * @private
   */
  private _isChildrenOf(parent: NavigationItem, item: NavigationItem): boolean {
    const children = parent.children;

    if (!children) {
      return false;
    }

    if (children.indexOf(item) > -1) {
      return true;
    }

    for (const child of children) {
      if (child.children) {
        if (this._isChildrenOf(child, item)) {
          return true;
        }
      }
    }

    return false;
  }
}
