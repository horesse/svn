import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commit } from 'app/modules/admin/repositories/repositories.types';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoryCommitsService {
  private _commits = new BehaviorSubject<Commit[]>(null);

  /**
   * Конструктор
   */
  constructor(private _httpClient: HttpClient) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get commits$(): Observable<Commit[]> {
    return this._commits.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Получение коммитов
   *
   * @param app
   * @param url
   * @param page
   */
  getCommits(app: string, url: string, page: number) {
    return this._httpClient.post(`api/Commits`, { app: app, url: url, page: page }).pipe(
      tap((response: Commit[]) => {
        this._commits.next(response);
      }),
      catchError((e: any) => {
        console.log(e);
        return this.commits$;
      })
    );
  }
}
