import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AccountComponent } from '../account/account'; // Importa el componente de cuenta
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, AccountComponent], // Importa los módulos y componentes necesarios
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  session: any;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit(): void {
    // Al cargar el componente, obtén la sesión actual una sola vez.
    this.session = this.supabase.session;
  }

  async signOut(): Promise<void> {
    await this.supabase.signOut();
  }
}