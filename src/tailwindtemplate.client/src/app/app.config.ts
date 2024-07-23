import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withHashLocation, withInMemoryScrolling, withPreloading } from '@angular/router';
import { provideHoresse } from '@horesse';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { appRoutes } from './app.routes';
import { provideIcons } from './core/icons/icons.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular providers
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes,
      withPreloading(PreloadAllModules),
      withHashLocation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withComponentInputBinding()
    ),
    importProvidersFrom(MonacoEditorModule.forRoot()),
    // Material providers

    // Horesse Providers
    provideIcons(),
    provideHoresse({
      app: {
        layout : 'classic',
        scheme : 'auto',
        screens: {
          sm: '600px',
          md: '960px',
          lg: '1280px',
          xl: '1440px'
        },
        theme  : 'theme-default',
        themes : [
          {
            id  : 'theme-default',
            name: 'Default'
          },
          {
            id  : 'theme-brand',
            name: 'Brand'
          },
          {
            id  : 'theme-teal',
            name: 'Teal'
          },
          {
            id  : 'theme-rose',
            name: 'Rose'
          },
          {
            id  : 'theme-purple',
            name: 'Purple'
          },
          {
            id  : 'theme-amber',
            name: 'Amber'
          }
        ]
      }
    })
  ]
};
