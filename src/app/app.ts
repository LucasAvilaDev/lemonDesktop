import { Component, OnInit } from '@angular/core'
import { SupabaseService } from './services/supabase'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { AccountComponent } from './account/account'
import { AuthComponent } from './auth/auth'

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [CommonModule, RouterOutlet], 

  styleUrls: ['./app.css'],
  standalone: true,
})
export class App implements OnInit {
  constructor(private readonly supabase: SupabaseService) {}

  title = 'angular-user-management'
  session: any

  ngOnInit() {
    this.session = this.supabase.session
    this.supabase.authChanges((_, session) => (this.session = session))
  }
}