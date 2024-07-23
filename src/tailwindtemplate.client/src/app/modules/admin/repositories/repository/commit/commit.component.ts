import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Commit } from 'app/modules/admin/repositories/repositories.types';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector   : 'repository-commit',
  standalone : true,
  imports    : [
    DatePipe,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './commit.component.html'
})
export class RepositoryCommitComponent implements OnInit, OnDestroy {
  @Input() commit: Commit;
  repoName: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _repositoryService: RepositoryService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._repositoryService.repositoryName$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((repoName: string) => {
        this.repoName = repoName;
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
   * Получение даты в формате дистанции
   * @param date
   */
  getFormattedDate(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  }

  /**
   * Адресация на страницу с изменениями
   */
  routeToDiff() {
    return `/repositories/repo/${this.repoName}/diff/${this.commit.revision}`;
  }
}
