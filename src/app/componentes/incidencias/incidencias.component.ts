import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import { CosmosService } from '../../services/cosmos.service';
import { RegistroComponent } from '../registro/registro.component';
import { RegistroModo } from '../../interfaces/registro-modo';
import { DatosCtrlRegistro } from '../../interfaces/datos-ctrl-registro';
import { UsuarioModel } from '../../usuario.model';
import { AuthService } from '../../services/auth.service';
import { Registro } from '../../interfaces/registro';
import { NavbarComponent } from '../navbar/navbar.component';
import { Cosmos2datetimePipe } from '../../pipes/cosmos2datetime.pipe';

@Component({
  selector: 'app-incidencias',
  imports: [
    RegistroComponent,
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
  ],
  templateUrl: './incidencias.component.html',
  styleUrl: './incidencias.component.css',
})
export class IncidenciasComponent {
  incidencias!: Registro[];
  datos!: DatosCtrlRegistro;
  usuario: UsuarioModel = inject(UsuarioModel);
  auth: AuthService = inject(AuthService);
  router: Router = inject(Router);
  cosmos: CosmosService = inject(CosmosService);
  datepipe: DatePipe = inject(DatePipe);

  http: HttpClient = inject(HttpClient);

  enModo: typeof RegistroModo = RegistroModo;

  date!: Date;
  mes!: FormControl;
  min!: string;
  max!: string;

  cosmos2date: Cosmos2datetimePipe = inject(Cosmos2datetimePipe);

  ngOnInit() {
    this.datos = {
      bloqueado: false,
      modo: this.enModo.EDICION,
      administrador: false,
    };

    this.date = new Date();
    this.mes = new FormControl(this.datepipe.transform(this.date, 'yyyy-MM'));

    let MM: number = this.date.getMonth() as number;
    let YYYY: number = this.date.getFullYear() as number;
    MM -= 1;
    if (MM < 0) {
      MM += 12;
      YYYY -= 1;
    }

    this.max = this.datepipe.transform(this.date, 'yyyy-MM') as string;
    this.date.setMonth(MM);
    this.date.setFullYear(YYYY);
    this.min = this.datepipe.transform(this.date, 'yyyy-MM') as string;

    this.usuario = this.auth.leerUsuario();

    if (this.usuario.nombre === '') {
      this.auth.logout();
      this.router.navigateByUrl('/login');
      return;
    }

    Swal.fire({
      text: 'Recuperando incidencias',
      icon: 'info',
      showConfirmButton: false,
    });
    Swal.showLoading();

    this.cosmos
      .recuperaIncidenciasMes(
        '' + this.datepipe.transform(new Date(), 'dd/MM/yyyy'),
      )
      .subscribe(
        (resp) => {
          this.incidencias = resp.incidencias;
          if (!this.incidencias) {
            this.incidencias = [];
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
  }

  public modelChanged(ev: Event, formName: any) {
    if (formName == 'mes') {
      var date: Date = new Date(this.mes.value + '-01' + ' 00:00:00');

      //recuperar registros
      Swal.fire({
        text: 'Recuperando incidencias',
        icon: 'info',
        showConfirmButton: false,
      });
      Swal.showLoading();
      let tmp: string = this.datepipe.transform(date, 'dd/MM/yyyy') as string;

      this.cosmos.recuperaIncidenciasMes(tmp).subscribe(
        (resp) => {
          this.incidencias = resp.incidencias;
          if (!this.incidencias) {
            this.incidencias = [];
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
    }
  }

  actualizaRegistros() {
    var tmpRegistros: Registro[] = new Array<Registro>();

    this.incidencias.forEach((registro: Registro, indice) => {
      if ((registro.modoIniFinAutoMan?.indexOf('IM') || 0) > 0) {
        registro.manual_inicio = 'S';
        registro.usuario_inicio = this.usuario.matricula;
        registro.validado = 'P';
        registro.usuario_validado = '';
        registro.modifica_inicio = 'S';
        registro.modifica_final = 'N';

        //esto no debo permitirlo. admin no graba horarios. siempre el usuario
        if (this.usuario.admin) {
          registro.usuario_inicio = this.usuario.admin_user;
          registro.validado = 'S';
          registro.usuario_validado = this.usuario.admin_user;
        }

        registro.timestamp_inicio =
          '' + this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
      } else if ((registro.modoIniFinAutoMan?.indexOf('FM') || 0) > 0) {
        registro.manual_final = 'S';
        registro.usuario_final = this.usuario.matricula;
        registro.validado = 'P';
        registro.usuario_validado = '';
        registro.modifica_inicio = 'N';
        registro.modifica_final = 'S';

        //no permitir  ocultar boton actualizar y calendario seleccionar
        if (this.usuario.admin) {
          registro.usuario_final = this.usuario.admin_user;
          registro.validado = 'S';
          registro.usuario_validado = this.usuario.admin_user;
        }
        registro.timestamp_final =
          '' + this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
      }

      if (registro.actualizar == true) {
        if (registro?.inicio && registro?.final) {
          let date1 = new Date(this.cosmos2date.transform(registro?.inicio));
          let date2 = new Date(this.cosmos2date.transform(registro?.final));
          let time = date2.getTime() - date1.getTime();
          registro.duracion = String(parseInt(String(time / 60000), 10));
        }
        tmpRegistros.push(registro);
      }
    });

    if (tmpRegistros.length == 0) {
      return;
    }

    Swal.fire({
      text: 'Actualizando datos',
      icon: 'info',
      showConfirmButton: false,
    });

    Swal.showLoading();
    //aqui ya se que usuario actualiza y si es administrador o no
    this.cosmos.actualizaRegistros(this.usuario, tmpRegistros).subscribe(
      (resp) => {
        Swal.close();

        if (resp.errnum == 0) {
          this.usuario.force = 0;
          this.router.navigateByUrl('/registro-jornada');
        } else {
          Swal.fire({
            text: 'Error actualizando datos. ' + resp,
            icon: 'warning',
            showConfirmButton: false,
          });
        }
      },
      (err) => {
        Swal.fire({
          text: err,
          icon: 'info',
        });
      },
    );
  }
}
