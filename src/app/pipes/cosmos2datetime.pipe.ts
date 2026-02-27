import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'cosmos2datetime'
})
export class Cosmos2datetimePipe implements PipeTransform {
  constructor(
    private datepipe: DatePipe
     ) {
  }

  transform(value: string): string {
    var fecha: string = value.split(" ")[0]
    var hora: string = value.split(" ")[1]
    var fecha1 = fecha.substring(6,10)+"-"+fecha.substring(3,5)+"-"+fecha.substring(0,2)
    return fecha1+" "+hora;
  }

}
