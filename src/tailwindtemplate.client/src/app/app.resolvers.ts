import { inject } from '@angular/core';
import { ConfigService } from '@horesse/services/config';
import { AppInfoService } from 'app/core/info/app-info.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { forkJoin } from 'rxjs';

export const initialDataResolver = () => {
  const navigationService = inject(NavigationService);
  const configService = inject(ConfigService);

  return forkJoin([
    navigationService.get(),
    configService.loadConfig()
  ]);
};

export const baseDataResolver = () => {
  const appInfoService = inject(AppInfoService);

  return forkJoin([
    appInfoService.getAppInfo()
  ]);
};
