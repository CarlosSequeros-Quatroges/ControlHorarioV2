import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { DatosCtrlRegistro } from '../../../interfaces/datos-ctrl-registro';
import { Registro } from '../../../interfaces/registro';
import { DuracionPipe } from '../../../pipes/duracion.pipe';
import { FiltrarPipe } from '../../../pipes/filtrar.pipe';
import { RegistroComponent } from '../../registro/registro.component';
import { Totales } from './../../../interfaces/totales';
import { RegistroModo } from '../../../interfaces/registro-modo';

@Component({
  selector: 'app-home-screen',
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    RegistroComponent,
    MatIconModule,
    DuracionPipe,
    FiltrarPipe,
  ],
  templateUrl: './home-screen.component.html',
  styleUrl: './home.component.css',
})
export class HomeScreenComponent {
  @Input() registros!: Registro[];
  @Input() totales!: Totales[];
  @Input() bloqueado!: boolean;
  @Input() administrador!: boolean;
  @Input() modo!: RegistroModo;

  @Input() hayRegistroActual!: boolean;

  datos!: DatosCtrlRegistro;

  constructor() {
    effect(() => {
      this.datos = {
        bloqueado: this.bloqueado,
        administrador: this.administrador,
        modo: this.modo,
      };
    });
  }

  ngOnInit() {}
}
