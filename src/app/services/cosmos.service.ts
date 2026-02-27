import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, timeout, TimeoutError } from 'rxjs';

import { catchError, map } from 'rxjs/operators';

import { UsuarioModel } from '../usuario.model';
import { RespBase } from '../interfaces/resp-base';
import { RespRegistros } from '../interfaces/resp-registros';
import { Registro } from '../interfaces/registro';
import { AuthService } from './auth.service';
import { RespIncidencias } from '../interfaces/resp-incidencias';
import { RespActualizaRegistros } from '../interfaces/resp-actualiza-registros';
import { RespVacaciones } from '../interfaces/resp-vacaciones';

@Injectable({
  providedIn: 'root',
})
export class CosmosService {
  //private url: string = "http://192.168.1.51:8090/qges/rest/personal"
  private url: string = '/qges/rest/personal';

  constructor(
    private http: HttpClient,
    private usuario: UsuarioModel,
    private auth: AuthService,
  ) {}

  recuperaRegistrosDia(): Observable<RespRegistros> {
    var usuario: UsuarioModel = this.auth.leerUsuario();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*')
      .append(
        'Access-Control-Allow-Headers',
        'origin, content-type, accept,authorization,securityToken,access-control-allow-origin',
      );

    return this.http
      .get<RespRegistros>(
        `${this.url}/recupera-registros-dia?email=${usuario.email}&empresa=${usuario.codigo}&matricula=${usuario.matricula}`,
        { headers },
      )
      .pipe(
        map((resp) => {
          console.log('Respuesta  ' + resp.errdesc);
          return resp;
        }),
        catchError((err) => {
          console.log('get error catch ' + err);
          return throwError(err.status + ' ' + err.statusText);
        }),
      );
  }

  recuperaRegistrosMes(mes: string): Observable<RespRegistros> {
    var usuario: UsuarioModel = this.auth.leerUsuario();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*')
      .append(
        'Access-Control-Allow-Headers',
        'origin, content-type, accept,authorization,securityToken,access-control-allow-origin',
      );
    return this.http
      .get<RespRegistros>(
        `${this.url}/recupera-registros-mes2?email=${usuario.email}&empresa=${usuario.codigo}&matricula=${usuario.matricula}&mes=${mes}`,
        { headers },
      )
      .pipe(
        map((resp) => {
          return resp;
        }),
        catchError((err) => {
          return throwError(err.status + ' ' + err.statusText);
        }),
      );
  }

  recuperaIncidenciasMes(mes: string): Observable<RespIncidencias> {
    var usuario: UsuarioModel = this.auth.leerUsuario();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*')
      .append(
        'Access-Control-Allow-Headers',
        'origin, content-type, accept,authorization,securityToken,access-control-allow-origin',
      );

    return this.http
      .get<RespIncidencias>(
        `${this.url}/recupera-incidencias-mes?email=${usuario.email}&empresa=${usuario.codigo}&matricula=${usuario.matricula}&mes=${mes}`,
        { headers },
      )
      .pipe(
        map((resp) => {
          return resp;
        }),
        catchError((err) => {
          return throwError(err.status + ' ' + err.statusText);
        }),
      );
  }

  recuperaVacaciones(ejercicio: string): Observable<RespVacaciones> {
    var usuario: UsuarioModel = this.auth.leerUsuario();

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*')
      .append(
        'Access-Control-Allow-Headers',
        'origin, content-type, accept,authorization,securityToken,access-control-allow-origin',
      );

    return this.http
      .get<RespVacaciones>(
        `${this.url}/recupera-vacaciones?email=${usuario.email}&empresa=${usuario.codigo}&matricula=${usuario.matricula}&ejercicio=${ejercicio}`,
        { headers },
      )
      .pipe(
        map((resp) => {
          return resp;
        }),
        catchError((err) => {
          return throwError(err.status + ' ' + err.statusText);
        }),
      );
  }

  // actualiza un registro único
  actualizaRegistro(
    usuario: UsuarioModel,
    registro: Registro,
  ): Observable<String> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Methods', 'POST')
      .append('Access-Control-Allow-Origin', '*')
      .append(
        'Access-Control-Allow-Headers',
        'origin, content-type, accept,authorization,securityToken,access-control-allow-origin',
      );

    const data = { email: usuario.email, registro: registro };

    return this.http
      .post<RespBase>(`${this.url}/actualiza-registro`, data, { headers })
      .pipe(
        map((resp) => {
          if (resp.errnum == 0) {
            return '';
          }
          return resp.errdesc + '(' + resp.errnum + ')';
        }),
        catchError((err) => {
          return throwError(err.status + ' ' + err.statusText);
        }),
      );
  }

  // actualiza un array de registros
  actualizaRegistros(
    usuario: UsuarioModel,
    registros: Registro[],
  ): Observable<RespActualizaRegistros> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Methods', 'POST')
      .append('Access-Control-Allow-Origin', '*')
      .append(
        'Access-Control-Allow-Headers',
        'origin, content-type, accept,authorization,securityToken,access-control-allow-origin',
      );

    const data = { email: usuario.email, registros: registros };

    return this.http
      .post<RespActualizaRegistros>(`${this.url}/actualiza-registros`, data, {
        headers,
      })
      .pipe(
        map((resp) => {
          console.log('Respuesta  ' + resp.errdesc);
          return resp;
        }),
        timeout({
          each: 6000,
          with: () => throwError(() => new Error('Timeout Error!!!')),
        }),
        catchError((err) => {
          console.log('post error catch ' + err);
          return throwError(err.status + ' ' + err.statusText);
        }),
      );
  }
}
