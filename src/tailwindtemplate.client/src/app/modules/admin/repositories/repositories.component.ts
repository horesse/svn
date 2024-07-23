import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaWatcherService } from '@horesse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector   : 'repositories',
  standalone : true,
  imports    : [],
  templateUrl: './repositories.component.html'
})
export class RepositoriesComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Конструктор
   */
  constructor(
    private _mediaWatcherService: MediaWatcherService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._mediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
  }
}
