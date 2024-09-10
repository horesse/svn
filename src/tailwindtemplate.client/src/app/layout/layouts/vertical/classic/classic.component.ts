import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LoadingBarComponent } from '@horesse/components/loading-bar';
import { NavigationService as MenuNavigationService, VerticalNavigationComponent } from '@horesse/components/navigation';
import { MediaWatcherService } from '@horesse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LogoComponent } from 'app/layout/common/logo/logo.component';
import { SchemeComponent } from 'app/layout/common/scheme/scheme.component';
import { SettingsComponent } from 'app/layout/common/settings/settings.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector     : 'classic-layout',
  templateUrl  : './classic.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone   : true,
  imports      : [
    VerticalNavigationComponent,
    RouterOutlet,
    NgIf,
    MatIconModule,
    MatButtonModule,
    LoadingBarComponent,
    LogoComponent,
    SchemeComponent,
    UserComponent,
    SettingsComponent
  ]
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  navigation: Navigation;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _navigationService: NavigationService,
    private _mediaWatcherService: MediaWatcherService,
    private _menuNavigationService: MenuNavigationService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Методы данных
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter для текущего года
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Жизненный цикл
  // -----------------------------------------------------------------------------------------------------

  /**
   * При инициализации
   */
  ngOnInit(): void {
    this._navigationService.navigation$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((navigation: Navigation) => {
        this.navigation = navigation;
      });

    this._mediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        this.isScreenSmall = !matchingAliases.includes('md');
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
   * Вызвать навигацию
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    const navigation = this._menuNavigationService.getComponent<VerticalNavigationComponent>(name);

    if (navigation) {
      navigation.toggle();
    }
  }
}
