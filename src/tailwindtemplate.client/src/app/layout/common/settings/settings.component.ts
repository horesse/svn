import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AppConfig, ConfigService, Theme } from '@horesse/services/config';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector     : 'settings',
  standalone   : true,
  imports      : [
    MatIconButton,
    MatIcon,
    NgClass,
    MatDialogClose
  ],
  templateUrl  : './settings.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy {
  config: AppConfig;

  @ViewChild('modalSettings') modalSettings: TemplateRef<any>;

  private _dialogRef: MatDialogRef<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _matDialog: MatDialog,
    private _configService: ConfigService,
    private _router: Router
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._configService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.config = config;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  openSettings() {
    this._dialogRef = this._matDialog.open(this.modalSettings, { autoFocus: false });
  }

  selectTheme(theme: Theme) {
    this._configService.config = { theme };
  }

  setLayout(layout: string): void {
    this._router
      .navigate([], {
        queryParams        : {
          layout: null
        },
        queryParamsHandling: 'merge'
      })
      .then(() => {
        this._configService.config = { layout };
        this._dialogRef.close();
      });
  }
}
