import {LOCALE_ID } from '@angular/core';


import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, provideProtractorTestingSupport, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withJsonpSupport } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { routes } from './app.routes';
import { Cosmos2datetimePipe } from './pipes/cosmos2datetime.pipe';
import { Cosmos2datePipe } from './pipes/cosmos2date.pipe';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SumPipe } from './pipes/sum.pipe';
import { DuracionPipe } from './pipes/duracion.pipe';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'
import { DifPipe } from './pipes/dif.pipe';
import { FiltrarPipe } from './pipes/filtrar.pipe';
import { Min2hourMinPipe } from './pipes/min2hour-min.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { Cosmos2minPipe } from './pipes/cosmos2min.pipe';
registerLocaleData(localeEs)

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: LOCALE_ID,useValue: 'es'},
    provideProtractorTestingSupport(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
    provideHttpClient( withFetch(), withJsonpSupport() ),
    provideRouter(routes),
    provideNativeDateAdapter(),
    DatePipe,
    Cosmos2datetimePipe,
    Cosmos2datePipe,
    SumPipe,
    DuracionPipe,
    DifPipe,
    FiltrarPipe,
    Min2hourMinPipe,
    SortPipe,
    Cosmos2minPipe

  ],

};

