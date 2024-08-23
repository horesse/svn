import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppInfo } from 'app/core/info/app-info.types';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppInfoService {
  private _appInfo: BehaviorSubject<AppInfo> = new BehaviorSubject<AppInfo>(null);

  constructor(private _httpClient: HttpClient) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get appInfo$(): Observable<AppInfo> {
    return this._appInfo.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  getAppInfo(): Observable<AppInfo> {
    return this._httpClient.get<AppInfo>('api/app')
      .pipe(tap((data) => {
        this._appInfo.next(data);
      }));
  }
}