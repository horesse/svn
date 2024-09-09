import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ConfigService, Theme, Themes } from '@horesse/services/config';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector   : 'settings',
  standalone : true,
  imports    : [
    MatIconButton,
    MatIcon,
    NgClass,
    MatDialogClose
  ],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  themes: Themes;
  currentTheme: Theme;

  @ViewChild('modalSettings') modalSettings: TemplateRef<any>;

  private _unsubscribeAll = new Subject<any>();

  constructor(private _matDialog: MatDialog, private _configService: ConfigService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._configService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.themes = config.themes;
        this.currentTheme = config.theme;
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
    this._matDialog.open(this.modalSettings, { autoFocus: false });
  }

  selectTheme(theme: Theme) {
    this._configService.config = { theme };
  }
}
