import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { CosmosService } from '../../services/cosmos.service';
import { RespVacaciones } from '../../interfaces/resp-vacaciones';
import { RegistroVacaciones } from '../../interfaces/registro-vacaciones';

@Component({
  selector: 'app-vacaciones',
  imports: [CommonModule],
  templateUrl: './vacaciones.component.html',
  styleUrl: './vacaciones.component.css',
})
export class VacacionesComponent implements OnInit {
  vacaciones: RegistroVacaciones[] = [];
  ejercicio: string = '2025';
  totalDias: number = 0;

  constructor(private cosmos: CosmosService) {}

  ngOnInit(): void {
    this.cargaRegistros('2025');
  }

  cargaRegistros(mes: string) {
    Swal.fire({
      text: 'Recuperando registros',
      icon: 'info',
      showConfirmButton: false,
    });
    Swal.showLoading();

    this.cosmos.recuperaVacaciones('2025').subscribe(
      (resp: RespVacaciones) => {
        //dias con registros
        this.vacaciones = resp.vacaciones;
        this.ejercicio = resp.ejercicio;
        if (!this.vacaciones) {
          this.vacaciones = [];
          this.totalDias;
        } else {
          this.totalDias = this.totalDiasVacaciones();
        }

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

  totalDiasVacaciones(): number {
    let total: number = 0;
    this.vacaciones.forEach((vac) => {
      if (+vac.dias) {
        total += Number(vac.dias);
      }
      console.log('Total dias vacaciones ' + total);
    });
    return total;
  }
}
