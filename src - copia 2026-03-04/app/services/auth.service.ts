import { Injectable, inject } from '@angular/core';
import {Md5} from 'ts-md5/dist/esm/md5';
import { Login } from '../interfaces/login';
import { UsuarioModel } from '../usuario.model';
import { HttpClient ,  HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError, timeout, TimeoutError } from 'rxjs';
import { RespLogin } from '../interfaces/resp-login';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NewPasswd } from '../interfaces/new-passwd';
import { RespBase } from './../interfaces/resp-base';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  usuario: UsuarioModel = inject(UsuarioModel);
  datepipe: DatePipe = inject(DatePipe);
  router: Router = inject(Router)

constructor() {}

//private url: string = "http://192.168.1.51:8090/qges/rest/personal"
private url: string = "/qges/rest/personal"


  login (login: Login): Observable<RespLogin> {

    let hash = Md5.hashStr(login.password)

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Headers', 'origin,content-type, accept,authorization,securityToken,Access-Control-Allow-Origin')



    const data = {"email": login.email,"hash":hash}

    return this.http.post<RespLogin>(`${this.url}/valida-login`,data, {headers}, )
     .pipe(
        map( (resp) => {
          return resp;
        }),
        timeout({
          each: 3000,
          with: () => throwError(() => new Error("Timeout Error!!!"))
        }),
        catchError((err) => {
          return throwError((err) = new Error(err.status+" "+err.statusText))
        })
      )
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('valid')
    localStorage.removeItem('usuario')
    this.usuario = new UsuarioModel()
    this.router.navigateByUrl('login')
  }


  grabaPassword (newPassword: NewPasswd): Observable<string> {

    let email = newPassword.email
    let hash = Md5.hashStr(newPassword.password)
    let newHash = Md5.hashStr(newPassword.newPassword)

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Origin', '*')
    .append('Access-Control-Allow-Headers', 'origin, content-type, accept,authorization,securityToken,access-control-allow-origin')



    const data = {"email": email ,"hash":hash, "newhash":newHash}

    return this.http.post<RespBase>(`${this.url}/new-password`,data, {headers} )
      .pipe(
        map( (resp) => {

          if (resp.errnum == 0) {
            return ""
          }
          return resp.errdesc+"("+resp.errnum+")"
        }),
        catchError((err) => {
          return throwError(err.status+" "+err.statusText)

        })
      )
  }

  //------------------------------------------------------------------------------------------------------
  guardarUsuario(usuario: UsuarioModel) {
    localStorage.setItem('usuario', JSON.stringify(usuario))
  }

  leerUsuario():UsuarioModel {
    if (localStorage.getItem('usuario')) {
      return JSON.parse( String(localStorage.getItem('usuario')))
    }
    else {
      return  new UsuarioModel()
    }
  }

  guardarToken(idToken: string, valido_hasta: string){
    localStorage.setItem('token',idToken)
    localStorage.setItem('valido',valido_hasta)

  }

  leerToken(){
    if (localStorage.getItem('token')){
        return  String(localStorage.getItem('token'))
    }
    else {
      return  ''
    }
  }

  leerValido_hasta(){
    if (localStorage.getItem('valido')){
        return  String(localStorage.getItem('valido'))
    }
    else {
      return  '1980-01-01'
    }
  }

  estaAutenticado(): boolean {

    if (this.leerToken().length < 2 ){
      console.log("ho hay token");
      return false
    }
    let strnow: string = String(this.datepipe.transform(new Date(),'yyyy-MM-dd HH:mm:ss'))
    let valido: string = this.leerValido_hasta()

    if (strnow > valido){
      console.log("token caducado");

      this.logout()
      return false
    }
    return true
  }
}
