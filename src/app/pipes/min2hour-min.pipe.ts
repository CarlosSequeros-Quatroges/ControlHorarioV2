import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'min2hourMin',
})
export class Min2hourMinPipe implements PipeTransform {
  transform(minutos: string): string {
    var horas: string = String(parseInt(String(Number(minutos) / 60)));
    if (horas.length == 1) {
      horas = '0' + horas;
    }
    var mins: string = String(Number(minutos) % 60);
    if (mins.length == 1) {
      mins = '0' + mins;
    }
    return horas + ':' + mins;
  }
}
