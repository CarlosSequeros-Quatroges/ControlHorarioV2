import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrar'
})
export class FiltrarPipe implements PipeTransform {

  transform(items: any[], campo: string, valor: string): any {
    if (!items) {return []; }
    if (!valor) {return []; }
    valor = valor.toLowerCase();
    return items.filter( item => {
      if (item && item[campo]) {
        return item[campo].toLowerCase().includes(valor);
      }
      return false;
    })
  }

}
