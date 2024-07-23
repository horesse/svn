import { DatePipe, NgStyle } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { RepoItem } from 'app/modules/admin/repositories/repositories.types';
import { RepositoryService } from 'app/modules/admin/repositories/repository/repository.service';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector   : 'repository-tree-item',
  standalone : true,
  imports    : [MatIconModule, DatePipe, MatProgressSpinner, RouterLink, MatTooltipModule, NgStyle],
  templateUrl: './item.component.html'
})
export class RepositoryItemComponent implements OnInit, OnDestroy {
  @Input() item: RepoItem;
  repoName: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _repositoryService: RepositoryService,
    private _router: Router
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._repositoryService.repositoryName$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((repoName: string) => {
        this.repoName = repoName;
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
   * Получение иконок файлов для типов
   * @param fileName
   */
  getCurrentIcon(fileName: string) {
    const parts = fileName.split('.');
    const iconPrefix = 'simpleicons_';

    if (fileName.startsWith('package.json'))
      return { icon: iconPrefix + 'nodedotjs', color: '#5FA04E' };

    switch (parts[parts.length - 1]) {
      case 'cs':
        return { icon: `${iconPrefix}csharp`, color: '#512BD4' };
      case 'sln':
      case 'csproj':
        return { icon: `${iconPrefix}visualstudio`, color: '#5C2D91' };
      case 'editorconfig':
        return { icon: `${iconPrefix}editorconfig` };
      case 'js':
        return { icon: `${iconPrefix}javascript`, color: '#FF7800' };
      case 'prettierrc':
      case 'prettierignore':
        return { icon: `${iconPrefix}prettier`, color: '#F7B93E' };
      case 'json':
        return { icon: `${iconPrefix}json` };
      case 'gitignore':
        return { icon: iconPrefix + 'gitignoredotio', color: '#204ECF' };
      case 'html':
        return { icon: iconPrefix + 'html5', color: '#E34F26' };
      case 'css':
        return { icon: iconPrefix + 'css3', color: '#1572B6' };
      case 'scss':
        return { icon: iconPrefix + 'sass', color: '#CC6699' };
      case 'ts': {
        if (parts.length > 2) {
          switch (parts[parts.length - 2]) {
            case 'routes':
            case 'config':
              return { icon: iconPrefix + 'angular', color: '#FF69B4' };
          }
        }

        return { icon: iconPrefix + 'typescript', color: '#3178C6' };
      }
      case 'xaml':
      case 'xml': {
        return { icon: iconPrefix + 'xaml', color: '#0C54C2' };
      }
      case 'doc':
      case 'docx': {
        return { icon: iconPrefix + 'microsoftword', color: '#2B579A' };
      }
      case 'xlsx': {
        return { icon: iconPrefix + 'microsoftexcel', color: '#217346' };
      }
      case 'config':
        return { icon: 'heroicons_outline:wrench' };
      default:
        return { icon: 'heroicons_outline:document', color: '' };
    }
  }

  /**
   * Получение даты в формате дистанции
   * @param date
   */
  getFormattedDate(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  }

  getRouterLink(item: RepoItem): string[] {
    if (item.type === 1) {
      return ['./', item.name];
    } else {
      let url = this._router.url.replace('tree', 'blob');
      // убираю спец. символы html для ибзежания проблем
      url = decodeURIComponent(url);
      return [url, item.name];
    }
  }

  /**
   * Адресация на страницу с изменениями
   */
  routeToDiff() {
    return `/repositories/repo/${this.repoName}/diff/${this.item.lastCommit.revision}`;
  }
}
