import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { User } from 'app/core/user/user.types';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get user$(): Observable<User> {
    this.loadUser();
    return this._user.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  getUserFormAccessToken(decodedAccessToken: any): User {
    const user = {
      id                   : decodedAccessToken.Id,
      userName             : decodedAccessToken.UserName,
      name                 : decodedAccessToken.Name,
      personalNumber       : decodedAccessToken.PersonalNumber,
      department           : decodedAccessToken.Department,
      position             : decodedAccessToken.Position,
      fullName             : decodedAccessToken.FullName,
      roles                : decodedAccessToken.Roles,
      rolesToView          : decodedAccessToken.RolesToView,
      workplaceName        : decodedAccessToken.WorkplaceName,
      bureau               : decodedAccessToken.Bureau,
      structureEnterpriseId: decodedAccessToken.StructureEnterpriseId,
      email                : decodedAccessToken.Email,
      avatar               : decodedAccessToken.Avatar
    };
    return user;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------

  private loadUser() {
    const token = localStorage.getItem('accessToken') ?? '';
    if (token)
      this._user.next(this.getUserFormAccessToken(AuthUtils._decodeToken(token)));
  }
}