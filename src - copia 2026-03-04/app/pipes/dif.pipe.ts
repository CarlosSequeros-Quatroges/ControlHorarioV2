import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dif'
})
export class DifPipe implements PipeTransform {

  transform(a: number, b: number): string {
    if (a > b) {
      return  String(a - b )
    }
    else {
      return  String(b - a )
    }
  }

}
