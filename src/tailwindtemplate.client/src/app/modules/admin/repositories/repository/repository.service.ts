import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch, Commit, Repository } from 'app/modules/admin/repositories/repositories.types';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private _repositoryName = new BehaviorSubject<string>(null);
  private _currentPath = new BehaviorSubject<string>(null);

  private _branches = new BehaviorSubject<Branch[]>(null);
  private _tags = new BehaviorSubject<Branch[]>(null);

  private _lastCommit = new BehaviorSubject<Commit>(null);

  private _currentRepo: Repository;

  /**
   * Конструктор
   */
  constructor(private _httpClient: HttpClient) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Наименование репозитория
   */
  get repositoryName$(): Observable<string> {
    return this._repositoryName.asObservable();
  }

  set repositoryName$(value: string) {
    this._repositoryName.next(value);
  }

  /**
   * Ветки репозитория
   */
  get branches$(): Observable<Branch[]> {
    return this._branches.asObservable();
  }

  /**
   * Теги репозитория
   */
  get tags$(): Observable<Branch[]> {
    return this._tags.asObservable();
  }

  /**
   * Последний коммит
   */
  get lastCommit$(): Observable<Commit> {
    return this._lastCommit.asObservable();
  }

  /**
   * Теущий путь
   */
  get currentPath$(): Observable<string> {
    return this._currentPath.asObservable();
  }

  set currentPath$(value: string) {
    this._currentPath.next(value);
  }

  /**
   * Текущий репозиторий
   */
  get currentRepo(): Repository {
    return this._currentRepo;
  }

  set currentRepo(value: Repository) {
    this._currentRepo = value;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Получение веток репозитория
   *
   * @param repoName
   */
  getBranches(repoName: string): Observable<Branch[]> {
    return this._httpClient.get(`api/Repositories/branches/${repoName}`).pipe(
      tap((response: Branch[]) => {
        this._branches.next(response);
      }),
      catchError((e: any) => {
        console.log(e);

        return this.branches$;
      })
    );
  }

  /**
   * Получение веток репозитория
   *
   * @param repoName
   */
  getTags(repoName: string): Observable<Branch[]> {
    return this._httpClient.get(`api/Repositories/tags/${repoName}`).pipe(
      tap((response: Branch[]) => {
        this._tags.next(response);
      }),
      catchError((e: any) => {
        console.log(e);

        return this.tags$;
      })
    );
  }

  /**
   * Получение последнего коммита
   *
   * @param repoName
   * @param path
   */
  getLastCommit(repoName: string, path: string) {
    return this._httpClient.post(`api/Commits/last`, { repoName: repoName, path: path }).pipe(
      tap((response: Commit) => {
        this._lastCommit.next(response);
      }),
      catchError((e: any) => {
        console.log(e);

        return this.lastCommit$;
      })
    );
  }

  /**
   * Получение языка на основе типа файла для отображения в редактора
   * @private
   */
  getLang(currentPath: string): string {
    const parts = currentPath.split('/');
    const extension = parts[parts.length - 1].split('.');
    switch (extension[extension.length - 1].toLowerCase()) {
      case 'cs':
        return 'csharp';
      case 'json':
        return 'json';
      case 'scss':
        return 'scss';
      case 'css':
        return 'css';
      case 'ts':
        return 'typescript';
      case 'js':
        return 'javascript';
      case 'html':
        return 'html';
      case 'csproj':
      case 'xml':
      case 'config':
      case 'resx':
      case 'xsd':
      case 'settings':
      case 'targets':
        return 'xml';
      case 'cmd':
        return 'powershell';
      case 'java':
        return 'java';
      case 'md':
        return 'mdx';
      default:
        return '';
    }
  }
}
