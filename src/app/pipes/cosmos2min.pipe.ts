import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cosmos2min'
})
export class Cosmos2minPipe implements PipeTransform {

  transform(value: string): number {
    var hora: string = value
    console.log("Pipe Cosmos2min")
    console.log(hora)
    var hh: string = hora.substring(0,2)
    var mm: string = hora.substring(3,5)
    console.log(hh)
    console.log(mm)

    var minutos = parseInt(hh) * 60 + parseInt(mm);
    console.log(minutos)
    return minutos;

  }

}
