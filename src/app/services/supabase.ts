import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environments';

// Interfaz actualizada para que coincida con tu tabla `profiles`
export interface Profile {
  id?: string;
  first_name: string;
  last_name: string;
  dni?: number;
  birth_date?: string;
  phone_number?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  // Método adaptado para seleccionar los campos correctos
  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`first_name, last_name, dni, birth_date, phone_number`)
      .eq('id', user.id)
      .single();
  }

  // Puedes añadir un método para actualizar el perfil
  async updateProfile(profile: Profile) {
    const { id, ...update } = profile;
      const { data, error } = await this.supabase
    .from('profiles')
    .update(update)
    .eq('id', id as string);

  return { data, error };
    
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signInWithPassword(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }


  signOut() {
    return this.supabase.auth.signOut();
  }
}