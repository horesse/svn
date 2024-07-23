import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Branch } from 'app/modules/admin/repositories/repositories.types';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector   : 'repository-branch-selector',
  standalone : true,
  imports    : [
    MatFormField,
    MatIcon,
    MatOption,
    MatPrefix,
    MatSelect,
    MatTooltip,
    RouterLink
  ],
  templateUrl: './branch.component.html'
})
export class BranchComponent implements OnInit, OnDestroy {
  selectedBranch: Branch;
  branches: Branch[];
  currentPath: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _repositoryService: RepositoryService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors, Lifecycle hooks, Public Methods, Private Methods
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Ветки
    this._repositoryService.branches$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((branches: Branch[]) => {
        this.branches = branches;

        this._changeDetectorRef.markForCheck();
      });

    // Текущий путь
    this._repositoryService.currentPath$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((currentPath: string) => {
        this.currentPath = currentPath;
        this.configDefaultBranch();

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
   * Выбор ветки и ее сохранение
   * @param event
   */
  selectBranch(event) {
    this.selectedBranch = event.value;
  }

  /**
   * Генерация ссылки на ветку
   * @param branch
   */
  getBranchLink(branch: Branch) {
    const url = decodeURIComponent(this._router.routerState.snapshot.url);
    const parts = url.split('/').slice(1, 5);

    return branch.title === 'trunk' ? ['/', ...parts, 'trunk'] : ['/', ...parts, `branches`, branch.title];
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Trunk всегда дефолтная ветка
   * @private
   */
  private configDefaultBranch(): void {
    const parts = this.currentPath.split('/');

    if (parts[0] === 'trunk')
      this.selectedBranch = this.branches.find(c => c.title === 'trunk');

    if (parts.length > 1 && parts[0] === 'branches')
      this.selectedBranch = this.branches.find(c => c.title === parts[1]);
  }
}
