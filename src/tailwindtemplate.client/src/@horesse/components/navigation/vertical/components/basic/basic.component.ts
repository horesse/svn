import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '@horesse/components/navigation/navigation.service';
import { NavigationItem } from '@horesse/components/navigation/navigation.types';
import { VerticalNavigationComponent } from '@horesse/components/navigation/vertical/vertical.component';
import { UtilsService } from '@horesse/services/utils/utils.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'vertical-navigation-basic-item',
  templateUrl    : './basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [NgClass, NgIf, RouterLink, RouterLinkActive, MatTooltipModule, NgTemplateOutlet, MatIconModule]
})
export class VerticalNavigationBasicItemComponent implements OnInit, OnDestroy {
  @Input() item: NavigationItem;
  @Input() name: string;

  isActiveMatchOptions: IsActiveMatchOptions;
  private _verticalNavigationComponent: VerticalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _NavigationService: NavigationService,
    private _UtilsService: UtilsService
  ) {
    this.isActiveMatchOptions = this._UtilsService.subsetMatchOptions;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Жизненный цикл
  // -----------------------------------------------------------------------------------------------------

  /**
   * При инициализации
   */
  ngOnInit(): void {
    this.isActiveMatchOptions =
      this.item.isActiveMatchOptions ?? this.item.exactMatch ? this._UtilsService.exactMatchOptions : this._UtilsService.subsetMatchOptions;

    this._verticalNavigationComponent = this._NavigationService.getComponent(this.name);

    this._changeDetectorRef.markForCheck();

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
}
