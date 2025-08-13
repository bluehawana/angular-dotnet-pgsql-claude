import { Routes } from '@angular/router';
import { SimpleHomeComponent } from './pages/simple-home/simple-home.component';
import { PlanComponent } from './pages/plan/plan.component';

export const routes: Routes = [
  { path: '', component: SimpleHomeComponent },
  { path: 'plan', component: PlanComponent },
  { path: '**', redirectTo: '' }
];