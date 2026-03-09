import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
import { CosmosService } from '../../services/cosmos.service';
import { RespVacaciones } from '../../interfaces/resp-vacaciones';
import { RegistroVacaciones } from '../../interfaces/registro-vacaciones';
import { Cosmos2datePipe } from '../../pipes/cosmos2date.pipe';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { UsuarioModel } from '../../usuario.model';
import { Router } from '@angular/router';
import { Registro } from '../../interfaces/registro';
import { RespBase } from '../../interfaces/resp-base';

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

  presentacion: WritableSignal<string> = signal('');
  listado: WritableSignal<string> = signal('oculto');

  constructor(
    private cosmos: CosmosService,
    private cosmos2date: Cosmos2datePipe,
    private datepipe: DatePipe,
    public usuario: UsuarioModel,
    public router: Router,
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 1; i <= currentYear; i++) {
      this.anios.push(i.toString());
    }
    this.anios.reverse();

    this.anio = new FormControl(this.anios[0]);

    this.cargaRegistros(this.anio.value || new Date().getFullYear().toString());

    window.addEventListener('afterprint', () => {
      console.log('afterprint event triggered');
      this.presentacion.set('');
      this.listado.set('oculto');
    });
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

        console.log('resp.totalDias', resp.totalDias);
        console.log('resp.disfrutados', resp.disfrutados);

        this.pendientes =
          (resp.diasAsignados || 0) - (resp.disfrutados || 0) < 0
            ? 0
            : (resp.diasAsignados || 0) - (resp.disfrutados || 0);
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
  }

  listar() {
    this.presentacion.set('oculto');
    this.listado.set('');
    setTimeout(() => {
      document.title = `Vacaciones ${this.ejercicio} - ${this.usuario.nombre}`;
      window.print();
    }, 1000);
  }

  fechaListado(): string {
    return this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') || '';
  }

  verCarta(datos: RegistroVacaciones) {
    this.router.navigate(['/carta-vacaciones'], {
      state: { data: datos },
    });
  }

  descargaCarta(datos: RegistroVacaciones) {
    let textResult = datos.b64File;
    let binStr = window.atob(textResult);

    const src = `data:application/pdf;base64,${textResult}`;
    const link = document.createElement('a');

    link.href = src;
    link.download =
      'Carta de vacaciones' +
      this.usuario.nombre +
      ' ' +
      datos.fecha.replace('/', '-') +
      '.pdf';
    link.click();
  }

  onFileChange(event: any, datos: RegistroVacaciones) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (file.type === 'application/pdf') {
        datos.uploadFile = file.name;
      } else {
        alert('Solo archivos PDF');
        datos.uploadFile = '';
      }

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const resuttado: string = reader.result?.toString() || '';
        const b64 = resuttado.split(',')[1];
        console.log(b64);
        datos.b64UploadFile = b64;
        this.subeCarta(datos);
      };

      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }

  subeCarta(datos: RegistroVacaciones) {
    Swal.fire({
      text: 'Subiendo archivo',
      icon: 'info',
      showConfirmButton: false,
    });
    Swal.showLoading();

    this.cosmos
      .subeCarta(
        this.usuario.codigo,
        this.usuario.matricula,
        datos.fecha,
        datos.b64UploadFile,
      )
      .subscribe(
        (resp: String) => {
          console.log('Archivo enviado ', resp);
          datos.b64File = datos.b64UploadFile;
          datos.carta = 'S';
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

  onDragOver(event: any) {
    event.preventDefault();
  }

  // From drag and drop
  onDropSuccess(event: any, datos: RegistroVacaciones) {
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        datos.uploadFile = file.name;

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const resuttado: string = reader.result?.toString() || '';
          const b64 = resuttado.split(',')[1];
          datos.b64UploadFile = b64;
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
          alert('Error leyendo archivo!!');
          datos.uploadFile = '';
          datos.b64UploadFile = '';
        };
      } else {
        alert('Solo archivos PDF');
        datos.uploadFile = '';
        datos.b64UploadFile = '';
      }
    }
  }
}
