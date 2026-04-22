import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { DatosCtrlRegistro } from '../../../interfaces/datos-ctrl-registro';
import { Registro } from '../../../interfaces/registro';
import { FiltrarPipe } from '../../../pipes/filtrar.pipe';
import { Min2hourMinPipe } from '../../../pipes/min2hour-min.pipe';
import { Totales } from '../../../interfaces/totales';
import { Cosmos2datetimePipe } from '../../../pipes/cosmos2datetime.pipe';
import { Cosmos2datePipe } from '../../../pipes/cosmos2date.pipe';

@Component({
  selector: 'app-home-list',
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    Min2hourMinPipe,
    FiltrarPipe,
    Cosmos2datetimePipe,
    DatePipe,
  ],
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.css',
})
export class HomeListComponent {
  @Input() registros!: Registro[];
  @Input() totales!: Totales[];
  mes: String = '';

  datos!: DatosCtrlRegistro;

  cosmos2datePipe: Cosmos2datePipe = inject(Cosmos2datePipe);
  datePipe: DatePipe = inject(DatePipe);

  constructor() {
    effect(() => {
      if (this.registros) {
        const tmp: string = this.cosmos2datePipe.transform(
          this.registros[0].fecha ?? '',
        );
        this.mes = this.datePipe.transform(tmp, 'MMMM yyyy') ?? '';
      }
    });
  }

  ngOnInit() {}
}
