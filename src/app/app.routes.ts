import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AuthComponent } from './auth/auth';


export const routes: Routes = [
  // Ruta principal, redirige a /home
  { path: '', redirectTo: 'auth', pathMatch: 'full' }, 
  
  // Ruta para el componente de login
  { path: 'auth', component: AuthComponent },
  
  // Ruta para la página principal/dashboard
  { path: 'home', component: HomeComponent }
];