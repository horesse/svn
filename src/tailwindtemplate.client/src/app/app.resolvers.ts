import { inject } from '@angular/core';
import { ConfigService } from '@horesse/services/config';
import { AppInfoService } from 'app/core/info/app-info.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { forkJoin } from 'rxjs';

export const initialDataResolver = () => {
  const navigationService = inject(NavigationService);

  return forkJoin([
    navigationService.get()
  ]);
};

export const baseDataResolver = () => {
  const appInfoService = inject(AppInfoService);
  const configService = inject(ConfigService);

  return forkJoin([
    appInfoService.getAppInfo(),
    configService.loadConfig()
  ]);
};
