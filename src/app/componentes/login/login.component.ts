import { Component,inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router,RouterModule,ActivatedRoute } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';

import { Login } from '../../interfaces/login';
import { LocalStorageService } from '../../services/local-storage.service';
import { UsuarioModel } from '../../usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatCheckboxModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  usuario: UsuarioModel = inject(UsuarioModel);
  auth: AuthService = inject(AuthService);

  readonly labelPosition = model<'before' | 'after'>('before');


  //campos formulario y validaciones
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50),
      Validators.email,
    ])),

    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)
    ])),

    recordar: new FormControl(),

  })


  error_messages = {
    'email': [
      { type: 'required', message: 'Introduzca Email.' },
      { type: 'minlength', message: 'Longitud de Email menor de 5.' },
      { type: 'maxlength', message: 'Longitud de Email mayor de 50.' },
      { type: 'email', message: 'Introduzca un Email válido.' }
    ],

    'password': [
      { type: 'required', message: 'Introduzca clave.' },
      { type: 'minlength', message: 'Tamañó de clave demasiado corto.' },
      { type: 'maxlength', message: 'Tamaño de clave demasiado largo.' }
    ],

  }

// dialog
  isPopupVisible: boolean = false;
  isCerrarVisible: boolean = false;
  titulo: string = 'Error';
  mensaje: string = 'Formulario inválido';


  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm.get("email")?.setValue('');
    this.loginForm.get("password")?.setValue( '');
    this.loginForm.get("recordar")?.setValue(false);

    if (this.localStorageService.getItem('email') ) {
      this.loginForm.get("email")?.setValue( String(this.localStorageService.getItem('email')))
      this.loginForm.get("recordar")?.setValue(true)

      if (this.auth.estaAutenticado() ){
        this.router.navigateByUrl('/registro-jornada')
      }

    }
  }

  validar( ) {

    if (this.loginForm.invalid) {
      Swal.fire({
        title: "Control de acceso",
        text: "Revise datos de email y clave",
        icon: "error",
        allowOutsideClick:false,
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    let login: Login  = {} as Login
    login.email = this.loginForm.get("email")?.value
    login.password = this.loginForm.get("password")?.value
    login.recordar = this.loginForm.get("recordar")?.value

    Swal.fire({
      title: "Autenticando",
      text: "Validando usuario. Espere por favor",
      allowOutsideClick:false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      didClose: () => {
        Swal.hideLoading();
      }
    });


    this.auth.login(login).subscribe(resp => {
      Swal.close;
      if (resp.errnum != 0) {

        Swal.fire({
          text: "Error validando acceso"+resp.errdesc+" (Error "+resp.errnum+")",
          icon: "error",
          allowOutsideClick:false,
          showCancelButton: false,
          confirmButtonText: "Aceptar"
        });

        return;
      }

      this.usuario.id = resp.id
      this.usuario.codigo = resp.codigo
      this.usuario.matricula = resp.matricula
      this.usuario.email = resp.email
      this.usuario.nombre = resp.nombre
      this.usuario.token_api =resp.token

      var datehour: string[] = resp.valido.split(' ')
      var date1: string[]  = datehour[0].split('/')
      var newdate: string = date1[2]+"-"+date1[1]+"-"+date1[0]+" "+datehour[1]
      this.usuario.valido_hasta = newdate

      this.usuario.force = resp.force
      this.usuario.admin = resp.admin
      this.usuario.admin_user = resp.admin_user

      let mensaje: string  = this.usuario.nombre
      if (this.usuario.admin ){
        mensaje = this.usuario.nombre + " ( Administrador "+this.usuario.admin_user+")"
      }
      Swal.fire({
        title: "Acceso correcto",
        text: mensaje,
        icon: "success",
        allowOutsideClick:false,
        showCancelButton: false,
        confirmButtonText: "Aceptar"
      })

      this.auth.guardarUsuario(this.usuario)
      this.auth.guardarToken(this.usuario.token_api, this.usuario.valido_hasta)

      if (login.recordar) {
        localStorage.setItem('email',login.email)
      }
      else {
        localStorage.removeItem('email')
      }

      console.log("usuario force: "+this.usuario.force)

      if (this.usuario.force == 1) {
        this.router.navigateByUrl('/new-passwd')
        console.log('cambiar clave new-passwd')

      }
      else {
      console.log("usuario admin: "+this.usuario.admin)
        if (! this.usuario.admin) {
          this.router.navigateByUrl('/registro-jornada')
          console.log('registro-jornada usuario normal')
        }
        else {
          this.router.navigateByUrl('/registro-jornada')
          console.log('home administrador')
        }
      }


    }, (err) => {
            this.usuario = new UsuarioModel()
      console.log("Login error response api. "+err)
      Swal.fire({
        text: "Tiempo de espea agotado",
        icon: "error",
        allowOutsideClick:false,
        showCancelButton: false,
        confirmButtonText: "Aceptar"
      })

    })

  }

}
