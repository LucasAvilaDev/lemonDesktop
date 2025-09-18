import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { HomeComponent } from './home/home';


export const routes: Routes = [
  // Ruta principal, redirige a /home
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  
  // Ruta para el componente de login
  { path: 'login', component: LoginComponent },
  
  // Ruta para la página principal/dashboard
  { path: 'home', component: HomeComponent }
];