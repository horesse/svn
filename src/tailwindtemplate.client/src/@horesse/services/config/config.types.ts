// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Theme = 'theme-default' | string;
export type Themes = { id: string; name: string }[];

/**
 * Интерфейс AppConfig. Обновите этот интерфейс, чтобы строго вводить свою конфигурацию.
 * object.
 */
export interface AppConfig {
  layout: string;
  scheme: Scheme;
  screens: Screens;
  theme: Theme;
  themes: Themes;
}
