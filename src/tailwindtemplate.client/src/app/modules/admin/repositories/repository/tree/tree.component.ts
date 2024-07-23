import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Commit } from 'app/modules/admin/repositories/repositories.types';
import { BranchComponent } from 'app/modules/admin/repositories/repository/branch/branch.component';
import { RepositoryCommitComponent } from 'app/modules/admin/repositories/repository/commit/commit.component';
import { RepositoryComponent } from 'app/modules/admin/repositories/repository/repository.component';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { RepositoryInformation } from 'app/modules/admin/repositories/repository/repository.types';
import { RepositoryTreeInformationComponent } from 'app/modules/admin/repositories/repository/tree/information/information.component';
import { RepositoryTreeListComponent } from 'app/modules/admin/repositories/repository/tree/list/list.component';
import { RepositoryTreeService } from 'app/modules/admin/repositories/repository/tree/tree.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector   : 'repository-tree',
  standalone : true,
  imports    : [
    DatePipe,
    MatIcon,
    MatTooltipModule,
    RouterLink,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    CdkCopyToClipboard,
    RepositoryTreeListComponent,
    RepositoryTreeInformationComponent,
    RepositoryCommitComponent,
    MatOption,
    MatSelect,
    BranchComponent
  ],
  templateUrl: './tree.component.html'
})
export class RepositoryTreeComponent implements OnInit, OnDestroy, AfterViewInit {
  repositoryInformation: RepositoryInformation;
  lastCommit: Commit;
  @ViewChild('header') headerTemplate: TemplateRef<any>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _treeService: RepositoryTreeService,
    private _repositoryService: RepositoryService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _repositoryComponent: RepositoryComponent,
    private _router: Router
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Получение ссылки на репозиторий
    this._treeService.repositoryInformation$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((repoInfo: RepositoryInformation) => {
        this.repositoryInformation = repoInfo;

        this._changeDetectorRef.markForCheck();
      });

    // Последний коммит
    this._repositoryService.lastCommit$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((lastCommit: Commit) => {
        this.lastCommit = lastCommit;

        this._changeDetectorRef.markForCheck();
      });
  }

  ngAfterViewInit() {
    this._repositoryComponent.header = this.headerTemplate;

    this._changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Получение ссылки на переадресацию на коммиты
   */
  getRouterLink(): string[] {
    let url = this._router.url.replace('tree', 'commits');
    // убираю спец. символы html для ибзежания проблем
    url = decodeURIComponent(url);
    return [url];
  }
}
