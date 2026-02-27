import { Routes } from '@angular/router';

import { LoginComponent } from './componentes/login/login.component';
import { PageNotFoundComponent } from './componentes/page-not-found/page-not-found.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroJornadaComponent } from './componentes/registro-jornada/registro-jornada.component';
import { IncidenciasComponent } from './componentes/incidencias/incidencias.component';
import { ChangePasswdComponent } from './componentes/change-passwd/change-passwd.component';
import { VacacionesComponent } from './componentes/vacaciones/vacaciones.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Registro de jornada',
    canActivate: [authGuard],
  },
  {
    path: 'registro-jornada',
    component: RegistroJornadaComponent,
    title: 'Registro de jornada',
    canActivate: [authGuard],
  },
  {
    path: 'incidencias',
    component: IncidenciasComponent,
    title: 'Registro de incidencias',
    canActivate: [authGuard],
  },
  {
    path: 'vacaciones',
    component: VacacionesComponent,
    title: 'Registro de vacaciones',
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'new-passwd',
    component: ChangePasswdComponent,
    title: 'Cambio de clave',
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/registro-jornada', pathMatch: 'full' }, // redirect to home

  { path: '**', component: PageNotFoundComponent },
];
