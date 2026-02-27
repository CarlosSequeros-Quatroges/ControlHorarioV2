import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {


  transform(array: any[], campo: string, orden: number): any {
    if(!array || array === undefined || array.length === 0) return null;

    array.sort((a: any, b: any) => {

      if (a[campo] < b[campo]) {
        return -1* orden;
      } else if (a[campo] > b[campo]) {
        return 1*orden;
      } else {
        return 0;
      }
    });

    return array;
  }

}
