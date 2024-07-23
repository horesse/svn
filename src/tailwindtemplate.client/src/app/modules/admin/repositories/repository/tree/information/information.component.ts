import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Branch } from 'app/modules/admin/repositories/repositories.types';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { RepositoryInformation } from 'app/modules/admin/repositories/repository/repository.types';
import { RepositoryTreeService } from 'app/modules/admin/repositories/repository/tree/tree.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'repository-tree-information',
  standalone     : true,
  imports        : [
    DatePipe,
    MatIcon,
    MatTooltip
  ],
  templateUrl    : './information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryTreeInformationComponent implements OnInit, OnDestroy {
  branches: Branch[];
  tags: Branch[];
  repositoryInformation: RepositoryInformation;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _treeService: RepositoryTreeService,
    private _repositoryService: RepositoryService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._treeService.repositoryInformation$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((repoInfo: RepositoryInformation) => {
        this.repositoryInformation = repoInfo;

        this._changeDetectorRef.markForCheck();
      });

    this._repositoryService.tags$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tags: Branch[]) => {
        this.tags = tags;

        this._changeDetectorRef.markForCheck();
      });

    this._repositoryService.branches$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((branches: Branch[]) => {
        this.branches = branches;

        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
