import {Component,HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { FooterComponent } from './componentes/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [

    RouterOutlet,
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'Microgestion App';
  auth: AuthService = inject(AuthService)
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    this.auth.logout()
  }
}
