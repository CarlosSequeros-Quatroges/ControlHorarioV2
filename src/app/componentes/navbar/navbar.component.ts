import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../usuario.model';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  auth: AuthService = inject(AuthService)
  router: Router = inject(Router)
  usuario: UsuarioModel = inject(UsuarioModel)

  constructor() { }

  ngOnInit(): void {
  }

  salir() {
    this.auth.logout()
    this.router.navigateByUrl("/login")
  }
}
