import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  session = this.supabase.session;

  constructor(private readonly supabase: SupabaseService, private router: Router) {}

  ngOnInit(): void {
    // Escucha cambios en el estado de autenticación
    this.supabase.authChanges((_, session) => {
      this.session = session;
      if (!session) {
        // Si no hay sesión, redirige al login
        this.router.navigate(['/login']);
      }
    });
  }

  async signOut(): Promise<void> {
    await this.supabase.signOut();
  }
}