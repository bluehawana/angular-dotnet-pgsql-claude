import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelPlan } from '../../services/travel-plan-generator.service';

@Component({
  selector: 'app-travel-plan-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="travel-plan-container" *ngIf="travelPlan">
      <div class="plan-header">
        <h1>Your Customized Travel Plan</h1>
        <div class="trip-summary">
          <div class="summary-card">
            <h3>{{getDestinationName(travelPlan.destination)}}</h3>
            <p>{{travelPlan.duration}} days • {{getBudgetLabel(travelPlan.budget)}} budget</p>
            <div class="total-cost">
              <span class="cost-label">Total Estimated Cost:</span>
              <span class="cost-amount">\${{travelPlan.totalEstimatedCost}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="plan-sections">
        <!-- Cost Breakdown -->
        <div class="section">
          <h2>💰 Cost Breakdown</h2>
          <div class="cost-breakdown">
            <div class="cost-item">
              <span>Accommodation</span>
              <span>\${{travelPlan.costBreakdown.accommodation}}/day</span>
            </div>
            <div class="cost-item">
              <span>Transportation</span>
              <span>\${{travelPlan.costBreakdown.transportation}}/day</span>
            </div>
            <div class="cost-item">
              <span>Meals</span>
              <span>\${{travelPlan.costBreakdown.meals}}/day</span>
            </div>
            <div class="cost-item">
              <span>Activities</span>
              <span>\${{travelPlan.costBreakdown.activities}}/day</span>
            </div>
            <div class="cost-item">
              <span>Miscellaneous</span>
              <span>\${{travelPlan.costBreakdown.miscellaneous}}/day</span>
            </div>
          </div>
        </div>

        <!-- Budget Tips -->
        <div class="section">
          <h2>💡 Money-Saving Tips</h2>
          <ul class="tips-list">
            <li *ngFor="let tip of travelPlan.budgetTips">{{tip}}</li>
          </ul>
        </div>

        <!-- Sample Itinerary -->
        <div class="section">
          <h2>📅 Sample Itinerary (First 7 Days)</h2>
          <div class="itinerary">
            <div class="day-card" *ngFor="let day of getDisplayItinerary()">
              <h3>Day {{day.day}}</h3>
              <div class="day-details">
                <div class="detail-section">
                  <strong>Activities:</strong>
                  <ul>
                    <li *ngFor="let activity of day.activities">{{activity}}</li>
                  </ul>
                </div>
                <div class="detail-section">
                  <strong>Accommodation:</strong> {{day.accommodation}}
                </div>
                <div class="detail-section">
                  <strong>Transportation:</strong> {{day.transportation}}
                </div>
                <div class="detail-section">
                  <strong>Meals:</strong> {{day.meals.join(', ')}}
                </div>
                <div class="daily-cost">
                  Daily Budget: \${{day.estimatedCost}}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Travel Summary -->
        <div class="section">
          <h2>📊 Trip Summary</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Total Duration:</span>
              <span class="summary-value">{{travelPlan.duration}} days</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Estimated Cost:</span>
              <span class="summary-value">\${{travelPlan.totalEstimatedCost}}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Daily Budget:</span>
              <span class="summary-value">\${{getDailyBudget()}}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Places to Visit:</span>
              <span class="summary-value">{{getPlaceCount()}} locations</span>
            </div>
          </div>
        </div>

        <!-- Preparation Checklist -->
        <div class="section">
          <h2>✅ Travel Preparation Checklist</h2>
          <div class="checklist">
            <div class="checklist-item" *ngFor="let item of travelPlan.preparationChecklist">
              <input type="checkbox" [id]="'check-' + getCheckboxId(item)">
              <label [for]="'check-' + getCheckboxId(item)">{{item}}</label>
            </div>
          </div>
        </div>

        <!-- Travel Advice -->
        <div class="section">
          <h2>🧳 Travel Advice</h2>
          <ul class="advice-list">
            <li *ngFor="let advice of travelPlan.travelAdvice">{{advice}}</li>
          </ul>
        </div>
      </div>

      <div class="plan-footer">
        <button class="btn btn-primary" (click)="downloadPlan()">Download Plan</button>
        <button class="btn btn-secondary" (click)="startNewPlan()">Plan Another Trip</button>
      </div>
    </div>
  `,
  styles: [`
    .travel-plan-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .plan-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .plan-header h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 2.5rem;
    }

    .trip-summary {
      display: flex;
      justify-content: center;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      text-align: center;
      min-width: 300px;
    }

    .summary-card h3 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      text-transform: capitalize;
    }

    .total-cost {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.3);
    }

    .cost-amount {
      font-size: 1.5rem;
      font-weight: bold;
      margin-left: 0.5rem;
    }

    .plan-sections {
      display: grid;
      gap: 2rem;
    }

    .section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #667eea;
    }

    .section h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .cost-breakdown {
      display: grid;
      gap: 1rem;
    }

    .cost-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 3px solid #667eea;
    }

    .cost-item span:first-child {
      font-weight: 600;
      color: #2c3e50;
    }

    .cost-item span:last-child {
      font-weight: bold;
      color: #667eea;
    }

    .tips-list, .advice-list {
      list-style: none;
      padding: 0;
    }

    .tips-list li, .advice-list li {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: #e3f2fd;
      border-radius: 8px;
      border-left: 3px solid #2196f3;
      position: relative;
      padding-left: 2rem;
    }

    .tips-list li:before {
      content: "💡";
      position: absolute;
      left: 0.5rem;
    }

    .advice-list li:before {
      content: "👉";
      position: absolute;
      left: 0.5rem;
    }

    .itinerary {
      display: grid;
      gap: 1.5rem;
    }

    .day-card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      background: #fafafa;
    }

    .day-card h3 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .day-details {
      display: grid;
      gap: 1rem;
    }

    .detail-section {
      padding: 0.75rem;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #667eea;
    }

    .detail-section strong {
      color: #2c3e50;
      display: block;
      margin-bottom: 0.5rem;
    }

    .detail-section ul {
      margin: 0;
      padding-left: 1rem;
    }

    .daily-cost {
      text-align: right;
      font-weight: bold;
      color: #667eea;
      font-size: 1.1rem;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: center;
    }

    .summary-label {
      font-weight: 600;
      color: #6c757d;
      margin-bottom: 0.5rem;
    }

    .summary-value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #667eea;
    }

    .checklist {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 0.5rem;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .checklist-item input[type="checkbox"] {
      margin-right: 0.75rem;
      transform: scale(1.2);
    }

    .checklist-item label {
      cursor: pointer;
      user-select: none;
    }

    .plan-footer {
      margin-top: 3rem;
      text-align: center;
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
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .travel-plan-container {
        padding: 1rem;
      }
      
      .plan-header h1 {
        font-size: 2rem;
      }
      
      .summary-card {
        min-width: auto;
        width: 100%;
      }
      
      .plan-footer {
        flex-direction: column;
        align-items: center;
      }
      
      .btn {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class TravelPlanDisplayComponent {
  @Input() travelPlan!: TravelPlan;

  getDestinationName(destination: string): string {
    const names: {[key: string]: string} = {
      'japan': 'Japan',
      'china': 'China',
      'hong-kong': 'Hong Kong',
      'india': 'India',
      'taiwan': 'Taiwan',
      'france': 'France',
      'italy': 'Italy',
      'spain': 'Spain',
      'germany': 'Germany',
      'uk': 'United Kingdom',
      'usa': 'United States',
      'canada': 'Canada',
      'mexico': 'Mexico',
      'costa-rica': 'Costa Rica',
      'guatemala': 'Guatemala',
      'brazil': 'Brazil',
      'argentina': 'Argentina',
      'peru': 'Peru',
      'chile': 'Chile',
      'colombia': 'Colombia',
      'south-africa': 'South Africa',
      'morocco': 'Morocco',
      'egypt': 'Egypt',
      'kenya': 'Kenya',
      'tanzania': 'Tanzania'
    };
    return names[destination] || destination;
  }

  getBudgetLabel(budget: string): string {
    const labels: {[key: string]: string} = {
      'student': 'Student',
      'economic': 'Economic',
      'comfortable': 'Comfortable',
      'business': 'Business',
      'luxury': 'Luxury'
    };
    return labels[budget] || budget;
  }

  getDisplayItinerary() {
    return this.travelPlan.itinerary.slice(0, Math.min(7, this.travelPlan.duration));
  }

  getDailyBudget(): number {
    return Math.round(this.travelPlan.totalEstimatedCost / this.travelPlan.duration);
  }

  getPlaceCount(): number {
    const uniqueActivities = new Set();
    this.travelPlan.itinerary.forEach((day: any) => {
      day.activities.forEach((activity: any) => uniqueActivities.add(activity));
    });
    return uniqueActivities.size;
  }

  getCheckboxId(item: string): string {
    return item.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  downloadPlan(): void {
    const planText = this.generatePlanText();
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-plan-${this.travelPlan.destination}-${this.travelPlan.duration}days.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  startNewPlan(): void {
    window.location.reload();
  }

  private generatePlanText(): string {
    return `
TRAVEL PLAN: ${this.getDestinationName(this.travelPlan.destination)}
Duration: ${this.travelPlan.duration} days
Budget: ${this.getBudgetLabel(this.travelPlan.budget)}
Total Estimated Cost: $${this.travelPlan.totalEstimatedCost}

COST BREAKDOWN (per day):
- Accommodation: $${this.travelPlan.costBreakdown.accommodation}
- Transportation: $${this.travelPlan.costBreakdown.transportation}  
- Meals: $${this.travelPlan.costBreakdown.meals}
- Activities: $${this.travelPlan.costBreakdown.activities}
- Miscellaneous: $${this.travelPlan.costBreakdown.miscellaneous}

MONEY-SAVING TIPS:
${this.travelPlan.budgetTips.map((tip: any) => `• ${tip}`).join('\n')}

PREPARATION CHECKLIST:
${this.travelPlan.preparationChecklist.map((item: any) => `☐ ${item}`).join('\n')}

TRAVEL ADVICE:
${this.travelPlan.travelAdvice.map((advice: any) => `• ${advice}`).join('\n')}
    `.trim();
  }
}