import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AdvancedTravelPreferences {
  gender: 'male' | 'female';
  ageRange: '20-29' | '30-39' | '40-49' | '50-59' | '60+';
  continent: 'Asia' | 'Africa' | 'North America' | 'South America' | 'Europe' | 'Oceania';
  budget: 'student' | 'economic' | 'comfortable' | 'business' | 'luxury';
  duration: number; // in days
  selectedDestination: string;
}

@Component({
  selector: 'app-advanced-questionnaire',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="questionnaire-container">
      <h2>AI Travel Planner - Smart Questionnaire</h2>
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="(currentStep / totalSteps) * 100"></div>
      </div>
      <p class="step-indicator">Step {{ currentStep }} of {{ totalSteps }}</p>

      <!-- Step 1: Gender -->
      <div *ngIf="currentStep === 1" class="step-content">
        <h3>What's your gender?</h3>
        <p class="step-description">This helps us provide more personalized recommendations</p>
        <div class="options-grid">
          <button 
            *ngFor="let option of genderOptions" 
            class="option-card"
            [class.selected]="preferences.gender === option.value"
            (click)="selectGender(option.value)">
            <div class="option-icon">{{ option.icon }}</div>
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>

      <!-- Step 2: Age Range -->
      <div *ngIf="currentStep === 2" class="step-content">
        <h3>What's your age range?</h3>
        <p class="step-description">Different age groups have different travel preferences</p>
        <div class="options-grid">
          <button 
            *ngFor="let option of ageOptions" 
            class="option-card"
            [class.selected]="preferences.ageRange === option.value"
            (click)="selectAge(option.value)">
            <div class="option-icon">{{ option.icon }}</div>
            <div>
              <div>{{ option.label }}</div>
              <small>{{ option.description }}</small>
            </div>
          </button>
        </div>
      </div>

      <!-- Step 3: Destination Continent -->
      <div *ngIf="currentStep === 3" class="step-content">
        <h3>Which continent would you like to explore?</h3>
        <p class="step-description">Choose your preferred travel destination</p>
        <div class="options-grid">
          <button 
            *ngFor="let option of continentOptions" 
            class="option-card continent-card"
            [class.selected]="preferences.continent === option.value"
            (click)="selectContinent(option.value)">
            <div class="option-icon">{{ option.icon }}</div>
            <div>
              <div>{{ option.label }}</div>
              <small>{{ option.description }}</small>
            </div>
          </button>
        </div>
      </div>

      <!-- Step 4: Budget Level -->
      <div *ngIf="currentStep === 4" class="step-content">
        <h3>What's your budget level?</h3>
        <p class="step-description">We'll optimize your trip based on your budget</p>
        <div class="options-grid">
          <button 
            *ngFor="let option of budgetOptions" 
            class="option-card budget-card"
            [class.selected]="preferences.budget === option.value"
            (click)="selectBudget(option.value)">
            <div class="option-icon">{{ option.icon }}</div>
            <div>
              <div>{{ option.label }}</div>
              <small>{{ option.description }}</small>
              <div class="budget-range">{{ option.range }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Step 5: Trip Duration -->
      <div *ngIf="currentStep === 5" class="step-content">
        <h3>How long will your trip be?</h3>
        <p class="step-description">Duration affects our recommendations and budget planning</p>
        <div class="duration-selector">
          <div class="duration-input">
            <button class="duration-btn" (click)="adjustDuration(-1)" [disabled]="preferences.duration <= 1">-</button>
            <div class="duration-display">
              <span class="duration-number">{{ preferences.duration }}</span>
              <span class="duration-label">{{ preferences.duration === 1 ? 'day' : 'days' }}</span>
            </div>
            <button class="duration-btn" (click)="adjustDuration(1)" [disabled]="preferences.duration >= 365">+</button>
          </div>
          <div class="duration-presets">
            <button 
              *ngFor="let preset of durationPresets"
              class="preset-btn"
              [class.selected]="preferences.duration === preset.days"
              (click)="setDuration(preset.days)">
              {{ preset.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 6: Top 5 Destinations -->
      <div *ngIf="currentStep === 6" class="step-content">
        <h3>Choose your destination in {{ preferences.continent }}</h3>
        <p class="step-description">Top 5 most popular destinations in {{ preferences.continent }}</p>
        <div class="destinations-grid">
          <button 
            *ngFor="let destination of getTopDestinations()" 
            class="destination-card"
            [class.selected]="preferences.selectedDestination === destination.name"
            (click)="selectDestination(destination.name)">
            <div class="destination-image" [style.background-image]="'url(' + destination.image + ')'"></div>
            <div class="destination-info">
              <h4>{{ destination.name }}</h4>
              <p>{{ destination.country }}</p>
              <div class="destination-highlights">
                <span *ngFor="let highlight of destination.highlights" class="highlight-tag">{{ highlight }}</span>
              </div>
              <div class="popularity-score">Popularity: {{ destination.popularity }}/100</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="navigation">
        <button class="nav-btn secondary" (click)="previousStep()" [disabled]="currentStep === 1">
          ← Previous
        </button>
        <button 
          class="nav-btn primary" 
          (click)="nextStep()" 
          [disabled]="!canProceed()"
          *ngIf="currentStep < totalSteps">
          Next →
        </button>
        <button 
          class="nav-btn primary" 
          (click)="generateTripPlan()" 
          [disabled]="!canProceed()"
          *ngIf="currentStep === totalSteps">
          Generate My Trip Plan 🚀
        </button>
      </div>
    </div>
  `,
  styles: [`
    .questionnaire-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 2rem;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.5s ease;
    }

    .step-indicator {
      text-align: center;
      color: #6c757d;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    .step-content {
      min-height: 400px;
      margin-bottom: 2rem;
    }

    h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
    }

    .step-description {
      color: #6c757d;
      margin-bottom: 2rem;
      text-align: center;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .option-card {
      background: #f8f9fa;
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .option-card:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }

    .option-card.selected {
      border-color: #007bff;
      background: #e3f2fd;
      transform: translateY(-2px);
    }

    .option-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .continent-card, .budget-card {
      text-align: left;
      flex-direction: row;
      justify-content: flex-start;
    }

    .budget-range {
      font-weight: 600;
      color: #28a745;
      margin-top: 0.25rem;
    }

    .duration-selector {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    .duration-input {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f8f9fa;
      padding: 1rem 2rem;
      border-radius: 12px;
    }

    .duration-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #007bff;
      color: white;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .duration-btn:hover:not(:disabled) {
      background: #0056b3;
    }

    .duration-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .duration-display {
      text-align: center;
      margin: 0 1rem;
    }

    .duration-number {
      font-size: 3rem;
      font-weight: 700;
      color: #2c3e50;
      display: block;
    }

    .duration-label {
      color: #6c757d;
      font-size: 1rem;
    }

    .duration-presets {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .preset-btn {
      background: #e9ecef;
      border: 2px solid transparent;
      border-radius: 20px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .preset-btn:hover {
      background: #dee2e6;
    }

    .preset-btn.selected {
      border-color: #007bff;
      background: #e3f2fd;
    }

    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .destination-card {
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
    }

    .destination-card:hover {
      border-color: #007bff;
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .destination-card.selected {
      border-color: #007bff;
      background: #f8f9ff;
    }

    .destination-image {
      width: 100%;
      height: 150px;
      background-size: cover;
      background-position: center;
    }

    .destination-info {
      padding: 1rem;
    }

    .destination-info h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
    }

    .destination-info p {
      margin: 0 0 1rem 0;
      color: #6c757d;
    }

    .destination-highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .highlight-tag {
      background: #e9ecef;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      color: #495057;
    }

    .popularity-score {
      font-weight: 600;
      color: #28a745;
      font-size: 0.875rem;
    }

    .navigation {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 2rem;
    }

    .nav-btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    .nav-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .nav-btn.primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .nav-btn.secondary {
      background: #f8f9fa;
      color: #495057;
      border: 1px solid #dee2e6;
    }

    .nav-btn.secondary:hover:not(:disabled) {
      background: #e9ecef;
    }

    .nav-btn:disabled {
      background: #6c757d;
      color: white;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    @media (max-width: 768px) {
      .questionnaire-container {
        margin: 1rem;
        padding: 1.5rem;
      }

      .options-grid {
        grid-template-columns: 1fr;
      }

      .destinations-grid {
        grid-template-columns: 1fr;
      }

      .navigation {
        flex-direction: column;
      }

      .nav-btn {
        width: 100%;
      }
    }
  `]
})
export class AdvancedQuestionnaireComponent {
  @Output() preferencesSubmitted = new EventEmitter<AdvancedTravelPreferences>();

  currentStep = 1;
  totalSteps = 6;

  preferences: AdvancedTravelPreferences = {
    gender: 'male',
    ageRange: '20-29',
    continent: 'Asia',
    budget: 'student',
    duration: 7,
    selectedDestination: ''
  };

  genderOptions = [
    { value: 'male' as const, label: 'Male', icon: '👨' },
    { value: 'female' as const, label: 'Female', icon: '👩' }
  ];

  ageOptions = [
    { value: '20-29' as const, label: '20-29', icon: '🎓', description: 'Young adventurer' },
    { value: '30-39' as const, label: '30-39', icon: '💼', description: 'Career focused' },
    { value: '40-49' as const, label: '40-49', icon: '🏡', description: 'Established lifestyle' },
    { value: '50-59' as const, label: '50-59', icon: '🎯', description: 'Experienced traveler' },
    { value: '60+' as const, label: '60+', icon: '🌟', description: 'Wisdom & leisure' }
  ];

  continentOptions = [
    { value: 'Asia' as const, label: 'Asia', icon: '🏯', description: 'Rich culture & cuisine' },
    { value: 'Europe' as const, label: 'Europe', icon: '🏰', description: 'History & art' },
    { value: 'North America' as const, label: 'North America', icon: '🗽', description: 'Modern cities & nature' },
    { value: 'South America' as const, label: 'South America', icon: '🏔️', description: 'Adventure & culture' },
    { value: 'Africa' as const, label: 'Africa', icon: '🦁', description: 'Wildlife & heritage' },
    { value: 'Oceania' as const, label: 'Oceania', icon: '🏄', description: 'Beaches & adventure' }
  ];

  budgetOptions = [
    { value: 'student' as const, label: 'Student', icon: '🎓', description: 'Budget-conscious', range: '$20-40/day' },
    { value: 'economic' as const, label: 'Economic', icon: '💰', description: 'Value seeker', range: '$40-80/day' },
    { value: 'comfortable' as const, label: 'Comfortable', icon: '🏨', description: 'Balanced experience', range: '$80-150/day' },
    { value: 'business' as const, label: 'Business', icon: '💼', description: 'Premium comfort', range: '$150-300/day' },
    { value: 'luxury' as const, label: 'Luxury', icon: '💎', description: 'Ultimate experience', range: '$300+/day' }
  ];

  durationPresets = [
    { label: '3 days', days: 3 },
    { label: '1 week', days: 7 },
    { label: '2 weeks', days: 14 },
    { label: '1 month', days: 30 },
    { label: '2 months', days: 60 }
  ];

  // Top 5 destinations by continent
  destinationsMap = {
    'Asia': [
      { name: 'Japan', country: 'Tokyo/Osaka', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', highlights: ['Cherry Blossoms', 'Sushi', 'Tech Culture'], popularity: 98 },
      { name: 'China Mainland', country: 'Beijing/Shanghai', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400', highlights: ['Great Wall', 'History', 'Modern Cities'], popularity: 95 },
      { name: 'Hong Kong', country: 'Hong Kong SAR', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400', highlights: ['Skyline', 'Dim Sum', 'Shopping'], popularity: 92 },
      { name: 'India', country: 'Delhi/Mumbai', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400', highlights: ['Taj Mahal', 'Spices', 'Culture'], popularity: 89 },
      { name: 'Taiwan', country: 'Taipei', image: 'https://images.unsplash.com/photo-1629371994765-ffefc2d1edfe?w=400', highlights: ['Night Markets', 'Mountains', 'Bubble Tea'], popularity: 87 }
    ],
    'Europe': [
      { name: 'France', country: 'Paris', image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400', highlights: ['Eiffel Tower', 'Art', 'Cuisine'], popularity: 99 },
      { name: 'Italy', country: 'Rome/Florence', image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=400', highlights: ['History', 'Pasta', 'Art'], popularity: 97 },
      { name: 'Spain', country: 'Barcelona/Madrid', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', highlights: ['Architecture', 'Flamenco', 'Tapas'], popularity: 94 },
      { name: 'Germany', country: 'Berlin/Munich', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400', highlights: ['History', 'Beer', 'Castles'], popularity: 91 },
      { name: 'United Kingdom', country: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', highlights: ['Royalty', 'Pubs', 'Museums'], popularity: 93 }
    ],
    'North America': [
      { name: 'United States', country: 'NYC/LA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', highlights: ['Cities', 'National Parks', 'Culture'], popularity: 96 },
      { name: 'Canada', country: 'Toronto/Vancouver', image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=400', highlights: ['Nature', 'Cities', 'Maple Syrup'], popularity: 88 },
      { name: 'Mexico', country: 'Mexico City/Cancun', image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400', highlights: ['Beaches', 'History', 'Tacos'], popularity: 85 },
      { name: 'Costa Rica', country: 'San Jose', image: 'https://images.unsplash.com/photo-1576487503401-173ffc35b749?w=400', highlights: ['Wildlife', 'Adventure', 'Nature'], popularity: 82 },
      { name: 'Cuba', country: 'Havana', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', highlights: ['Music', 'Cars', 'History'], popularity: 79 }
    ],
    'South America': [
      { name: 'Brazil', country: 'Rio/Sao Paulo', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400', highlights: ['Beaches', 'Carnival', 'Football'], popularity: 94 },
      { name: 'Argentina', country: 'Buenos Aires', image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400', highlights: ['Tango', 'Steak', 'Wine'], popularity: 88 },
      { name: 'Peru', country: 'Lima/Cusco', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400', highlights: ['Machu Picchu', 'History', 'Food'], popularity: 91 },
      { name: 'Chile', country: 'Santiago', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400', highlights: ['Wine', 'Mountains', 'Coastline'], popularity: 84 },
      { name: 'Colombia', country: 'Bogota/Cartagena', image: 'https://images.unsplash.com/photo-1561320712-5d0d7bd64c9d?w=400', highlights: ['Coffee', 'Culture', 'Beaches'], popularity: 81 }
    ],
    'Africa': [
      { name: 'South Africa', country: 'Cape Town', image: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea?w=400', highlights: ['Safari', 'Wine', 'Beaches'], popularity: 89 },
      { name: 'Egypt', country: 'Cairo', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6930311?w=400', highlights: ['Pyramids', 'History', 'Nile'], popularity: 92 },
      { name: 'Morocco', country: 'Marrakech', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae436d3?w=400', highlights: ['Souks', 'Desert', 'Culture'], popularity: 86 },
      { name: 'Kenya', country: 'Nairobi', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', highlights: ['Safari', 'Wildlife', 'Culture'], popularity: 83 },
      { name: 'Tanzania', country: 'Dar es Salaam', image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400', highlights: ['Kilimanjaro', 'Safari', 'Beaches'], popularity: 80 }
    ],
    'Oceania': [
      { name: 'Australia', country: 'Sydney/Melbourne', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', highlights: ['Beaches', 'Wildlife', 'Cities'], popularity: 95 },
      { name: 'New Zealand', country: 'Auckland/Wellington', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', highlights: ['Nature', 'Adventure', 'Lord of the Rings'], popularity: 91 },
      { name: 'Fiji', country: 'Suva', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', highlights: ['Islands', 'Diving', 'Culture'], popularity: 85 },
      { name: 'French Polynesia', country: 'Tahiti', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400', highlights: ['Paradise', 'Luxury', 'Diving'], popularity: 88 },
      { name: 'Papua New Guinea', country: 'Port Moresby', image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400', highlights: ['Culture', 'Adventure', 'Wildlife'], popularity: 75 }
    ]
  };

  selectGender(gender: 'male' | 'female'): void {
    this.preferences.gender = gender;
  }

  selectAge(age: '20-29' | '30-39' | '40-49' | '50-59' | '60+'): void {
    this.preferences.ageRange = age;
  }

  selectContinent(continent: 'Asia' | 'Africa' | 'North America' | 'South America' | 'Europe' | 'Oceania'): void {
    this.preferences.continent = continent;
    this.preferences.selectedDestination = ''; // Reset destination when continent changes
  }

  selectBudget(budget: 'student' | 'economic' | 'comfortable' | 'business' | 'luxury'): void {
    this.preferences.budget = budget;
  }

  adjustDuration(change: number): void {
    const newDuration = this.preferences.duration + change;
    if (newDuration >= 1 && newDuration <= 365) {
      this.preferences.duration = newDuration;
    }
  }

  setDuration(days: number): void {
    this.preferences.duration = days;
  }

  selectDestination(destination: string): void {
    this.preferences.selectedDestination = destination;
  }

  getTopDestinations() {
    return this.destinationsMap[this.preferences.continent] || [];
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1: return !!this.preferences.gender;
      case 2: return !!this.preferences.ageRange;
      case 3: return !!this.preferences.continent;
      case 4: return !!this.preferences.budget;
      case 5: return this.preferences.duration > 0;
      case 6: return !!this.preferences.selectedDestination;
      default: return false;
    }
  }

  nextStep(): void {
    if (this.canProceed() && this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  generateTripPlan(): void {
    if (this.canProceed()) {
      this.preferencesSubmitted.emit(this.preferences);
    }
  }
}