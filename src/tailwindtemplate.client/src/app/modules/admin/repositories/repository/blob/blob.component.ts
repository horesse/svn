import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { HighlightComponent } from '@horesse/components/highlight';
import { ConfigService } from '@horesse/services/config';
import { Commit, FileInfo } from 'app/modules/admin/repositories/repositories.types';
import { RepositoryBlobService } from 'app/modules/admin/repositories/repository/blob/blob.service';
import { RepositoryCommitComponent } from 'app/modules/admin/repositories/repository/commit/commit.component';
import { RepositoryComponent } from 'app/modules/admin/repositories/repository/repository.component';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector       : 'repository-blob',
  standalone     : true,
  imports        : [HighlightComponent, MonacoEditorModule, FormsModule, ReactiveFormsModule, MatIconModule, MatIconButton, MatTooltip, CdkCopyToClipboard, MatButton, RouterLink, RepositoryCommitComponent],
  templateUrl    : './blob.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryBlobComponent implements OnInit, OnDestroy, AfterViewInit {
  file: FileInfo;
  currentPath: string;
  showEditor: boolean = true;
  lastCommit: Commit;
  @ViewChild('header') headerTemplate: TemplateRef<any>;

  editorOptions = {
    theme          : 'vs-light',
    language       : '',
    readOnly       : true,
    wordWrap       : 'on',
    automaticLayout: true
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _repositoryService: RepositoryService,
    private _blobService: RepositoryBlobService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _configService: ConfigService,
    private _repositoryComponent: RepositoryComponent,
    private _router: Router
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._repositoryService.currentPath$.pipe(takeUntil(this._unsubscribeAll)).subscribe((currentPath: string) => {
      this.currentPath = currentPath;
      this._changeDetectorRef.markForCheck();
    });

    this._blobService.file$.pipe(takeUntil(this._unsubscribeAll)).subscribe((file: FileInfo) => {
      this.file = file;
      // Получаем текущий язык
      this.editorOptions.language = this._repositoryService.getLang(this.currentPath);

      this._changeDetectorRef.markForCheck();
    });

    this._configService.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe((config: any) => {
      this.editorOptions.theme = config.scheme === 'light' ? 'vs-light' : 'vs-dark';
      this.reloadEditor();

      this._changeDetectorRef.markForCheck();
    });

    this._repositoryService.lastCommit$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((lastCommit: Commit) => {
        this.lastCommit = lastCommit;

        this._changeDetectorRef.markForCheck();
      });
  }

  ngAfterViewInit() {
    this._repositoryComponent.header = this.headerTemplate;

    this._changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Получение ссылки на переадресацию на коммиты
   */
  getRouterLink(): string[] {
    let url = this._router.url.replace('blob', 'commits');
    // убираю спец. символы html для ибзежания проблем
    url = decodeURIComponent(url);
    return [url];
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Перезагрузка редактора при смене темы
   * @private
   */
  private reloadEditor() {
    this.showEditor = false;
    setTimeout(() => {
      this.showEditor = true;
      this._changeDetectorRef.markForCheck();
    }, 10);
  }

  protected readonly document = document;
}
