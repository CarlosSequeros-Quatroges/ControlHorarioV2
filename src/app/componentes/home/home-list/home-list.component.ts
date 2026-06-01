import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class HomeListComponent implements OnChanges {
  @Input() registros!: Registro[];
  @Input() totales!: Totales[];
  @Input() totalesMes?: Totales;
  @Input() nombreUsuario: string = '';
  mes: String = '';
  totalListado: Totales = {
    fecha: '',
    duracion: '0',
    jornada: '0',
    diferencia: '0',
    positivo: true,
    tipo: 'J',
  };

  datos!: DatosCtrlRegistro;

  cosmos2datePipe: Cosmos2datePipe = inject(Cosmos2datePipe);
  datePipe: DatePipe = inject(DatePipe);

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['registros']) {
      this.actualizarMes();
    }
    if (changes['totales'] || changes['totalesMes']) {
      this.actualizarTotalListado();
    }
  }

  private actualizarMes() {
    if (!this.registros || this.registros.length === 0) {
      this.mes = '';
      return;
    }

    const tmp: string = this.cosmos2datePipe.transform(
      this.registros[0].fecha ?? '',
    );
    this.mes = this.datePipe.transform(tmp, 'MMMM yyyy') ?? '';
  }

  private actualizarTotalListado() {
    if (this.totalesMes) {
      this.totalListado = { ...this.totalesMes };
      return;
    }

    const duracion = (this.totales ?? []).reduce((acum, item) => {
      const min = Number(item.duracion);
      return acum + (Number.isFinite(min) ? min : 0);
    }, 0);

    const jornada = (this.totales ?? []).reduce((acum, item) => {
      const min = Number(item.jornada);
      return acum + (Number.isFinite(min) ? min : 0);
    }, 0);

    this.totalListado = {
      fecha: '',
      duracion: String(duracion),
      jornada: String(jornada),
      diferencia: String(Math.abs(duracion - jornada)),
      positivo: duracion >= jornada,
      tipo: 'J',
    };
  }

  ngOnInit() {}
}
