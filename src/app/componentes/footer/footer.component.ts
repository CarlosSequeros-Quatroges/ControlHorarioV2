import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  public appVersion: string;
  public buildDate: string = environment.buildDate;
  public datepipe: DatePipe = inject(DatePipe);
  constructor() {
    this.appVersion = this.buildDate;
    if (!this.buildDate || this.buildDate === '') {
      this.appVersion =
        this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') || '';
    }
  }
}
