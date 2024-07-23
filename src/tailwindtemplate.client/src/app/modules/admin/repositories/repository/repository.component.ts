import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipModule } from '@angular/material/tooltip';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UtilsService } from '@horesse/services/utils';
import { RepositoryCommitComponent } from 'app/modules/admin/repositories/repository/commit/commit.component';
import { tooltipDefaults } from 'app/modules/admin/repositories/repository/repository.constants';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { Breadcrumb } from 'app/modules/admin/repositories/repository/repository.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'repository-details',
  standalone     : true,
  providers      : [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipDefaults }],
  imports        : [
    RouterOutlet, DatePipe, MatTooltipModule, MatIcon, RouterLink, RouterLinkActive, MatSelectModule, MatInputModule, MatFormFieldModule, NgTemplateOutlet, RepositoryCommitComponent
  ],
  templateUrl    : './repository.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryComponent implements OnInit, OnDestroy {
  repositoryName: string;

  breadcrumbs: Breadcrumb[];
  isActiveMatchOptions: IsActiveMatchOptions;
  currentPath: string;
  header: TemplateRef<any>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _repositoryService: RepositoryService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _utilsService: UtilsService
  ) {
    this.isActiveMatchOptions = this._utilsService.exactMatchOptions;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {

    this._repositoryService.repositoryName$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((repositoryName: string) => {
        this.repositoryName = repositoryName;

        this._changeDetectorRef.markForCheck();
      });

    // Текущий путь
    this._repositoryService.currentPath$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((currentPath: string) => {
        this.currentPath = currentPath;
        this.breadcrumbs = this.splitPath(currentPath);

        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Определение последней крошки
   * @param breadcrumb
   */
  isLastBreadcrumb(breadcrumb: Breadcrumb): boolean {
    return this.breadcrumbs[this.breadcrumbs.length - 1] !== breadcrumb;
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Строим хлебные крошки из пути
   * @param path
   * @private
   */
  private splitPath(path: string): Breadcrumb[] {
    const parts = path.split('/');
    let fullPath = '';
    return parts.map(part => {
      fullPath = fullPath ? `${fullPath}/${part}` : part;

      if (part === 'branches')
        return null;

      return { title: part, link: `tree/${fullPath}`, current: fullPath === path };
    }).filter(c => c);
  }
}
