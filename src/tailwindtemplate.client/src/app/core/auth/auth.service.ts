import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated: boolean = false;
  private _httpClient = inject(HttpClient);
  private _userService = inject(UserService);

  private readonly tokenEndpoint = 'api/identity/login';

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Авторизация
   *
   * @param credentials
   */
  signIn(credentials: { email: string; password: string; }): Observable<any> {
    if (this._authenticated) {
      return throwError('Пользователь уже авторизован!');
    }

    return this.loginWithPassword(
      credentials.email,
      credentials.password
    ).pipe(
      switchMap((response: any) => {
        return this.processLogin(response);
      })
    );
  }

  /**
   * Войдите, используя токен доступа
   */
  signInUsingToken(): Observable<any> {
    if (this._userService.user$) {
      this._authenticated = true;
      return of(true);
    } else {
      this._authenticated = false;
      return of(false);
    }
  }

  /**
   * Выход
   */
  signOut(): Observable<any> {
    localStorage.removeItem('accessToken');
    this._authenticated = false;

    return of(true);
  }

  /**
   * Проверка статуса авторизации
   */
  check(): Observable<boolean> {
    if (this._authenticated) {
      return of(true);
    }

    if (!this.accessToken) {
      return of(false);
    }

    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    return this.signInUsingToken();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Процесс логина
   *
   * @param response
   * @returns
   */
  private processLogin(response: any): Observable<any> {
    this.accessToken = response.accessToken;

    this._authenticated = true;

    return of(response);
  }

  /**
   * Sign in
   *
   * @param userName
   * @param password
   */
  private loginWithPassword(userName: string, password: string) {
    return this._httpClient.post(this.tokenEndpoint, { username: userName, password: password });
  }
}