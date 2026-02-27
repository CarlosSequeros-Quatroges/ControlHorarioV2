import { Registro } from './../../interfaces/registro';
import { DatePipe, CommonModule } from '@angular/common';
import { Component,  Input, Output, EventEmitter, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule} from '@angular/material/icon'
import Swal from 'sweetalert2'

import { RegistroModo } from '../../interfaces/registro-modo';
import { DuracionPipe } from '../../pipes/duracion.pipe';
import { Cosmos2datetimePipe } from '../../pipes/cosmos2datetime.pipe';
import { Cosmos2datePipe } from '../../pipes/cosmos2date.pipe';
import { DatosCtrlRegistro } from './../../interfaces/datos-ctrl-registro';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, Cosmos2datetimePipe, Cosmos2datePipe, DuracionPipe,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule
  ],

  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent {
  @Input() datos!: DatosCtrlRegistro
  @Input() registro!: Registro

  @Output () actualizar: EventEmitter<string> = new EventEmitter();
  enModo: typeof RegistroModo = RegistroModo;

  datepipe: DatePipe = inject(DatePipe);
  cosmos2date: Cosmos2datetimePipe = inject(Cosmos2datetimePipe);

  horaInicio=  new FormControl();
  horaFinal= new  FormControl();
  hayInicio: boolean;
  hayFinal: boolean;

  constructor() {
    this.hayInicio = false;
    this.hayFinal = false;
  }

  ngOnInit(): void {

    if (this.registro?.inicio) {
      this.hayInicio = true;
    }
    if (this.registro?.final) {
      this.hayFinal = true;
    }

    this.registro.actualizar = false;
  }


  //----------------- edicion de registro manual


  public modelChanged(ev:Event, formName:any) {

    if (formName == "horaEntrada") {
      //revisar fecha registro
      var date1 =new Date(this.cosmos2date.transform(String(this.registro.final+" 00:00:00")))

      var inicio =  String(this.datepipe.transform(date1,"dd/MM/yyyy"))+" "+this.horaInicio.value+":00";


      this.registro.inicio = inicio;
      this.registro.modoIniFinAutoMan = "IM";
    }
    else  {
      var date1 =new Date(this.cosmos2date.transform(String(this.registro.inicio+" 00:00:00")))
      var final =  String(this.datepipe.transform(date1,"dd/MM/yyyy"))+" "+this.horaFinal.value+":00";
      this.registro.final = final;
      this.registro.modoIniFinAutoMan = "FM";
    }
    this.registro.actualizar = true;

    this.calculaDuracion();
    this.actualizar.emit();

  }
  //----------------------------------------------

  //registro ordinario usando boton entrada
  registraInicio() {

    var inicio: string =  String(this.datepipe.transform(new Date(),'dd/MM/yyyy HH:mm:00'))

    if (this.registro?.final && (this.registro?.final <= inicio)){
      Swal.fire({
        text:'Inicio anterior a final de jornada',
        icon: 'error',
      })
      return;
    }
    this.registro.inicio = inicio
    this.registro.manual_inicio = "N"
    this.calculaDuracion();
    this.registro.modoIniFinAutoMan ="IA"
    this.actualizar.emit()
  }

  registraFinal() {
    var final: string = String(this.datepipe.transform(new Date(),'dd/MM/yyyy HH:mm:00'))
    if (this.registro?.inicio == final) {
      Swal.fire({
        text:'Hora final igual a hora de inicio',
        icon: 'error',
      })
      return;
    }

    if (!this.registro?.inicio) {

      Swal.fire({
        text:'No se ha registrado el INICIO de jornada. ¿Registrar final?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí. Registrar FINAL",
        cancelButtonText: "No. Corregir",
      }).then((resultado) => {
        if (resultado.value) {
          this.registro.final = final
          this.calculaDuracion();
          this.registro.modoIniFinAutoMan ="FA";
          this.actualizar.emit();
        }
      })

    }
    else {
      this.registro.final = final
      this.calculaDuracion();
      this.registro.modoIniFinAutoMan ="FA";
      this.actualizar.emit()
    }


  }

  calculaDuracion() {

    if (this.registro?.inicio  && this.registro?.final) {
      let date1 =new Date(this.cosmos2date.transform(this.registro?.inicio))
      let date2 = new Date(this.cosmos2date.transform(this.registro?.final))
      let time = date2.getTime() -date1.getTime()
      this.registro.duracion = String(parseInt(String(time/60000),10))
    }
  }

  validar() {
    this.registro.modoIniFinAutoMan = "VA";
    Swal.fire({
      text:'¿Validar el registro manual pendiente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Validar",
      cancelButtonText: "Cancelar",
    }).then((resultado) => {
      if (resultado.value) {
        this.registro.validado = "S"
        this.registro.modoIniFinAutoMan = "VA"
        this.actualizar.emit();
      }
    })



  }

}
