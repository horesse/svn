import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { animations } from '@horesse/animations';
import { AlertComponent, AlertType } from '@horesse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { AppInfoService } from 'app/core/info/app-info.service';
import { AppInfo } from 'app/core/info/app-info.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector     : 'auth-sign-in',
  templateUrl  : './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone   : true,
  animations   : animations,
  imports      : [
    RouterLink,
    AlertComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatIconButton,
    MatIcon,
    MatCheckbox,
    MatButton,
    MatProgressSpinner
  ]
})
export class AuthSignInComponent implements OnInit, OnDestroy {
  @ViewChild('signInNgForm') signInNgForm: NgForm;

  signInForm: UntypedFormGroup;
  showAlert: boolean = false;

  alert: { type: AlertType; message: string } = {
    type   : 'success',
    message: ''
  };

  appCode: string;
  appName: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _appInfoService: AppInfoService,
    private _router: Router
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      email     : ['', [Validators.required]],
      password  : ['', Validators.required],
      rememberMe: ['']
    });

    this._appInfoService.appInfo$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((appInfo: AppInfo) => {
        this.appName = appInfo.appName;
        this.appCode = appInfo.appCode;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public Methods
  // -----------------------------------------------------------------------------------------------------

  signIn(): void {
    this.showAlert = false;

    this._authService.signIn(this.signInForm.value)
      .subscribe(() => {
        const redirectURL =
                this._activatedRoute.snapshot.queryParamMap.get(
                  'redirectURL'
                ) || '/signed-in-redirect';

        this._router.navigateByUrl(redirectURL);
      }, (response) => {
        console.log(response);
        this.signInForm.enable();

        this.signInNgForm.resetForm();

        this.alert = {
          type   : 'error',
          message: response.error.detail
        };

        this.showAlert = true;
      });
  }
}