import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as SimpleIcons from '@ng-icons/simple-icons';

@Injectable({ providedIn: 'root' })
export class IconsService {
  /**
   * Constructor
   */
  constructor() {
    const domSanitizer = inject(DomSanitizer);
    const matIconRegistry = inject(MatIconRegistry);

    // Register icon sets
    matIconRegistry.addSvgIconSetInNamespace('mat', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg'));
    matIconRegistry.addSvgIconSetInNamespace('mat_outline', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-outline.svg'));
    matIconRegistry.addSvgIconSetInNamespace('mat_solid', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-solid.svg'));
    matIconRegistry.addSvgIconSetInNamespace('feather', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/feather.svg'));
    matIconRegistry.addSvgIconSetInNamespace('heroicons_outline', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg'));
    matIconRegistry.addSvgIconSetInNamespace('heroicons_solid', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-solid.svg'));
    matIconRegistry.addSvgIconSetInNamespace('heroicons_mini', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-mini.svg'));

    for (const iconName in SimpleIcons) {
      if (SimpleIcons[iconName]) {
        const icon = SimpleIcons[iconName];
        const iconNameWithoutBasePrefix = iconName.replace('simple', '').toLowerCase();
        const resultName = `simpleicons_${iconNameWithoutBasePrefix}`;
        matIconRegistry.addSvgIconLiteral(resultName, domSanitizer.bypassSecurityTrustHtml(icon));
      }
    }
  }
}
