import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileInfo } from 'app/modules/admin/repositories/repositories.types';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoryBlobService {
  private _file = new BehaviorSubject<FileInfo>(null);

  /**
   * Конструктор
   */
  constructor(private _httpClient: HttpClient) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get file$(): Observable<FileInfo> {
    return this._file.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  getFileContent(repoName: string, path: string) {
    return this._httpClient.post(`api/Files/file`, { repoName: repoName, path: path }).pipe(
      tap((response: FileInfo) => {
        this._file.next(response);
      }),
      catchError((e: any) => {
        console.log(e);

        return this.file$;
      })
    );
  }
}
