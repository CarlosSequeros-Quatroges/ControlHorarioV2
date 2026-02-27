import { Component, computed, OnInit, Signal } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
import { CosmosService } from '../../services/cosmos.service';
import { RespVacaciones } from '../../interfaces/resp-vacaciones';
import { RegistroVacaciones } from '../../interfaces/registro-vacaciones';
import { Cosmos2datePipe } from '../../pipes/cosmos2date.pipe';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-vacaciones',
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './vacaciones.component.html',
  styleUrl: './vacaciones.component.css',
})
export class VacacionesComponent implements OnInit {
  vacaciones: RegistroVacaciones[] = [];

  ejercicio: string = '2025';
  totalDias: number = 0;
  diasAsignados: number = 0;
  disfrutados: number = 0;
  pendientes: number = 0;
  desde: string = '';
  hasta: string = '';

  anios: string[] = [];
  anio: FormControl<string | null> = new FormControl<string>(
    new Date().getFullYear().toString(),
  );

  constructor(
    private cosmos: CosmosService,
    private cosmos2date: Cosmos2datePipe,
    private datepipe: DatePipe,
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 1; i <= currentYear; i++) {
      this.anios.push(i.toString());
    }
    this.anios.reverse();

    this.anio = new FormControl(this.anios[0]);

    this.cargaRegistros(this.anio.value || new Date().getFullYear().toString());
  }

  cargaRegistros(anio: string | null) {
    if (!anio) {
      anio = new Date().getFullYear().toString();
    }

    Swal.fire({
      text: 'Recuperando registros',
      icon: 'info',
      showConfirmButton: false,
    });
    Swal.showLoading();

    this.cosmos.recuperaVacaciones(anio).subscribe(
      (resp: RespVacaciones) => {
        //dias con registros
        this.vacaciones = resp.vacaciones;
        this.ejercicio = resp.ejercicio;
        this.totalDias = resp.totalDias;
        this.diasAsignados = resp.diasAsignados;
        this.disfrutados = resp.disfrutados;
        this.pendientes =
          (resp.totalDias || 0) - (resp.disfrutados || 0) < 0
            ? 0
            : (resp.totalDias || 0) - (resp.disfrutados || 0);
        this.desde = resp.desde;
        this.hasta = resp.hasta;

        Swal.close();
      },
      (err) => {
        Swal.close();

        Swal.fire({
          text: err,
          icon: 'info',
        });
      },
    );

    console.log('Version 19-10-2021 22:00');
  }
}
