import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name      : 'Base64ToImage',
  pure      : false,
  standalone: true
})
export class Base64ToImagePipe implements PipeTransform {
  transform(base64Data: string): string {
    return `data:image/jpeg;base64,${base64Data}`;
  }
}