import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'contiene',
})
export class ContienePipe implements PipeTransform {
  transform(items: any[], valor: string): boolean {
    if (!items) {
      return false;
    }
    if (!valor) {
      return false;
    }
    const filtrado = items.filter(
      (item) => item.toLowerCase() === valor.toLowerCase(),
    );
    return filtrado.length > 0;
  }
}
