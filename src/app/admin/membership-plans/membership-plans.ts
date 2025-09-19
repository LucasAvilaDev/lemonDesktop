import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SupabaseService } from '../../services/supabase';

// Define la interfaz para los datos de un plan, lo que mejora la tipificación
interface MembershipPlan {
  plan_id?: number;
  name: string;
  price: number;
  duration_months: number;
  classes_included: number;
}

@Component({
  selector: 'app-membership-plans',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './membership-plans.html',
  styleUrl: './membership-plans.css'
})
export class MembershipPlansComponent implements OnInit {
  plans: MembershipPlan[] = [];
  planForm: FormGroup;
  editingPlanId: number | null = null;
  loading = false; // Estado de carga para la UI
  
  constructor(private fb: FormBuilder, private supabase: SupabaseService) {
    // Inicializa el formulario con validadores para asegurar que los datos son correctos
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration_months: ['', [Validators.required, Validators.min(1)]],
      classes_included: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    // Carga los planes cuando el componente se inicia
    this.loadPlans();
  }

  async loadPlans(): Promise<void> {
    this.loading = true;
    const { data, error } = await this.supabase.getMembershipPlans();
    this.loading = false;
    
    if (error) {
      console.error('Error fetching plans:', error);
      alert('Hubo un error al cargar los planes. Por favor, inténtelo de nuevo.');
    } else {
      this.plans = data as MembershipPlan[];
    }
  }

  async onSubmit(): Promise<void> {
    if (this.planForm.invalid) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const newPlan: MembershipPlan = this.planForm.value;
    
    this.loading = true;
    if (this.editingPlanId) {
      const { error } = await this.supabase.updateMembershipPlan(this.editingPlanId, newPlan);
      
      if (error) {
        console.error('Error updating plan:', error);
        alert('Hubo un error al actualizar el plan.');
      } else {
        console.log('Plan updated successfully');
      }
    } else {
      const { error } = await this.supabase.createMembershipPlan(newPlan);
      
      if (error) {
        console.error('Error creating plan:', error);
        alert('Hubo un error al crear el plan.');
      } else {
        console.log('Plan created successfully');
      }
    }
    
    this.loading = false;
    this.planForm.reset();
    this.editingPlanId = null;
    this.loadPlans();
  }

  editPlan(plan: MembershipPlan): void {
    this.editingPlanId = plan.plan_id!;
    this.planForm.patchValue(plan);
  }

  async deletePlan(planId: number): Promise<void> {
    if (!confirm('¿Está seguro de que desea eliminar este plan?')) {
      return;
    }
    
    this.loading = true;
    const { error } = await this.supabase.deleteMembershipPlan(planId);
    this.loading = false;

    if (error) {
      console.error('Error deleting plan:', error);
      alert('Hubo un error al eliminar el plan.');
    } else {
      console.log('Plan deleted successfully');
      this.loadPlans();
    }
  }

  cancelEdit(): void {
    this.editingPlanId = null;
    this.planForm.reset();
  }
}