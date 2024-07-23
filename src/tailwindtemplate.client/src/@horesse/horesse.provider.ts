import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { AppConfig } from '@horesse/services/config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor, LoadingService } from '@horesse/services/loading';
import { MediaWatcherService } from '@horesse/services/media-watcher';
import { PlatformService } from '@horesse/services/platform';
import { SplashScreenService } from '@horesse/services/splash-screen';
import { HORESSE_CONFIG } from '@horesse/services/config/config.constants';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

export type HoresseProviderConfig = {
  app?: AppConfig
}

export const provideHoresse = (config: HoresseProviderConfig): Array<Provider | EnvironmentProviders> => {
  return [
    {
      // Disable 'theme' sanity check
      provide : MATERIAL_SANITY_CHECKS,
      useValue: {
        doctype: true,
        theme  : false,
        version: true
      }
    },
    {
      // Use the 'fill' appearance on Angular Material form fields by default
      provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill'
      }
    },
    {
      provide : HORESSE_CONFIG,
      useValue: config?.app ?? {}
    },

    provideHttpClient(withInterceptors([loadingInterceptor])),
    {
      provide : ENVIRONMENT_INITIALIZER,
      useValue: () => inject(LoadingService),
      multi   : true
    },
    {
      provide : ENVIRONMENT_INITIALIZER,
      useValue: () => inject(MediaWatcherService),
      multi   : true
    },
    {
      provide : ENVIRONMENT_INITIALIZER,
      useValue: () => inject(PlatformService),
      multi   : true
    },
    {
      provide : ENVIRONMENT_INITIALIZER,
      useValue: () => inject(SplashScreenService),
      multi   : true
    }
  ];
};
