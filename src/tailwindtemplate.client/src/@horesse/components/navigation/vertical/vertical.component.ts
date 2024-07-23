import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { animations } from '@horesse/animations';
import { NavigationService } from '@horesse/components/navigation/navigation.service';
import { NavigationItem, VerticalNavigationAppearance, VerticalNavigationMode, VerticalNavigationPosition } from '@horesse/components/navigation/navigation.types';
import { VerticalNavigationAsideItemComponent } from '@horesse/components/navigation/vertical/components/aside/aside.component';
import { VerticalNavigationBasicItemComponent } from '@horesse/components/navigation/vertical/components/basic/basic.component';
import { VerticalNavigationCollapsableItemComponent } from '@horesse/components/navigation/vertical/components/collapsable/collapsable.component';
import { VerticalNavigationDividerItemComponent } from '@horesse/components/navigation/vertical/components/divider/divider.component';
import { VerticalNavigationGroupItemComponent } from '@horesse/components/navigation/vertical/components/group/group.component';
import { VerticalNavigationSpacerItemComponent } from '@horesse/components/navigation/vertical/components/spacer/spacer.component';
import { ScrollbarDirective } from '@horesse/directives/scrollbar/scrollbar.directive';
import { UtilsService } from '@horesse/services/utils/utils.service';
import { delay, filter, merge, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector       : 'vertical-navigation',
  templateUrl    : './vertical.component.html',
  styleUrls      : ['./vertical.component.scss'],
  animations     : animations,
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs       : 'VerticalNavigation',
  standalone     : true,
  imports        : [
    ScrollbarDirective,
    NgFor,
    NgIf,
    VerticalNavigationAsideItemComponent,
    VerticalNavigationBasicItemComponent,
    VerticalNavigationCollapsableItemComponent,
    VerticalNavigationDividerItemComponent,
    VerticalNavigationGroupItemComponent,
    VerticalNavigationSpacerItemComponent
  ]
})
export class VerticalNavigationComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_inner: BooleanInput;
  static ngAcceptInputType_opened: BooleanInput;
  static ngAcceptInputType_transparentOverlay: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() appearance: VerticalNavigationAppearance = 'default';
  @Input() autoCollapse: boolean = true;
  @Input() inner: boolean = false;
  @Input() mode: VerticalNavigationMode = 'side';
  @Input() name: string = this._UtilsService.randomId();
  @Input() navigation: NavigationItem[];
  @Input() opened: boolean = true;
  @Input() position: VerticalNavigationPosition = 'left';
  @Input() transparentOverlay: boolean = false;
  @Output() readonly appearanceChanged: EventEmitter<VerticalNavigationAppearance> = new EventEmitter<VerticalNavigationAppearance>();
  @Output() readonly modeChanged: EventEmitter<VerticalNavigationMode> = new EventEmitter<VerticalNavigationMode>();
  @Output() readonly openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly positionChanged: EventEmitter<VerticalNavigationPosition> = new EventEmitter<VerticalNavigationPosition>();
  @ViewChild('navigationContent') private _navigationContentEl: ElementRef;

  activeAsideItemId: string | null = null;
  onCollapsableItemCollapsed: ReplaySubject<NavigationItem> = new ReplaySubject<NavigationItem>(1);
  onCollapsableItemExpanded: ReplaySubject<NavigationItem> = new ReplaySubject<NavigationItem>(1);
  onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private _animationsEnabled: boolean = false;
  private _asideOverlay: HTMLElement;
  private readonly _handleAsideOverlayClick: any;
  private readonly _handleOverlayClick: any;
  private _hovered: boolean = false;
  private _mutationObserver: MutationObserver;
  private _overlay: HTMLElement;
  private _player: AnimationPlayer;
  private _scrollStrategy: ScrollStrategy = this._scrollStrategyOptions.block();
  private _ScrollbarDirectives!: QueryList<ScrollbarDirective>;
  private _ScrollbarDirectivesSubscription: Subscription;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _animationBuilder: AnimationBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: Document,
    private _elementRef: ElementRef,
    private _renderer2: Renderer2,
    private _router: Router,
    private _scrollStrategyOptions: ScrollStrategyOptions,
    private _NavigationService: NavigationService,
    private _UtilsService: UtilsService
  ) {
    this._handleAsideOverlayClick = (): void => {
      this.closeAside();
    };
    this._handleOverlayClick = (): void => {
      this.close();
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Host binding for component classes
   */
  @HostBinding('class') get classList(): any {
    /* eslint-disable @typescript-eslint/naming-convention */
    return {
      'vertical-navigation-animations-enabled'             : this._animationsEnabled,
      [`vertical-navigation-appearance-${this.appearance}`]: true,
      'vertical-navigation-hover'                          : this._hovered,
      'vertical-navigation-inner'                          : this.inner,
      'vertical-navigation-mode-over'                      : this.mode === 'over',
      'vertical-navigation-mode-side'                      : this.mode === 'side',
      'vertical-navigation-opened'                         : this.opened,
      'vertical-navigation-position-left'                  : this.position === 'left',
      'vertical-navigation-position-right'                 : this.position === 'right'
    };
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  /**
   * Host binding for component inline styles
   */
  @HostBinding('style') get styleList(): any {
    return {
      visibility: this.opened ? 'visible' : 'hidden'
    };
  }

  /**
   * Setter for ScrollbarDirectives
   */
  @ViewChildren(ScrollbarDirective)
  set ScrollbarDirectives(ScrollbarDirectives: QueryList<ScrollbarDirective>) {
    // Store the directives
    this._ScrollbarDirectives = ScrollbarDirectives;

    // Return if there are no directives
    if (ScrollbarDirectives.length === 0) {
      return;
    }

    // Unsubscribe the previous subscriptions
    if (this._ScrollbarDirectivesSubscription) {
      this._ScrollbarDirectivesSubscription.unsubscribe();
    }

    // Update the scrollbars on collapsable items' collapse/expand
    this._ScrollbarDirectivesSubscription = merge(this.onCollapsableItemCollapsed, this.onCollapsableItemExpanded)
      .pipe(takeUntil(this._unsubscribeAll), delay(250))
      .subscribe(() => {
        // Loop through the scrollbars and update them
        ScrollbarDirectives.forEach((ScrollbarDirective) => {
          ScrollbarDirective.update();
        });
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Decorated methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On mouseenter
   *
   * @private
   */
  @HostListener('mouseenter')
  private _onMouseenter(): void {
    // Enable the animations
    this._enableAnimations();

    // Set the hovered
    this._hovered = true;
  }

  /**
   * On mouseleave
   *
   * @private
   */
  @HostListener('mouseleave')
  private _onMouseleave(): void {
    // Enable the animations
    this._enableAnimations();

    // Set the hovered
    this._hovered = false;
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
    // Appearance
    if ('appearance' in changes) {
      // Execute the observable
      this.appearanceChanged.next(changes.appearance.currentValue);
    }

    // Inner
    if ('inner' in changes) {
      // Coerce the value to a boolean
      this.inner = coerceBooleanProperty(changes.inner.currentValue);
    }

    // Mode
    if ('mode' in changes) {
      // Get the previous and current values
      const currentMode = changes.mode.currentValue;
      const previousMode = changes.mode.previousValue;

      // Disable the animations
      this._disableAnimations();

      // If the mode changes: 'over -> side'
      if (previousMode === 'over' && currentMode === 'side') {
        // Hide the overlay
        this._hideOverlay();
      }

      // If the mode changes: 'side -> over'
      if (previousMode === 'side' && currentMode === 'over') {
        // Close the aside
        this.closeAside();

        // If the navigation is opened
        if (this.opened) {
          // Show the overlay
          this._showOverlay();
        }
      }

      // Execute the observable
      this.modeChanged.next(currentMode);

      // Enable the animations after a delay
      // The delay must be bigger than the current transition-duration
      // to make sure nothing will be animated while the mode changing
      setTimeout(() => {
        this._enableAnimations();
      }, 500);
    }

    // Navigation
    if ('navigation' in changes) {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    }

    // Opened
    if ('opened' in changes) {
      // Coerce the value to a boolean
      this.opened = coerceBooleanProperty(changes.opened.currentValue);

      // Open/close the navigation
      this._toggleOpened(this.opened);
    }

    // Position
    if ('position' in changes) {
      // Execute the observable
      this.positionChanged.next(changes.position.currentValue);
    }

    // Transparent overlay
    if ('transparentOverlay' in changes) {
      // Coerce the value to a boolean
      this.transparentOverlay = coerceBooleanProperty(changes.transparentOverlay.currentValue);
    }
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Make sure the name input is not an empty string
    if (this.name === '') {
      this.name = this._UtilsService.randomId();
    }

    // Register the navigation component
    this._NavigationService.registerComponent(this.name, this);

    // Subscribe to the 'NavigationEnd' event
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        // If the mode is 'over' and the navigation is opened...
        if (this.mode === 'over' && this.opened) {
          // Close the navigation
          this.close();
        }

        // If the mode is 'side' and the aside is active...
        if (this.mode === 'side' && this.activeAsideItemId) {
          // Close the aside
          this.closeAside();
        }
      });
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    // Fix for Firefox.
    //
    // Because 'position: sticky' doesn't work correctly inside a 'position: fixed' parent,
    // adding the '.cdk-global-scrollblock' to the html element breaks the navigation's position.
    // This fixes the problem by reading the 'top' value from the html element and adding it as a
    // 'marginTop' to the navigation itself.
    this._mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const mutationTarget = mutation.target as HTMLElement;
        if (mutation.attributeName === 'class') {
          if (mutationTarget.classList.contains('cdk-global-scrollblock')) {
            const top = parseInt(mutationTarget.style.top, 10);
            this._renderer2.setStyle(this._elementRef.nativeElement, 'margin-top', `${Math.abs(top)}px`);
          } else {
            this._renderer2.setStyle(this._elementRef.nativeElement, 'margin-top', null);
          }
        }
      });
    });
    this._mutationObserver.observe(this._document.documentElement, {
      attributes     : true,
      attributeFilter: ['class']
    });

    setTimeout(() => {
      // Return if 'navigation content' element does not exist
      if (!this._navigationContentEl) {
        return;
      }

      // If 'navigation content' element doesn't have
      // perfect scrollbar activated on it...
      if (!this._navigationContentEl.nativeElement.classList.contains('ps')) {
        // Find the active item
        const activeItem = this._navigationContentEl.nativeElement.querySelector('.-vertical-navigation-item-active');

        // If the active item exists, scroll it into view
        if (activeItem) {
          activeItem.scrollIntoView();
        }
      }
      // Otherwise
      else {
        // Go through all the scrollbar directives
        this._ScrollbarDirectives.forEach((ScrollbarDirective) => {
          // Skip if not enabled
          if (!ScrollbarDirective.isEnabled()) {
            return;
          }

          // Scroll to the active element
          ScrollbarDirective.scrollToElement('.-vertical-navigation-item-active', -120, true);
        });
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Disconnect the mutation observer
    this._mutationObserver.disconnect();

    // Forcefully close the navigation and aside in case they are opened
    this.close();
    this.closeAside();

    // Deregister the navigation component from the registry
    this._NavigationService.deregisterComponent(this.name);

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Refresh the component to apply the changes
   */
  refresh(): void {
    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Execute the observable
    this.onRefreshed.next(true);
  }

  /**
   * Open the navigation
   */
  open(): void {
    // Return if the navigation is already open
    if (this.opened) {
      return;
    }

    // Set the opened
    this._toggleOpened(true);
  }

  /**
   * Close the navigation
   */
  close(): void {
    // Return if the navigation is already closed
    if (!this.opened) {
      return;
    }

    // Close the aside
    this.closeAside();

    // Set the opened
    this._toggleOpened(false);
  }

  /**
   * Toggle the navigation
   */
  toggle(): void {
    // Toggle
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open the aside
   *
   * @param item
   */
  openAside(item: NavigationItem): void {
    // Return if the item is disabled
    if (item.disabled || !item.id) {
      return;
    }

    // Open
    this.activeAsideItemId = item.id;

    // Show the aside overlay
    this._showAsideOverlay();

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Close the aside
   */
  closeAside(): void {
    // Close
    this.activeAsideItemId = null;

    // Hide the aside overlay
    this._hideAsideOverlay();

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle the aside
   *
   * @param item
   */
  toggleAside(item: NavigationItem): void {
    // Toggle
    if (this.activeAsideItemId === item.id) {
      this.closeAside();
    } else {
      this.openAside(item);
    }
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

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Enable the animations
   *
   * @private
   */
  private _enableAnimations(): void {
    // Return if the animations are already enabled
    if (this._animationsEnabled) {
      return;
    }

    // Enable the animations
    this._animationsEnabled = true;
  }

  /**
   * Disable the animations
   *
   * @private
   */
  private _disableAnimations(): void {
    // Return if the animations are already disabled
    if (!this._animationsEnabled) {
      return;
    }

    // Disable the animations
    this._animationsEnabled = false;
  }

  /**
   * Show the overlay
   *
   * @private
   */
  private _showOverlay(): void {
    // Return if there is already an overlay
    if (this._asideOverlay) {
      return;
    }

    // Create the overlay element
    this._overlay = this._renderer2.createElement('div');

    // Add a class to the overlay element
    this._overlay.classList.add('-vertical-navigation-overlay');

    // Add a class depending on the transparentOverlay option
    if (this.transparentOverlay) {
      this._overlay.classList.add('-vertical-navigation-overlay-transparent');
    }

    // Append the overlay to the parent of the navigation
    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay);

    // Enable block scroll strategy
    this._scrollStrategy.enable();

    // Create the enter animation and attach it to the player
    this._player = this._animationBuilder.build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))]).create(this._overlay);

    // Play the animation
    this._player.play();

    // Add an event listener to the overlay
    this._overlay.addEventListener('click', this._handleOverlayClick);
  }

  /**
   * Hide the overlay
   *
   * @private
   */
  private _hideOverlay(): void {
    if (!this._overlay) {
      return;
    }

    // Create the leave animation and attach it to the player
    this._player = this._animationBuilder.build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))]).create(this._overlay);

    // Play the animation
    this._player.play();

    // Once the animation is done...
    this._player.onDone(() => {
      // If the overlay still exists...
      if (this._overlay) {
        // Remove the event listener
        this._overlay.removeEventListener('click', this._handleOverlayClick);

        // Remove the overlay
        this._overlay.parentNode.removeChild(this._overlay);
        this._overlay = null;
      }

      // Disable block scroll strategy
      this._scrollStrategy.disable();
    });
  }

  /**
   * Show the aside overlay
   *
   * @private
   */
  private _showAsideOverlay(): void {
    // Return if there is already an overlay
    if (this._asideOverlay) {
      return;
    }

    // Create the aside overlay element
    this._asideOverlay = this._renderer2.createElement('div');

    // Add a class to the aside overlay element
    this._asideOverlay.classList.add('-vertical-navigation-aside-overlay');

    // Append the aside overlay to the parent of the navigation
    this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._asideOverlay);

    // Create the enter animation and attach it to the player
    this._player = this._animationBuilder.build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))]).create(this._asideOverlay);

    // Play the animation
    this._player.play();

    // Add an event listener to the aside overlay
    this._asideOverlay.addEventListener('click', this._handleAsideOverlayClick);
  }

  /**
   * Hide the aside overlay
   *
   * @private
   */
  private _hideAsideOverlay(): void {
    if (!this._asideOverlay) {
      return;
    }

    // Create the leave animation and attach it to the player
    this._player = this._animationBuilder.build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))]).create(this._asideOverlay);

    // Play the animation
    this._player.play();

    // Once the animation is done...
    this._player.onDone(() => {
      // If the aside overlay still exists...
      if (this._asideOverlay) {
        // Remove the event listener
        this._asideOverlay.removeEventListener('click', this._handleAsideOverlayClick);

        // Remove the aside overlay
        this._asideOverlay.parentNode.removeChild(this._asideOverlay);
        this._asideOverlay = null;
      }
    });
  }

  /**
   * Open/close the navigation
   *
   * @param open
   * @private
   */
  private _toggleOpened(open: boolean): void {
    // Set the opened
    this.opened = open;

    // Enable the animations
    this._enableAnimations();

    // If the navigation opened, and the mode
    // is 'over', show the overlay
    if (this.mode === 'over') {
      if (this.opened) {
        this._showOverlay();
      } else {
        this._hideOverlay();
      }
    }

    // Execute the observable
    this.openedChanged.next(open);
  }
}
