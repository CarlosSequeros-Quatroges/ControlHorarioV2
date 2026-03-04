import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router,RouterModule,ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

import { NavbarComponent } from '../navbar/navbar.component';
import { UsuarioModel } from './../../usuario.model';
import { AuthService } from '../../services/auth.service';
import { NewPasswd } from './../../interfaces/new-passwd';

@Component({
  selector: 'app-change-passwd',
  imports: [ReactiveFormsModule,NavbarComponent, CommonModule, RouterModule],
  templateUrl: './change-passwd.component.html',
  styleUrl: './change-passwd.component.css'
})
export class ChangePasswdComponent {

   route: ActivatedRoute = inject(ActivatedRoute);
   usuario: UsuarioModel = inject(UsuarioModel);
   auth: AuthService = inject(AuthService);

   //campos formulario y validaciones
  newPasswdForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)
    ])),
    newPassword: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
      this.validateSamePassword
    ])),
    confirmPassword: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
      this.validateMatchPassword
    ])),

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
      { type: 'maxlength', message: 'Tamaño de clave demasiado largo.' },
      { type: 'notMatch', message: 'Las claves no coinciden.' },
      { type: 'notSame', message: 'La nueva clave debe ser diferente a la anterior.' }
    ],

  }

  constructor (
    private router: Router
    ){}

  private validateMatchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('newPassword');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { 'notMatch': true };

  }

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const oldPassword = control.parent?.get('oldPassword');
    const newPassword = control.parent?.get('newPassword');
    return oldPassword?.value != newPassword?.value ? null : { 'notSame': true };

  }

  graba() {
    if (this.newPasswdForm.invalid) {return;}

    Swal.fire({
      text:'Actualizando clave',
      icon: 'info',
      timer: 1000,
      showConfirmButton: false
    });

    // llamar a método change-paswwd rest api


    let newPassword: NewPasswd  = {} as NewPasswd;
    newPassword.email = this.usuario.email;
    newPassword.password = this.newPasswdForm.get("oldPassword")?.value;
    newPassword.newPassword = this.newPasswdForm.get("newPassword")?.value;

    this.auth.grabaPassword(newPassword).subscribe(resp => {

      Swal.close()

      if (resp == ''){
        this.usuario.force =0
        this.router.navigateByUrl('/home');
      }
      else {

        Swal.fire({
          text:resp,
          icon: 'info',
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
