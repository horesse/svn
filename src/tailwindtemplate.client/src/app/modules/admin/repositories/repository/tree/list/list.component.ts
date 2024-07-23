import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { RepoItem } from 'app/modules/admin/repositories/repositories.types';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { RepositoryItemComponent } from 'app/modules/admin/repositories/repository/tree/list/item/item.component';
import { RepositoryTreeService } from 'app/modules/admin/repositories/repository/tree/tree.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'repository-tree-list',
  standalone     : true,
  imports        : [
    RepositoryItemComponent,
    RouterLink,
    MatTooltip
  ],
  templateUrl    : './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryTreeListComponent implements OnInit, OnDestroy {
  items: RepoItem[];
  currentPath: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _repositoryService: RepositoryService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _treeService: RepositoryTreeService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Получение текущего пути
    this._repositoryService.currentPath$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((currentPath: string) => {
        this.currentPath = currentPath;

        this._changeDetectorRef.markForCheck();
      });

    // Получение файлов/папок по пути
    this._treeService.items$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((items: RepoItem[]) => {
        this.items = items;

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
   * Показывать ли кнопку "вернуться"
   */
  isShowButtonBack() {
    const parts = this.currentPath.split('/');
    if (parts[0] === 'trunk' && parts.length > 1)
      return true;

    if (parts[0] === 'branches' && parts.length > 2)
      return true;
  }
}
