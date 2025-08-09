import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface TravelPreferences {
  gender: string;
  ageRange: string;
  budgetCategory: string;
  preferredContinent: string;
  travelDuration: number;
  accommodationType: string;
  transportationPreference: string;
}

@Component({
  selector: 'app-travel-questionnaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="questionnaire-container">
      <h2>Plan Your Perfect Trip</h2>
      <p class="subtitle">Answer a few questions to get personalized travel recommendations</p>
      
      <form [formGroup]="questionnaireForm" (ngSubmit)="onSubmit()" class="questionnaire-form">
        
        <div class="form-group">
          <label for="gender">Gender (Optional)</label>
          <select id="gender" formControlName="gender" class="form-control">
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label for="ageRange">Age Range *</label>
          <select id="ageRange" formControlName="ageRange" class="form-control">
            <option value="">Select age range</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46-55">46-55</option>
            <option value="56-65">56-65</option>
            <option value="65+">65+</option>
          </select>
          <div *ngIf="questionnaireForm.get('ageRange')?.invalid && questionnaireForm.get('ageRange')?.touched" 
               class="error-message">
            Age range is required
          </div>
        </div>

        <div class="form-group">
          <label for="budgetCategory">Budget Category *</label>
          <select id="budgetCategory" formControlName="budgetCategory" class="form-control">
            <option value="">Select budget category</option>
            <option value="economy">Economy ($30-80/day)</option>
            <option value="mid-range">Mid-range ($80-200/day)</option>
            <option value="luxury">Luxury ($200-500/day)</option>
            <option value="ultra-luxury">Ultra Luxury ($500+/day)</option>
          </select>
          <div *ngIf="questionnaireForm.get('budgetCategory')?.invalid && questionnaireForm.get('budgetCategory')?.touched" 
               class="error-message">
            Budget category is required
          </div>
        </div>

        <div class="form-group">
          <label for="preferredContinent">Preferred Continent *</label>
          <select id="preferredContinent" formControlName="preferredContinent" class="form-control">
            <option value="">Select continent</option>
            <option value="asia">Asia</option>
            <option value="europe">Europe</option>
            <option value="north-america">North America</option>
            <option value="south-america">South America</option>
            <option value="africa">Africa</option>
            <option value="oceania">Australia/Oceania</option>
          </select>
          <div *ngIf="questionnaireForm.get('preferredContinent')?.invalid && questionnaireForm.get('preferredContinent')?.touched" 
               class="error-message">
            Preferred continent is required
          </div>
        </div>

        <div class="form-group">
          <label for="travelDuration">Travel Duration (Days) *</label>
          <input type="number" id="travelDuration" formControlName="travelDuration" 
                 class="form-control" min="1" max="365" placeholder="e.g., 7">
          <div *ngIf="questionnaireForm.get('travelDuration')?.invalid && questionnaireForm.get('travelDuration')?.touched" 
               class="error-message">
            <span *ngIf="questionnaireForm.get('travelDuration')?.errors?.['required']">
              Travel duration is required
            </span>
            <span *ngIf="questionnaireForm.get('travelDuration')?.errors?.['min']">
              Duration must be at least 1 day
            </span>
            <span *ngIf="questionnaireForm.get('travelDuration')?.errors?.['max']">
              Duration cannot exceed 365 days
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="accommodationType">Accommodation Preference</label>
          <select id="accommodationType" formControlName="accommodationType" class="form-control">
            <option value="">No preference</option>
            <option value="hotel">Hotel</option>
            <option value="airbnb">Airbnb/Rental</option>
            <option value="hostel">Hostel</option>
            <option value="resort">Resort</option>
            <option value="boutique">Boutique Hotel</option>
          </select>
        </div>

        <div class="form-group">
          <label for="transportationPreference">Transportation Preference</label>
          <select id="transportationPreference" formControlName="transportationPreference" class="form-control">
            <option value="">No preference</option>
            <option value="flight">Flight</option>
            <option value="train">Train</option>
            <option value="bus">Bus</option>
            <option value="car-rental">Car Rental</option>
            <option value="mixed">Mixed Transportation</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="questionnaireForm.invalid" class="btn btn-primary">
            Get Travel Recommendations
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .questionnaire-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .subtitle {
      text-align: center;
      color: #6c757d;
      margin-bottom: 2rem;
    }

    .questionnaire-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .form-control {
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-control.ng-invalid.ng-touched {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      margin-top: 1rem;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
      width: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .questionnaire-container {
        margin: 1rem;
        padding: 1.5rem;
      }
    }
  `]
})
export class TravelQuestionnaireComponent {
  @Output() preferencesSubmitted = new EventEmitter<TravelPreferences>();

  questionnaireForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.questionnaireForm = this.fb.group({
      gender: [''],
      ageRange: ['', Validators.required],
      budgetCategory: ['', Validators.required],
      preferredContinent: ['', Validators.required],
      travelDuration: ['', [Validators.required, Validators.min(1), Validators.max(365)]],
      accommodationType: [''],
      transportationPreference: ['']
    });
  }

  onSubmit(): void {
    if (this.questionnaireForm.valid) {
      const preferences: TravelPreferences = {
        gender: this.questionnaireForm.value.gender,
        ageRange: this.questionnaireForm.value.ageRange,
        budgetCategory: this.questionnaireForm.value.budgetCategory,
        preferredContinent: this.questionnaireForm.value.preferredContinent,
        travelDuration: this.questionnaireForm.value.travelDuration,
        accommodationType: this.questionnaireForm.value.accommodationType,
        transportationPreference: this.questionnaireForm.value.transportationPreference
      };
      
      this.preferencesSubmitted.emit(preferences);
    }
  }
}