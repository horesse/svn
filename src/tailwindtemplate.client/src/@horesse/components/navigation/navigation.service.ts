import { Injectable } from '@angular/core';
import { NavigationItem } from '@horesse/components/navigation/navigation.types';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _componentRegistry: Map<string, any> = new Map<string, any>();
  private _navigationStore: Map<string, NavigationItem[]> = new Map<string, any>();

  /**
   * Конструктор
   */
  constructor() {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Публичные методы
  // -----------------------------------------------------------------------------------------------------

  /**
   * Регистрация навигационного компонента
   *
   * @param name
   * @param component
   */
  registerComponent(name: string, component: any): void {
    this._componentRegistry.set(name, component);
  }

  /**
   * Отменить регистрацию навигационного компонента
   *
   * @param name
   */
  deregisterComponent(name: string): void {
    this._componentRegistry.delete(name);
  }

  /**
   * Получить компонент навигации
   *
   * @param name
   */
  getComponent<T>(name: string): T {
    return this._componentRegistry.get(name);
  }

  /**
   * Сохранить пункт с ключом
   *
   * @param key
   * @param navigation
   */
  storeNavigation(key: string, navigation: NavigationItem[]): void {
    // Add to the store
    this._navigationStore.set(key, navigation);
  }

  /**
   * Получить навигацию из хранилища по ключу
   *
   * @param key
   */
  getNavigation(key: string): NavigationItem[] {
    return this._navigationStore.get(key) ?? [];
  }

  /**
   * Удалить навигацию
   *
   * @param key
   */
  deleteNavigation(key: string): void {
    // Проверка есть ли навигация
    if (!this._navigationStore.has(key)) {
      console.warn(`Навигация с ключом '${key}' не найдена.`);
    }

    // Удалить
    this._navigationStore.delete(key);
  }

  /**
   * Служебная функция, которая возвращает плоскую версию данного массива навигации
   *
   * @param navigation
   * @param flatNavigation
   */
  getFlatNavigation(navigation: NavigationItem[], flatNavigation: NavigationItem[] = []): NavigationItem[] {
    for (const item of navigation) {
      if (item.type === 'basic') {
        flatNavigation.push(item);
        continue;
      }

      if (item.type === 'aside' || item.type === 'collapsable' || item.type === 'group') {
        if (item.children) {
          this.getFlatNavigation(item.children, flatNavigation);
        }
      }
    }

    return flatNavigation;
  }

  /**
   * Служебная функция, которая возвращает элемент с заданным идентификатором из заданной навигации
   *
   * @param id
   * @param navigation
   */
  getItem(id: string, navigation: NavigationItem[]): NavigationItem | null {
    for (const item of navigation) {
      if (item.id === id) {
        return item;
      }

      if (item.children) {
        const childItem = this.getItem(id, item.children);

        if (childItem) {
          return childItem;
        }
      }
    }

    return null;
  }

  /**
   * Служебная функция, которая возвращает родительский элемент элемента с заданным идентификатором из заданной навигации
   *
   * @param id
   * @param navigation
   * @param parent
   */
  getItemParent(
    id: string,
    navigation: NavigationItem[],
    parent: NavigationItem[] | NavigationItem
  ): NavigationItem[] | NavigationItem | null {
    for (const item of navigation) {
      if (item.id === id) {
        return parent;
      }

      if (item.children) {
        const childItem = this.getItemParent(id, item.children, item);

        if (childItem) {
          return childItem;
        }
      }
    }

    return null;
  }
}
