import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { forkJoin } from 'rxjs';
import { ConfigService } from '@horesse/services/config';

export const initialDataResolver = () => {
  const navigationService = inject(NavigationService);
  const configService = inject(ConfigService);

  return forkJoin([
    navigationService.get(),
    configService.loadConfig()
  ]);
};
