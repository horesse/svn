import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Commit } from 'app/modules/admin/repositories/repositories.types';
import { RepositoryCommitComponent } from 'app/modules/admin/repositories/repository/commit/commit.component';
import { RepositoryCommitsService } from 'app/modules/admin/repositories/repository/commits/commits.service';
import { RepositoryComponent } from 'app/modules/admin/repositories/repository/repository.component';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector   : 'repository-commits',
  standalone : true,
  imports    : [
    ScrollingModule,
    RepositoryCommitComponent
  ],
  templateUrl: './commits.component.html'
})
export class RepositoryCommitsComponent implements OnInit, OnDestroy, AfterViewInit {
  commits: Commit[];
  page = 1;
  currentPath: string;
  repoName: string;
  isLoading = false;
  init: boolean = true;

  @ViewChild('header') headerTemplate: TemplateRef<any>;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _repositoryService: RepositoryService,
    private _commitsService: RepositoryCommitsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _repositoryComponent: RepositoryComponent
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Коммиты
    this._commitsService.commits$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((commits: Commit[]) => {
        if (this.init)
          this.commits = commits;
        this.init = false;

        this._changeDetectorRef.markForCheck();
      });

    // Текущий путь
    this._repositoryService.currentPath$.pipe(takeUntil(this._unsubscribeAll)).subscribe((currentPath: string) => {
      this.currentPath = currentPath;

      this._changeDetectorRef.markForCheck();
    });

    // Текущий проект
    this._repositoryService.repositoryName$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((repoName: string) => {
        this.repoName = repoName;
        console.log(repoName);

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
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------

  onScroll(): void {
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    if (!this.isLoading && end === total && !this.commits.some(c => c.revision === 1)) {
      this.page++;
      this.loadData();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------

  private loadData() {
    this.isLoading = true;
    this._commitsService.getCommits(this.repoName, this.currentPath, this.page)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((commits: Commit[]) => {
        this.commits = [...this.commits, ...commits];
        this.isLoading = false;

        this._changeDetectorRef.markForCheck();
      });
  }

  protected readonly document = document;
}
