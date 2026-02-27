import { Cosmos2minPipe } from './../../pipes/cosmos2min.pipe';
import { fileURLToPath } from 'node:url';
import { Jornada } from './../../interfaces/jornada';
import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';

import { FiltrarPipe } from '../../pipes/filtrar.pipe';
import { SumPipe } from '../../pipes/sum.pipe';
import { SortPipe } from '../../pipes/sort.pipe';
import { Cosmos2datePipe } from '../../pipes/cosmos2date.pipe';

import { AuthService } from '../../services/auth.service';
import { CosmosService } from '../../services/cosmos.service';

import { UsuarioModel } from '../../usuario.model';
import { DatosCtrlRegistro } from '../../interfaces/datos-ctrl-registro';
import { RegistroModo } from '../../interfaces/registro-modo';
import { Registro } from '../../interfaces/registro';
import { Totales } from './../../interfaces/totales';
import { RespRegistros } from '../../interfaces/resp-registros';
import { DuracionPipe } from '../../pipes/duracion.pipe';
import { RegistroComponent } from '../registro/registro.component';
import { DifPipe } from '../../pipes/dif.pipe';
import { Min2hourMinPipe } from '../../pipes/min2hour-min.pipe';

@Component({
  selector: 'app-home',
  imports: [ RouterModule,CommonModule,ReactiveFormsModule,
    RegistroComponent,NavbarComponent,
    MatIconModule,
    DuracionPipe,DifPipe,Min2hourMinPipe,FiltrarPipe,SumPipe,SortPipe,Cosmos2datePipe

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  public datos!: DatosCtrlRegistro
  enModo: typeof RegistroModo = RegistroModo;

  public registros!: Registro[]
  public totales!: Totales[]
  public date!: Date;
  public totalesMes!: Totales
  public incidencias!: number
  public diasNoLaborables!: number
  public meses!: string[]

  mes!: FormControl
  min!: string
  max!: string

  usuario: UsuarioModel = inject(UsuarioModel);
  auth: AuthService = inject(AuthService);
  router: Router = inject(Router);
  cosmos: CosmosService = inject(CosmosService);
  http: HttpClient = inject(HttpClient);
  datepipe: DatePipe = inject(DatePipe);
  filtrar: FiltrarPipe = inject(FiltrarPipe);
  sum: SumPipe = inject(SumPipe);
  sort:SortPipe = inject(SortPipe);
  cosmos2datePipe: Cosmos2datePipe = inject(Cosmos2datePipe);
  Cosmos2minPipe: Cosmos2minPipe = inject(Cosmos2minPipe);

  constructor() {

    this.datos = {
      bloqueado: true,
      modo: this.enModo.REGISTRO,
      administrador: false
    };
  }

  ngOnInit() {
    this.datos = {
      bloqueado:false,
      modo: this.enModo.EDICION,
      administrador: false
    };

    this.date = new Date()
    this.mes = new FormControl(this.datepipe.transform(this.date,"yyyy-MM"));
    let YYYY: number = this.date.getFullYear() as number
    YYYY -= 1


    this.max = this.datepipe.transform(this.date,"yyyy-MM") as string
    this.date.setMonth(1)
    this.date.setFullYear(YYYY)
    this.min = this.datepipe.transform(this.date,"yyyy-MM") as string

    this.date = new Date()

    this.usuario = this.auth.leerUsuario();
    if (this.usuario.nombre === '') {
      this.auth.logout();
      this.router.navigateByUrl('/login');
      return;
    }

    this.cargaRegistros((this.date.getMonth()+1)+"/"+this.date.getFullYear());

  }

    public modelChanged(ev:Event, formName:any) {

      if (formName == "mes") {
        this.date =new Date(this.mes.value+"-01"+" 00:00:00")

        let tmp: string = this.datepipe.transform(this.date,"MM/yyyy") as string;

        this.cargaRegistros(tmp);
      }
    }


  cargaRegistros(mes: string) {

    Swal.fire({
      text:'Recuperando registros',
      icon: 'info',
      showConfirmButton: false
    })
    Swal.showLoading()

    this.diasNoLaborables = 0;



    this.cosmos.recuperaRegistrosMes(mes).subscribe((resp: RespRegistros) => {

      this.max = this.datepipe.transform(this.cosmos2datePipe.transform(resp.maxmes),"yyyy-MM") as string
      this.min = this.datepipe.transform(this.cosmos2datePipe.transform(resp.minmes),"yyyy-MM") as string


       //dias con registros
      this.registros = resp.registros
      if (!this.registros){
        this.registros = [];
      }


      //nº de registros con incidencias
      this.incidencias = resp.incidencias
      if (!this.incidencias){
        this.incidencias = 0
      }


      this.totales = []


      //fechas con registro de jornada
      if (resp.fechas) {
        resp.fechas.forEach((valor: string,indice) => {

            var tmp: Totales  = {fecha:'',duracion:'',jornada:'0',diferencia:'0', positivo:true,tipo:'J'}
            tmp.fecha = String(valor)
            tmp.duracion = String(this.totalJornada(this.registros,valor))
            var jornadas: Jornada[] = resp.jornadas.filter((dia) => dia.fecha == valor)

            if (jornadas.length > 0) {
              tmp.jornada =  this.Cosmos2minPipe.transform(jornadas[0].duracion).toString()
            }
            else {tmp.jornada = '480'} // si no hay jornada -> 8h

            tmp.diferencia = String( this.diferencia(Number(tmp.duracion),Number(tmp.jornada)))
            tmp.positivo = (Number(tmp.duracion)>= Number(tmp.jornada))? true: false

            this.totales.push(tmp)
        })
      }
      console.log("totales")
      console.log(this.totales)

      // dias de vacaciones
      if (resp.vacaciones ){
        resp.vacaciones.forEach( (valor:string,indice) => {
          var tmp: Totales  = {fecha:valor,duracion:'0',jornada:'0',diferencia:'0', positivo:true, tipo:'V'}
          this.totales.push(tmp)
          this.diasNoLaborables += 1
        })

      }


      // dias festivos por fin de semana
      var findesemana: string[]= this.diasFinDeSemana()
      if (findesemana){
        findesemana.forEach( (valor:string,indice) => {
          var tmp: Totales  = {fecha:valor,duracion:'0',jornada:'0',diferencia:'0', positivo:true, tipo:'F'}
            if (this.filtrar.transform(this.totales,"fecha",valor).length == 0 ) {
              this.totales.push(tmp)
              this.diasNoLaborables += 1

            }
        })

      }



      //festivos
      if (resp.festivos){
        resp.festivos.forEach( (dia: string,indice) => {
          var tmp: Totales  = {fecha:dia,duracion:'0',jornada:'0',diferencia:'0', positivo:true, tipo:'F'}
          if (this.filtrar.transform(this.totales,"fecha",dia).length == 0 ) {
            this.totales.push(tmp)
            this.diasNoLaborables += 1
          }
        }
        )
      }


      //los dias que faltan añadir registro jornada con 0 horas realizadas en totales
      var diasmes: string[] = this.diasMes()
      diasmes.forEach( (dia:string,indice:number) => {
        if (this.totales.filter(e => e.fecha === dia).length == 0){
          var tmp: Totales  = {fecha:dia,duracion:'0',jornada:'390',diferencia:'390', positivo:false,tipo:'J'}

          var jornadas: Jornada[] = resp.jornadas.filter((jornada) => jornada.fecha == dia)
          if (jornadas.length > 0) {
            tmp.jornada =  this.Cosmos2minPipe.transform(jornadas[0].duracion).toString()
          }
          else {tmp.jornada = '480'} // si no hay jornada -> 8h


          this.totales.push(tmp)

        }
      })


      var diasLaborables = diasmes.length - this.diasNoLaborables

      this.totales = this.sort.transform(this.totales,"fecha",-1)

      this.totalesMes = {fecha:'',duracion:'',jornada:'0',diferencia:'0', positivo:true, tipo:''}
      this.totalesMes.fecha =""
      this.totalesMes.duracion = String(this.sum.transform(this.totales,'duracion'))
      this.totalesMes.jornada = String(this.sum.transform(this.totales,'jornada'))
      this.totalesMes.diferencia = String(this.diferencia(Number(this.totalesMes.duracion),Number(this.totalesMes.jornada)))
      this.totalesMes.positivo = (Number(this.totalesMes.duracion) > Number(this.totalesMes.jornada))? true:false


      Swal.close()


    }, (err) => {
      Swal.close()

      Swal.fire({
        text:err,
        icon: 'info',
      })

    });


    console.log("Version 19-10-2021 22:00");
  }

  totalJornada(registros: Registro[], fecha: string){
    var filtrados = this.filtrar.transform(this.registros,"inicio",fecha)
    var suma = this.sum.transform(filtrados,"duracion")
    return Number(suma)
  }

  diferencia(a: number, b:number) {
    return  (a > b) ? a-b: b-a
  }

  diasFinDeSemana() : string[] {

    var fecha  = this.datepipe.transform(this.date,"yyyy-MM-01") as string
    var my_date = String(this.datepipe.transform(new Date(fecha),"yyyy-MM-dd")).split('-')
    var year = parseInt(my_date[0]);
    var month = parseInt(my_date[1])-1;
    var today = new Date();

    var findesemana: string[]  = [];

    for (var i = 1; i <= new Date(year, month+1, 0).getDate(); i++)
    {
      var date = new Date(year, month, i);

      if (date.getTime() > today.getTime()) {
        break;
      }

      if (date.getDay() == 6)
      {
        findesemana.push(  String(this.datepipe.transform(date,'dd/MM/yyyy')));
      }
      else if (date.getDay() == 0)
      {
        findesemana.push(String(this.datepipe.transform(date,'dd/MM/yyyy')));
      }
    };


    return findesemana;

  }

  diasMes() : string[] {
    var fecha  = this.datepipe.transform(this.date,"yyyy-MM-01") as string
    var my_date = String(this.datepipe.transform(new Date(fecha),"yyyy-MM-dd")).split('-')
    var year = parseInt(my_date[0]);
    var month = parseInt(my_date[1])-1;
    var today = new Date();

    var diasmes: string[]  = [];

    for (var i = 1; i <= new Date(year, month+1, 0).getDate(); i++)
    {
      var date = new Date(year, month, i);

      if (date.getTime() > today.getTime()) {
        break;
      }
      diasmes.push(String(this.datepipe.transform(date,'dd/MM/yyyy')));
    };

    return diasmes;

  }



}
