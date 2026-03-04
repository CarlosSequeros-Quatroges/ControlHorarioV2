import { Component, inject } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { Registro } from '../../interfaces/registro';
import { UsuarioModel } from '../../usuario.model';
import { CosmosService } from '../../services/cosmos.service';
import { Cosmos2datetimePipe } from '../../pipes/cosmos2datetime.pipe';
import { SumPipe } from '../../pipes/sum.pipe';
import { DatePipe, CommonModule } from '@angular/common';
import { RegistroComponent } from '../registro/registro.component';
import { DatosCtrlRegistro } from '../../interfaces/datos-ctrl-registro';
import { RegistroModo } from '../../interfaces/registro-modo';
import { DuracionPipe } from '../../pipes/duracion.pipe';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";


@Component({
  selector: 'app-registro-jornada',
  imports: [RouterModule, DatePipe, DuracionPipe, CommonModule, RegistroComponent, FooterComponent, NavbarComponent],
  templateUrl: './registro-jornada.component.html',
  styleUrl: './registro-jornada.component.css'
})
export class RegistroJornadaComponent {

  route: ActivatedRoute = inject(ActivatedRoute)
  usuario: UsuarioModel = inject(UsuarioModel)
  auth: AuthService = inject(AuthService)
  cosmos: CosmosService = inject(CosmosService)
  router: Router = inject(Router)

  datepipe: DatePipe = inject(DatePipe)
  cosmos2date: Cosmos2datetimePipe = inject(Cosmos2datetimePipe)
  sum: SumPipe= inject(SumPipe)

  enModo: typeof RegistroModo = RegistroModo;
  datosActual!: DatosCtrlRegistro
  datos!: DatosCtrlRegistro
  registroActual!: Registro
  registros!: Registro[]
  date!: Date;
  jornada!: string
  modo!: string
  laborable!: string

  constructor(

  ) {
    setInterval(() => {
      this.date = new Date()
      this.jornada = "0"
      if (this.registros) {
        this.jornada = this.sum.transform(this.registros,"duracion")
      }
      if (this.registroActual && this.registroActual.inicio){

          //calcula el tiempo transcurrido desde el inicio (jornada no finalizada)
          let date1 =new Date(this.cosmos2date.transform(this.registroActual.inicio))
          let time = this.date.getTime() -date1.getTime()
          let duracion: number = parseInt(String(time/60000),10)
          this.jornada = String(Number(this.jornada)+ duracion)

      }
    })

    //en registro de jornada solo se puede pulsar entrada o salida. No se puede editar
    //los registros son del día
    this.datosActual = {
      bloqueado: false,
      modo: this.enModo.REGISTRO,
      administrador: false
    };
    this.datos = {
      bloqueado:true,
      modo: this.enModo.REGISTRO,
      administrador: false
    };

    if (this.usuario.admin) {
      this.datosActual.bloqueado = true;
      this.datosActual.administrador = true;
      this.datos.administrador = true;
    }
    this.registros = Array<Registro>()
  }

  ngOnInit(): void {

    this.usuario = this.auth.leerUsuario()

    if (!this.usuario || this.usuario.nombre === '') {
      this.auth.logout()
      this.router.navigateByUrl("/login")
      return
    }

    if (this.usuario.force == 1) {
      this.router.navigateByUrl('/new-passwd')
      return;
    }

    this.modo = "R"  //modo registro
    if (this.usuario.admin){
      this.modo = "E" //modo edicion
    }

    Swal.fire({
      text:'Recuperando datos',
      icon: 'info',
      showConfirmButton: false
    })
    Swal.showLoading()


    this.cosmos.recuperaRegistrosDia().subscribe(resp => {

      this.registros = resp.registros
      this.registroActual = resp.registro_actual
      this.laborable = resp.laborable
      console.log("registroActual:"+this.registroActual)

      console.log("registros:"+this.registros)

      Swal.close()

    },
    (err) => {
      Swal.close()

      Swal.fire({
        text:err,
        icon: 'info',
      })

      this.router.navigateByUrl("/home")
    });


  }



  actualizarRegistro(i: number) {
    Swal.fire({
      text:'Actualizando datos',
      icon: 'info',
      showConfirmButton: false
    })

    Swal.showLoading();
    console.log("index:"+i)
    if (i> 0 ) {
      console.log("modoActu: "+this.registros[i].modoIniFinAutoMan)
    }

    var tmpRegistros: Registro[] = new Array<Registro>();

    if (i == 0) {
      this.registroActual.matricula = this.usuario.matricula;
      this.registroActual.codigo = this.usuario.codigo;
      this.registroActual.tipo = "J"

      if (this.registroActual.modoIniFinAutoMan == "IA" ) {
        this.registroActual.manual_inicio = "N";
        this.registroActual.usuario_inicio = this.usuario.matricula;
        this.registroActual.timestamp_inicio = this.registroActual.inicio;

        this.registroActual.validado = "N";
        this.registroActual.usuario_validado ="";
        if ( parseInt("0"+this.registroActual.duracion) > 0 ) {
          this.registroActual.validado = "S";
          this.registroActual.usuario_validado = this.usuario.matricula;
        }
      }
      else if (this.registroActual.modoIniFinAutoMan == "FA") {
        this.registroActual.manual_final = "N";
        this.registroActual.usuario_final = this.usuario.matricula;
        this.registroActual.timestamp_final = this.registroActual.final;

        this.registroActual.validado = "N";
        this.registroActual.usuario_validado ="";
        if ( parseInt("0"+this.registroActual.duracion) > 0 ) {
          this.registroActual.validado = "S";
          this.registroActual.usuario_validado = this.usuario.matricula;
        }
        if (! this.registroActual.inicio ) { //registra final sin inicio. esto pasa a incidencias
          this.registroActual.validado = "P";
        }
      }

      tmpRegistros.push(this.registroActual);

    }
    else {
      if (this.registros[i].modoIniFinAutoMan == "VA") {  //validar registro manual de usuario
      this.registros[i].validado = "S";
      this.registros[i].usuario_validado = this.usuario.admin_user;
      }
      tmpRegistros.push(this.registros[i]);
    }


    this.cosmos.actualizaRegistros(this.usuario,tmpRegistros).subscribe(resp => {

      Swal.close()

console.log("Registro actualizado "+resp.errnum )
      if (resp.errnum == 0){
        //recupero ID
        if (resp.ids.length > 0 ){
          this.registroActual.id = "" +resp.ids[0];
        }
        this.usuario.force =0;
        this.router.navigateByUrl("/home");
      }
      else {

        Swal.fire({
          text:'Error actualizando datos. '+resp,
          icon: 'warning',
          showConfirmButton: false
        })

      }

    }, (err) => {

      Swal.fire({
        text:err,
        icon: 'info',
      })
    })
  }

}
