import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthSession } from '@supabase/supabase-js';
import { SupabaseService, Profile } from '../services/supabase';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  styleUrls: ['./account.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
})
export class AccountComponent implements OnInit {
  loading = false;
  profile!: Profile;
  updateProfileForm!: FormGroup;

  @Input() session!: AuthSession;

  constructor(
    private readonly supabase: SupabaseService,
    private formBuilder: FormBuilder
  ) {
    this.updateProfileForm = this.formBuilder.group({
      first_name: '',
      last_name: '',
      dni: '',
      birth_date: '',
      phone_number: '',
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getProfile();

    const { first_name, last_name, dni, birth_date, phone_number } = this.profile;
    this.updateProfileForm.patchValue({
      first_name,
      last_name,
      dni,
      birth_date,
      phone_number
    });
  }

  async getProfile(): Promise<void> {
    try {
      this.loading = true;
      const { user } = this.session;
      const { data: profile, error, status } = await this.supabase.profile(user);

          console.log('API response:', { data: profile, error, status });


      if (error && status !== 406) {
        throw error;
      }

      if (profile) {
        this.profile = profile;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true;
      const { user } = this.session;

      const { first_name, last_name, dni, birth_date, phone_number } = this.updateProfileForm.value;

      // Now, correctly destructure the result from the service method
      const { error } = await this.supabase.updateProfile({
        id: user.id,
        first_name,
        last_name,
        dni,
        birth_date,
        phone_number,
      });

      if (error) {
        throw error;
      }
      alert('¡Perfil actualizado!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }
  async signOut() {
    await this.supabase.signOut();
  }
}