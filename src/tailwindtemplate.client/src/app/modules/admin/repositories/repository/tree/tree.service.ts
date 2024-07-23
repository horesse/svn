import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RepoItem } from 'app/modules/admin/repositories/repositories.types';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { RepositoryInformation } from 'app/modules/admin/repositories/repository/repository.types';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoryTreeService {
  private _items = new BehaviorSubject<RepoItem[]>(null);
  private _repositoryInformation = new BehaviorSubject<RepositoryInformation>(null);

  /**
   * Конструктор
   */
  constructor(
    private _httpClient: HttpClient,
    private _repositoryService: RepositoryService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get items$(): Observable<RepoItem[]> {
    return this._items.asObservable();
  }

  /**
   * Информация о репозитории
   */
  get repositoryInformation$(): Observable<RepositoryInformation> {
    return this._repositoryInformation.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  getRepoItems(repoName: string, path: string) {
    return this._httpClient.post(`api/Repositories/items`, { repoName: repoName, path: path }).pipe(
      tap((response: RepoItem[]) => {
        this._items.next(response);
      }),
      catchError((e: any) => {
        console.log(e);

        return this.items$;
      })
    );
  }

  /**
   * Получение информации о репозитории
   */
  getRepositoryInformation() {
    return this._httpClient.post(`api/Repositories/info`, {
      repoName: this._repositoryService.currentRepo.title,
      branch  : this._repositoryService.currentRepo.path
    }).pipe(
      tap((response: RepositoryInformation) => {
        this._repositoryInformation.next(response);
      }),
      catchError((e: any) => {
        console.log(e);

        return of([]);
      })
    );
  }
}
