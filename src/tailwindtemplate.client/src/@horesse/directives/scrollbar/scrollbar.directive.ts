import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollbarGeometry, ScrollbarPosition } from '@horesse/directives/scrollbar/scrollbar.types';
import { merge } from 'lodash-es';
import PerfectScrollbar from 'perfect-scrollbar';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

/**
 * Wrapper directive for the Perfect Scrollbar: https://github.com/mdbootstrap/perfect-scrollbar
 */
@Directive({
  selector  : '[Scrollbar]',
  exportAs  : 'Scrollbar',
  standalone: true
})
export class ScrollbarDirective implements OnChanges, OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_fuseScrollbar: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() scrollbar: boolean = true;
  @Input() scrollbarOptions: PerfectScrollbar.Options;

  private _animation: number;
  private _options: PerfectScrollbar.Options;
  private _ps: PerfectScrollbar;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(private _elementRef: ElementRef, private _platform: Platform, private _router: Router) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Методы данных
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter для _elementRef
   */
  get elementRef(): ElementRef {
    return this._elementRef;
  }

  /**
   * Getter для _ps
   */
  get ps(): PerfectScrollbar | null {
    return this._ps;
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
    // Включено
    if ('Scrollbar' in changes) {
      this.scrollbar = coerceBooleanProperty(changes.fuseScrollbar.currentValue);

      if (this.scrollbar) {
        this._init();
      } else {
        this._destroy();
      }
    }

    if ('ScrollbarOptions' in changes) {
      this._options = merge({}, this._options, changes.fuseScrollbarOptions.currentValue);

      if (!this._ps) {
        return;
      }

      setTimeout(() => {
        this._destroy();
      });

      setTimeout(() => {
        this._init();
      });
    }
  }

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this._unsubscribeAll), debounceTime(150))
      .subscribe(() => {
        this.update();
      });
  }

  ngOnDestroy(): void {
    this._destroy();

    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Публичные методы
  // -----------------------------------------------------------------------------------------------------

  isEnabled(): boolean {
    return this.scrollbar;
  }

  update(): void {
    if (!this._ps) {
      return;
    }

    this._ps.update();
  }

  destroy(): void {
    this.ngOnDestroy();
  }

  geometry(prefix: string = 'scroll'): ScrollbarGeometry {
    return new ScrollbarGeometry(
      this._elementRef.nativeElement[prefix + 'Left'],
      this._elementRef.nativeElement[prefix + 'Top'],
      this._elementRef.nativeElement[prefix + 'Width'],
      this._elementRef.nativeElement[prefix + 'Height']
    );
  }

  position(absolute: boolean = false): ScrollbarPosition {
    let scrollbarPosition;

    if (!absolute && this._ps) {
      scrollbarPosition = new ScrollbarPosition(this._ps.reach.x || 0, this._ps.reach.y || 0);
    } else {
      scrollbarPosition = new ScrollbarPosition(this._elementRef.nativeElement.scrollLeft, this._elementRef.nativeElement.scrollTop);
    }

    return scrollbarPosition;
  }

  scrollTo(x: number, y?: number, speed?: number): void {
    if (y == null && speed == null) {
      this.animateScrolling('scrollTop', x, speed);
    } else {
      if (x != null) {
        this.animateScrolling('scrollLeft', x, speed);
      }

      if (y != null) {
        this.animateScrolling('scrollTop', y, speed);
      }
    }
  }

  scrollToX(x: number, speed?: number): void {
    this.animateScrolling('scrollLeft', x, speed);
  }

  scrollToY(y: number, speed?: number): void {
    this.animateScrolling('scrollTop', y, speed);
  }

  scrollToTop(offset: number = 0, speed?: number): void {
    this.animateScrolling('scrollTop', offset, speed);
  }

  scrollToBottom(offset: number = 0, speed?: number): void {
    const top = this._elementRef.nativeElement.scrollHeight - this._elementRef.nativeElement.clientHeight;
    this.animateScrolling('scrollTop', top - offset, speed);
  }

  scrollToLeft(offset: number = 0, speed?: number): void {
    this.animateScrolling('scrollLeft', offset, speed);
  }

  scrollToRight(offset: number = 0, speed?: number): void {
    const left = this._elementRef.nativeElement.scrollWidth - this._elementRef.nativeElement.clientWidth;
    this.animateScrolling('scrollLeft', left - offset, speed);
  }

  scrollToElement(qs: string, offset: number = 0, ignoreVisible: boolean = false, speed?: number): void {
    const element = this._elementRef.nativeElement.querySelector(qs);

    if (!element) {
      return;
    }

    const elementPos = element.getBoundingClientRect();
    const scrollerPos = this._elementRef.nativeElement.getBoundingClientRect();

    if (this._elementRef.nativeElement.classList.contains('ps--active-x')) {
      if (ignoreVisible && elementPos.right <= scrollerPos.right - Math.abs(offset)) {
        return;
      }

      const currentPos = this._elementRef.nativeElement['scrollLeft'];
      const position = elementPos.left - scrollerPos.left + currentPos;

      this.animateScrolling('scrollLeft', position + offset, speed);
    }

    if (this._elementRef.nativeElement.classList.contains('ps--active-y')) {
      if (ignoreVisible && elementPos.bottom <= scrollerPos.bottom - Math.abs(offset)) {
        return;
      }

      const currentPos = this._elementRef.nativeElement['scrollTop'];
      const position = elementPos.top - scrollerPos.top + currentPos;

      this.animateScrolling('scrollTop', position + offset, speed);
    }
  }

  /**
   * Animate scrolling
   *
   * @param target
   * @param value
   * @param speed
   */
  animateScrolling(target: string, value: number, speed?: number): void {
    if (this._animation) {
      window.cancelAnimationFrame(this._animation);
      this._animation = null;
    }

    if (!speed || typeof window === 'undefined') {
      this._elementRef.nativeElement[target] = value;
    } else if (value !== this._elementRef.nativeElement[target]) {
      let newValue = 0;
      let scrollCount = 0;

      let oldTimestamp = performance.now();
      let oldValue = this._elementRef.nativeElement[target];

      const cosParameter = (oldValue - value) / 2;

      const step = (newTimestamp: number): void => {
        scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));
        newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

        // Only continue animation if scroll position has not changed
        if (this._elementRef.nativeElement[target] === oldValue) {
          if (scrollCount >= Math.PI) {
            this.animateScrolling(target, value, 0);
          } else {
            this._elementRef.nativeElement[target] = newValue;

            // On a zoomed out page the resulting offset may differ
            oldValue = this._elementRef.nativeElement[target];
            oldTimestamp = newTimestamp;

            this._animation = window.requestAnimationFrame(step);
          }
        }
      };

      window.requestAnimationFrame(step);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Приватные методы
  // -----------------------------------------------------------------------------------------------------

  private _init(): void {
    if (this._ps) {
      return;
    }

    if (this._platform.ANDROID || this._platform.IOS || !this._platform.isBrowser) {
      this.scrollbar = false;
      return;
    }

    this._ps = new PerfectScrollbar(this._elementRef.nativeElement, { ...this._options });
  }

  private _destroy(): void {
    if (!this._ps) {
      return;
    }

    this._ps.destroy();

    this._ps = null;
  }
}
