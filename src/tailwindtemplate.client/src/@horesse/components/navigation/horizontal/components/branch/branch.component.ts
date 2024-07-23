import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HorizontalNavigationBasicItemComponent } from '@horesse/components/navigation/horizontal/components/basic/basic.component';
import { HorizontalNavigationDividerItemComponent } from '@horesse/components/navigation/horizontal/components/divider/divider.component';
import { HorizontalNavigationComponent } from '@horesse/components/navigation/horizontal/horizontal.component';
import { NavigationService } from '@horesse/components/navigation/navigation.service';
import { NavigationItem } from '@horesse/components/navigation/navigation.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'horizontal-navigation-branch-item',
  templateUrl    : './branch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [
    NgIf,
    NgClass,
    MatMenuModule,
    NgTemplateOutlet,
    NgFor,
    HorizontalNavigationBasicItemComponent,
    forwardRef(() => HorizontalNavigationBranchItemComponent),
    HorizontalNavigationDividerItemComponent,
    MatTooltipModule,
    MatIconModule
  ]
})
export class HorizontalNavigationBranchItemComponent implements OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_child: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() child: boolean = false;
  @Input() item: NavigationItem;
  @Input() name: string;
  @ViewChild('matMenu', { static: true }) matMenu: MatMenu;

  private _horizontalNavigationComponent: HorizontalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _NavigationService: NavigationService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the parent navigation component
    this._horizontalNavigationComponent = this._NavigationService.getComponent(this.name);

    // Subscribe to onRefreshed on the navigation component
    this._horizontalNavigationComponent.onRefreshed.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Trigger the change detection
   */
  triggerChangeDetection(): void {
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
