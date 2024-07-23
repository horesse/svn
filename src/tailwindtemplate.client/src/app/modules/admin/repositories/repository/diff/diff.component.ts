import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ConfigService } from '@horesse/services/config';
import { Commit, CommitChange } from 'app/modules/admin/repositories/repositories.types';
import { RepositoryCommitComponent } from 'app/modules/admin/repositories/repository/commit/commit.component';
import { RepositoryDiffService } from 'app/modules/admin/repositories/repository/diff/diff.service';
import { RepositoryComponent } from 'app/modules/admin/repositories/repository/repository.component';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { Subject, takeUntil } from 'rxjs';

class IEditorModel {
  language: string;
  code: string;
}

@Component({
  selector       : 'repository-commit-diff',
  standalone     : true,
  templateUrl    : './diff.component.html',
  imports        : [MatExpansionModule, MatIconModule, MatTooltipModule, MonacoEditorModule, RepositoryCommitComponent, MatButton, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryCommitDiffComponent implements OnInit, OnDestroy, AfterViewInit {
  changes: CommitChange[];
  commit: Commit;
  showEditor: boolean = true;
  oldPath: string;

  @ViewChild('header') headerTemplate: TemplateRef<any>;

  oldModel: IEditorModel;
  newModel: IEditorModel;

  editorOptions = {
    theme          : 'vs-light',
    language       : '',
    readOnly       : true,
    wordWrap       : 'on',
    automaticLayout: true
    //renderSideBySide: false
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _diffService: RepositoryDiffService,
    private _repositoryService: RepositoryService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _configService: ConfigService,
    private _repositoryComponent: RepositoryComponent
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Измненения в коммите
    this._diffService.changes$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((changes: CommitChange[]) => {
        this.changes = changes;

        this._changeDetectorRef.markForCheck();
      });

    // Текущий коммит
    this._diffService.commit$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((commit: Commit) => {
        this.commit = commit;

        this._changeDetectorRef.markForCheck();
      });

    // Слушаем конфиг для переключения темы
    this._configService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: any) => {
        this.editorOptions.theme = config.scheme === 'light' ? 'vs-light' : 'vs-dark';
        this.reloadEditor();

        this._changeDetectorRef.markForCheck();
      });

    this._repositoryService.currentPath$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((path: string) => {
        this.oldPath = path;
        
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngAfterViewInit() {
    this._repositoryComponent.header = this.headerTemplate;

    this._changeDetectorRef.markForCheck();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  getModel(change: CommitChange, isOld: boolean) {
    const content = isOld ? change.oldContent : change.newContent;
    return { language: this._repositoryService.getLang(change.file), code: content };
  }

  changeVisibilityEditor(change: CommitChange, isShow: boolean) {
    if (isShow) {
      this.oldModel = this.getModel(change, true);
      this.newModel = this.getModel(change, false);
    }

    change.isShowEditor = isShow;
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
}
