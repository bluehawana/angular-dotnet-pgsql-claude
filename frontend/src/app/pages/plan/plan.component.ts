import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelQuestionnaireComponent, TravelPreferences } from '../../components/travel-questionnaire/travel-questionnaire.component';
import { TravelPlanDisplayComponent } from '../../components/travel-plan-display/travel-plan-display.component';
import { TravelPlanGeneratorService, TravelPlan } from '../../services/travel-plan-generator.service';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, TravelQuestionnaireComponent, TravelPlanDisplayComponent],
  template: `
    <div class="plan-container">
      <h1>AI Travel Planner</h1>
      
      <div *ngIf="currentStep === 'questionnaire'">
        <app-travel-questionnaire (preferencesSubmitted)="onPreferencesSubmitted($event)"></app-travel-questionnaire>
      </div>
      
      <div *ngIf="currentStep === 'generating'" class="generating-section">
        <h2>Generating Your Personalized Trip Plan</h2>
        <div class="loading">
          <p>Creating budget-optimized travel plan for {{ userPreferences?.selectedDestination }}...</p>
          <p>{{ userPreferences?.gender === 'woman' ? 'Female' : 'Male' }}, {{ userPreferences?.ageRange }}, {{ userPreferences?.budgetCategory }} budget, {{ userPreferences?.travelDuration }} days</p>
        </div>
      </div>
      
      <div *ngIf="currentStep === 'plan'">
        <app-travel-plan-display [travelPlan]="generatedPlan" *ngIf="generatedPlan"></app-travel-plan-display>
      </div>
    </div>
  `,
  styles: [`
    .plan-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 2rem;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
    }

    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .destination-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .destination-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .destination-card.selected {
      border: 3px solid #007bff;
      transform: translateY(-4px);
    }

    .destination-card h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .country {
      color: #007bff;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .description {
      color: #6c757d;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .popularity {
      font-weight: 600;
      color: #28a745;
    }

    .plan-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .overview-item {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .overview-item h4 {
      color: #6c757d;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    .budget {
      font-size: 1.5rem;
      font-weight: 700;
      color: #28a745;
      margin: 0;
    }

    .day-plan {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
      overflow: hidden;
    }

    .day-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .day-header h5 {
      margin: 0;
    }

    .day-cost {
      font-weight: 600;
    }

    .activities {
      padding: 1.5rem;
    }

    .activity {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .activity:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .time {
      font-weight: 600;
      color: #007bff;
      min-width: 60px;
    }

    .activity-info {
      flex: 1;
    }

    .activity-info h6 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .activity-info p {
      margin: 0 0 0.5rem 0;
      color: #6c757d;
      line-height: 1.4;
    }

    .cost {
      font-weight: 600;
      color: #28a745;
    }

    .actions {
      text-align: center;
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    @media (max-width: 768px) {
      .plan-container {
        padding: 1rem;
      }

      .destinations-grid {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class PlanComponent {
  currentStep: 'questionnaire' | 'generating' | 'plan' = 'questionnaire';
  userPreferences: TravelPreferences | null = null;
  generatedPlan: TravelPlan | null = null;

  constructor(private travelPlanService: TravelPlanGeneratorService) {}

  onPreferencesSubmitted(preferences: TravelPreferences): void {
    this.userPreferences = preferences;
    this.currentStep = 'generating';
    this.generateTravelPlan();
  }

  private generateTravelPlan(): void {
    if (!this.userPreferences) return;

    // Try to use the enhanced API first, fallback to local generation
    this.travelPlanService.generateEnhancedTravelPlan(this.userPreferences)
      .subscribe({
        next: (plan) => {
          this.generatedPlan = plan;
          this.currentStep = 'plan';
        },
        error: (error) => {
          console.error('API call failed, using fallback:', error);
          // Fallback to local generation
          this.generatedPlan = this.travelPlanService.generateTravelPlan(this.userPreferences!);
          this.currentStep = 'plan';
        }
      });
  }
}