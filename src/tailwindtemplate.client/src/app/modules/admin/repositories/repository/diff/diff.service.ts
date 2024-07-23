import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commit, CommitChange } from 'app/modules/admin/repositories/repositories.types';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoryDiffService {
  private _commit = new BehaviorSubject<Commit>(null);
  private _changes = new BehaviorSubject<CommitChange[]>(null);

  /**
   * Конструктор
   */
  constructor(private _httpClient: HttpClient) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get commit$(): Observable<Commit> {
    return this._commit.asObservable();
  }

  get changes$(): Observable<CommitChange[]> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Получение коммита
   *
   * @param title
   * @param revision
   */
  getCommitByRevision(title: string, revision: number) {
    return this._httpClient.get(`api/Commits/${title}/${revision}`).pipe(
      take(1),
      map((commit: Commit) => {
        this._commit.next(commit);

        return of(commit);
      }),
      switchMap((commit) => {
        if (!commit)
          return throwError('Не найден коммит ' + revision);

        return commit;
      })
    );
  }

  /**
   * Получение изменений в коммите
   *
   * @param title
   * @param revision
   */
  getChangesByRevision(title: string, revision: number) {
    return this._httpClient.get(`api/Commits/changes/${title}/${revision}`).pipe(
      tap((response: CommitChange[]) => {
        this._changes.next(response);
      }),
      catchError((e: any) => {
        console.log(e);
        return this.changes$;
      })
    );
  }
}
