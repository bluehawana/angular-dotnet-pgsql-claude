import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface TravelPreferences {
  gender: string;
  ageRange: string;
  budgetCategory: string;
  preferredContinent: string;
  travelDuration: number;
  selectedDestination: string;
  selectedCities: string[];
  accommodationType?: string;
}

export interface TravelPlanResult {
  summary: {
    totalCost: number;
    placesToVisit: number;
    recommendations: string[];
  };
  todoList: string[];
  budgetBreakdown: {
    accommodation: number;
    transportation: number;
    food: number;
    activities: number;
    misc: number;
  };
}

@Component({
  selector: 'app-travel-questionnaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="questionnaire-container">
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="(currentStep / totalSteps) * 100"></div>
      </div>
      
      <div class="step-indicator">
        Step {{currentStep}} of {{totalSteps}}
      </div>

      <h2>{{getStepTitle()}}</h2>
      <p class="subtitle">{{getStepSubtitle()}}</p>

      <div class="step-container" [ngSwitch]="currentStep">
        
        <!-- Step 1: Gender -->
        <div *ngSwitchCase="1" class="step-content">
          <div class="form-group">
            <label>Please select your gender</label>
            <div class="option-buttons">
              <button type="button" 
                      class="option-btn" 
                      [class.selected]="preferences.gender === 'man'"
                      (click)="selectGender('man')">
                Man
              </button>
              <button type="button" 
                      class="option-btn" 
                      [class.selected]="preferences.gender === 'woman'"
                      (click)="selectGender('woman')">
                Woman
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Age Range -->
        <div *ngSwitchCase="2" class="step-content">
          <div class="form-group">
            <label>What's your age range?</label>
            <div class="option-buttons">
              <button type="button" 
                      class="option-btn" 
                      [class.selected]="preferences.ageRange === range"
                      *ngFor="let range of ageRanges"
                      (click)="selectAgeRange(range)">
                {{range}}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Continent -->
        <div *ngSwitchCase="3" class="step-content">
          <div class="form-group">
            <label>Which continent would you like to visit?</label>
            <div class="option-buttons">
              <button type="button" 
                      class="option-btn" 
                      [class.selected]="preferences.preferredContinent === continent.value"
                      *ngFor="let continent of continents"
                      (click)="selectContinent(continent.value)">
                {{continent.name}}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 4: Budget -->
        <div *ngSwitchCase="4" class="step-content">
          <div class="form-group">
            <label>What's your budget category?</label>
            <div class="option-buttons">
              <button type="button" 
                      class="option-btn" 
                      [class.selected]="preferences.budgetCategory === budget.value"
                      *ngFor="let budget of budgetCategories"
                      (click)="selectBudget(budget.value)">
                <div class="budget-option">
                  <span class="budget-title">{{budget.name}}</span>
                  <span class="budget-desc">{{budget.description}}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Step 5: Duration -->
        <div *ngSwitchCase="5" class="step-content">
          <div class="form-group">
            <label for="duration">How many days will your trip be?</label>
            <input type="number" 
                   id="duration"
                   class="form-control duration-input" 
                   min="1" 
                   max="365" 
                   placeholder="Enter number of days"
                   [(ngModel)]="preferences.travelDuration">
          </div>
        </div>

        <!-- Step 6: Specific Destination -->
        <div *ngSwitchCase="6" class="step-content">
          <div class="form-group">
            <label>Choose from top 5 popular destinations in {{getContinentName()}}</label>
            <div class="option-buttons">
              <button type="button" 
                      class="option-btn destination-btn" 
                      [class.selected]="preferences.selectedDestination === destination.value"
                      *ngFor="let destination of getDestinationsForContinent()"
                      (click)="selectDestination(destination.value)">
                {{destination.name}}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 7: Multi-City Selection for 7+ days -->
        <div *ngSwitchCase="7" class="step-content" *ngIf="preferences.travelDuration >= 7">
          <div class="form-group">
            <label>Select top 3 cities in {{getSelectedCountryName()}} (Choose exactly 3)</label>
            <p class="subtitle">With {{preferences.travelDuration}} days, you can explore multiple cities!</p>
            <div class="option-buttons">
              <button type="button" 
                      class="option-btn city-btn" 
                      [class.selected]="isCitySelected(city.value)"
                      [class.disabled]="!isCitySelected(city.value) && preferences.selectedCities.length >= 3"
                      *ngFor="let city of getCitiesForDestination()"
                      (click)="toggleCitySelection(city.value)">
                <div class="city-option">
                  <span class="city-name">{{city.name}}</span>
                  <span class="city-desc">{{city.description}}</span>
                </div>
              </button>
            </div>
            <div class="selection-counter">
              Selected: {{preferences.selectedCities.length}}/3 cities
            </div>
          </div>
        </div>

      </div>

      <div class="navigation-buttons">
        <button type="button" 
                class="btn btn-secondary" 
                *ngIf="currentStep > 1"
                (click)="previousStep()">
          Previous
        </button>
        
        <button type="button" 
                class="btn btn-primary" 
                *ngIf="currentStep < totalSteps && canProceedToNext()"
                (click)="nextStep()">
          Next
        </button>
        
        <button type="button" 
                class="btn btn-success" 
                *ngIf="currentStep === totalSteps && canProceedToNext()"
                (click)="generateTravelPlan()">
          Generate My Travel Plan
        </button>
      </div>
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

    .progress-bar {
      width: 100%;
      height: 8px;
      background-color: #e9ecef;
      border-radius: 4px;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #007bff, #0056b3);
      transition: width 0.3s ease;
    }

    .step-indicator {
      text-align: center;
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 1rem;
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

    .step-content {
      min-height: 200px;
      display: flex;
      align-items: center;
    }

    .form-group {
      width: 100%;
    }

    label {
      margin-bottom: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      font-size: 1.1rem;
      text-align: center;
      display: block;
    }

    .option-buttons {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .option-btn {
      padding: 1rem 1.5rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      background: white;
      color: #2c3e50;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }

    .option-btn:hover {
      border-color: #007bff;
      background-color: #f8f9fa;
    }

    .option-btn.selected {
      border-color: #007bff;
      background-color: #007bff;
      color: white;
    }

    .budget-option {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .budget-title {
      font-weight: 600;
    }

    .budget-desc {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .destination-btn {
      min-height: 60px;
    }

    .city-btn {
      min-height: 80px;
    }

    .city-option {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .city-name {
      font-weight: 600;
    }

    .city-desc {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .option-btn.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .option-btn.disabled:hover {
      border-color: #e9ecef;
      background-color: white;
    }

    .selection-counter {
      text-align: center;
      margin-top: 1.5rem;
      font-weight: 600;
      color: #007bff;
    }

    .duration-input {
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1.1rem;
      text-align: center;
      max-width: 200px;
      margin: 0 auto;
      display: block;
    }

    .duration-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      gap: 1rem;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
      min-width: 120px;
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

    .btn-success {
      background-color: #28a745;
      color: white;
    }

    .btn-success:hover {
      background-color: #218838;
    }

    .btn:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }
  `]
})
export class TravelQuestionnaireComponent {
  @Output() preferencesSubmitted = new EventEmitter<TravelPreferences>();

  currentStep = 1;
  totalSteps = 7;

  preferences: TravelPreferences = {
    gender: '',
    ageRange: '',
    budgetCategory: '',
    preferredContinent: '',
    travelDuration: 0,
    selectedDestination: '',
    selectedCities: []
  };

  ageRanges = ['20-29', '30-39', '40-49', '50-59', '60+'];

  continents = [
    { name: 'Asia', value: 'asia' },
    { name: 'Africa', value: 'africa' },
    { name: 'North America', value: 'north-america' },
    { name: 'South America', value: 'south-america' },
    { name: 'Europe', value: 'europe' }
  ];

  budgetCategories = [
    { 
      name: 'Student', 
      value: 'student',
      description: 'Budget-friendly options, hostels, local transport'
    },
    { 
      name: 'Economic', 
      value: 'economic',
      description: 'Good value accommodations, public transport'
    },
    { 
      name: 'Comfortable', 
      value: 'comfortable',
      description: 'Mid-range hotels, mix of transport options'
    },
    { 
      name: 'Business', 
      value: 'business',
      description: 'Quality hotels, convenient transport'
    },
    { 
      name: 'Luxury', 
      value: 'luxury',
      description: 'Premium accommodations, private transport'
    }
  ];

  private destinationsByContinent: {[key: string]: {name: string, value: string}[]} = {
    'asia': [
      {name: 'Japan', value: 'japan'},
      {name: 'China Mainland', value: 'china'},
      {name: 'Hong Kong', value: 'hong-kong'},
      {name: 'India', value: 'india'},
      {name: 'Taiwan', value: 'taiwan'}
    ],
    'europe': [
      {name: 'France', value: 'france'},
      {name: 'Italy', value: 'italy'},
      {name: 'Spain', value: 'spain'},
      {name: 'Germany', value: 'germany'},
      {name: 'United Kingdom', value: 'uk'}
    ],
    'north-america': [
      {name: 'United States', value: 'usa'},
      {name: 'Canada', value: 'canada'},
      {name: 'Mexico', value: 'mexico'},
      {name: 'Costa Rica', value: 'costa-rica'},
      {name: 'Guatemala', value: 'guatemala'}
    ],
    'south-america': [
      {name: 'Brazil', value: 'brazil'},
      {name: 'Argentina', value: 'argentina'},
      {name: 'Peru', value: 'peru'},
      {name: 'Chile', value: 'chile'},
      {name: 'Colombia', value: 'colombia'}
    ],
    'africa': [
      {name: 'South Africa', value: 'south-africa'},
      {name: 'Morocco', value: 'morocco'},
      {name: 'Egypt', value: 'egypt'},
      {name: 'Kenya', value: 'kenya'},
      {name: 'Tanzania', value: 'tanzania'}
    ]
  };

  getStepTitle(): string {
    const titles = [
      '', 
      'Tell us about yourself',
      'What\'s your age range?',
      'Where do you want to go?',
      'What\'s your budget?',
      'How long is your trip?',
      'Pick your destination',
      'Choose your cities'
    ];
    return titles[this.currentStep];
  }

  getStepSubtitle(): string {
    const subtitles = [
      '',
      'This helps us personalize your recommendations',
      'We\'ll tailor activities to your age group',
      'Choose the continent you\'d like to explore',
      'We\'ll find the best options for your budget',
      'Tell us your trip duration in days',
      'Select from the most popular destinations',
      'Perfect for longer trips - explore multiple destinations!'
    ];
    return subtitles[this.currentStep];
  }

  selectGender(gender: string): void {
    this.preferences.gender = gender;
  }

  selectAgeRange(range: string): void {
    this.preferences.ageRange = range;
  }

  selectContinent(continent: string): void {
    this.preferences.preferredContinent = continent;
    this.preferences.selectedDestination = '';
  }

  selectBudget(budget: string): void {
    this.preferences.budgetCategory = budget;
  }

  selectDestination(destination: string): void {
    this.preferences.selectedDestination = destination;
    this.preferences.selectedCities = [];
  }

  getContinentName(): string {
    const continent = this.continents.find(c => c.value === this.preferences.preferredContinent);
    return continent?.name || '';
  }

  getDestinationsForContinent(): {name: string, value: string}[] {
    return this.destinationsByContinent[this.preferences.preferredContinent] || [];
  }

  canProceedToNext(): boolean {
    switch (this.currentStep) {
      case 1: return this.preferences.gender !== '';
      case 2: return this.preferences.ageRange !== '';
      case 3: return this.preferences.preferredContinent !== '';
      case 4: return this.preferences.budgetCategory !== '';
      case 5: return this.preferences.travelDuration > 0;
      case 6: return this.preferences.selectedDestination !== '';
      case 7: return this.preferences.travelDuration < 7 || this.preferences.selectedCities.length === 3;
      default: return false;
    }
  }

  nextStep(): void {
    if (this.canProceedToNext() && this.currentStep < this.totalSteps) {
      // Skip multi-city step if trip is less than 7 days
      if (this.currentStep === 6 && this.preferences.travelDuration < 7) {
        this.generateTravelPlan();
        return;
      }
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  generateTravelPlan(): void {
    if (this.canProceedToNext()) {
      this.preferencesSubmitted.emit(this.preferences);
    }
  }

  getSelectedCountryName(): string {
    const destinations = this.getDestinationsForContinent();
    const destination = destinations.find(d => d.value === this.preferences.selectedDestination);
    return destination?.name || '';
  }

  getCitiesForDestination(): {name: string, value: string, description: string}[] {
    const citiesByDestination: {[key: string]: {name: string, value: string, description: string}[]} = {
      'japan': [
        {name: 'Tokyo', value: 'tokyo', description: 'Capital city, modern culture & technology'},
        {name: 'Kyoto', value: 'kyoto', description: 'Ancient temples & traditional culture'},
        {name: 'Osaka', value: 'osaka', description: 'Food capital & vibrant nightlife'},
        {name: 'Hiroshima', value: 'hiroshima', description: 'Historical significance & peace memorial'},
        {name: 'Hakone', value: 'hakone', description: 'Hot springs & Mount Fuji views'}
      ],
      'china': [
        {name: 'Beijing', value: 'beijing', description: 'Capital, Forbidden City & Great Wall'},
        {name: 'Shanghai', value: 'shanghai', description: 'Modern skyline & international hub'},
        {name: 'Xi\'an', value: 'xian', description: 'Terracotta Warriors & ancient history'},
        {name: 'Guilin', value: 'guilin', description: 'Stunning karst landscapes & Li River'},
        {name: 'Chengdu', value: 'chengdu', description: 'Pandas & authentic Sichuan cuisine'}
      ],
      'france': [
        {name: 'Paris', value: 'paris', description: 'City of Light, Eiffel Tower & Louvre'},
        {name: 'Lyon', value: 'lyon', description: 'Culinary capital & historic old town'},
        {name: 'Nice', value: 'nice', description: 'French Riviera & Mediterranean coast'},
        {name: 'Bordeaux', value: 'bordeaux', description: 'World-class wine region'},
        {name: 'Strasbourg', value: 'strasbourg', description: 'European Parliament & German influence'}
      ],
      'italy': [
        {name: 'Rome', value: 'rome', description: 'Eternal City, Colosseum & Vatican'},
        {name: 'Florence', value: 'florence', description: 'Renaissance art & Tuscan culture'},
        {name: 'Venice', value: 'venice', description: 'Canals, gondolas & unique architecture'},
        {name: 'Milan', value: 'milan', description: 'Fashion capital & modern business hub'},
        {name: 'Naples', value: 'naples', description: 'Authentic pizza & gateway to Pompeii'}
      ]
    };
    return citiesByDestination[this.preferences.selectedDestination] || [];
  }

  isCitySelected(cityValue: string): boolean {
    return this.preferences.selectedCities.includes(cityValue);
  }

  toggleCitySelection(cityValue: string): void {
    const index = this.preferences.selectedCities.indexOf(cityValue);
    if (index > -1) {
      this.preferences.selectedCities.splice(index, 1);
    } else if (this.preferences.selectedCities.length < 3) {
      this.preferences.selectedCities.push(cityValue);
    }
  }
}