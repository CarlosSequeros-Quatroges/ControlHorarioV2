import { Component, inject, OnInit } from '@angular/core';
import { UsuarioModel } from '../../../usuario.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RegistroVacaciones } from '../../../interfaces/registro-vacaciones';

@Component({
  selector: 'app-carta-vacaciones',
  imports: [DatePipe],
  templateUrl: './carta-vacaciones.component.html',
  styleUrl: './carta-vacaciones.component.css',
})
export class CartaVacacionesComponent implements OnInit {
  public hoy: Date = new Date();
  public sub: string = '';

  private router = inject(Router);

  public fechaIncorporar!: Date;
  public datos!: RegistroVacaciones;
  constructor(public usuario: UsuarioModel) {
    this.datos = this.router.getCurrentNavigation()?.extras.state?.['data'];
    this.fechaIncorporar = new Date(this.datos.hasta);
    this.fechaIncorporar.setDate(this.fechaIncorporar.getDate() + 1);
  }

  ngOnInit(): void {}

  volver() {
    window.history.back();
  }
}
