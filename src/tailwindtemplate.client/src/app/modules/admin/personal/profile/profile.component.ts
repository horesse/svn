import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Base64ToImagePipe } from '@horesse/pipes/base64-to-image';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector   : 'app-profile',
  standalone : true,
  imports    : [
    MatIcon,
    MatTooltip,
    Base64ToImagePipe
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;
  avatar: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _userService: UserService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;
      });

    this._userService.getUserAvatar()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((avatar: string) => {
        this.avatar = avatar;
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
   * Метод включает в себя базовые роли.
   * Добавлять в метод стоит только тогда, когда хотите выделить роль
   *
   * @param nonFormatRole
   */
  getRoleIcon(nonFormatRole: string) {
    const role = nonFormatRole.toLowerCase();

    switch (role) {
      default:
        return 'heroicons_outline:user';
      case 'просмотр информации':
        return 'heroicons_outline:eye';
      case 'администратор':
        return 'heroicons_outline:wrench';
      case 'рассылка уведомлений':
        return 'heroicons_outline:envelope';
    }
  }
}
