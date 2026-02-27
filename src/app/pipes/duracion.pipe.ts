import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duracion'
})
export class DuracionPipe implements PipeTransform {

  transform(value: string): number {
    let valor: number  = +value;
    return valor*60*1000; //transforma minutos a milisegundos
  }
}
