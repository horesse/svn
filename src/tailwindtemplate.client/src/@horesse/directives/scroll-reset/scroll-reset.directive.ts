import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Directive({
  selector  : '[scrollReset]',
  exportAs  : 'scrollReset',
  standalone: true
})
export class ScrollResetDirective implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(private _elementRef: ElementRef, private _router: Router) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Жизненный цикл
  // -----------------------------------------------------------------------------------------------------

  /**
   * При инициализации
   */
  ngOnInit(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this._elementRef.nativeElement.scrollTop = 0;
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
