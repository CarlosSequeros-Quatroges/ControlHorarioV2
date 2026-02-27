import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cosmos2date'
})
export class Cosmos2datePipe implements PipeTransform {

  transform(value: string): string {
    var fecha: string = value
    var fecha1: string = fecha.substring(6,10)+"-"+fecha.substring(3,5)+"-"+fecha.substring(0,2)
    return fecha1;

  }

}
