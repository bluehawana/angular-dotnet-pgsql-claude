import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simple-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="hero">
        <h1>Travel Anywhere</h1>
        <h2>AI-Powered Travel Planning</h2>
        <p>Let our AI create personalized travel experiences just for you</p>
        <button class="cta-button" (click)="startPlanning()">
          Start Planning Your Trip
        </button>
      </div>
      
      <div class="features">
        <h3>How It Works</h3>
        <div class="steps">
          <div class="step">
            <h4>1. Share Your Preferences</h4>
            <p>Tell us about your travel style, budget, and destination preferences</p>
          </div>
          <div class="step">
            <h4>2. Get AI Recommendations</h4>
            <p>Our AI analyzes your preferences to suggest perfect destinations</p>
          </div>
          <div class="step">
            <h4>3. Receive Custom Itinerary</h4>
            <p>Get a detailed travel plan with activities, accommodations, and transport</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      margin-bottom: 4rem;
    }

    .hero h1 {
      font-size: 3.5rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .hero h2 {
      font-size: 2rem;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.25rem;
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .cta-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1.5rem 3rem;
      font-size: 1.25rem;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-2px);
    }

    .features {
      text-align: center;
    }

    .features h3 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 3rem;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .step {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .step h4 {
      color: #667eea;
      margin-bottom: 1rem;
    }

    .step p {
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2.5rem;
      }
      
      .hero h2 {
        font-size: 1.5rem;
      }
      
      .steps {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SimpleHomeComponent {
  constructor(private router: Router) {}

  startPlanning(): void {
    this.router.navigate(['/plan']);
  }
}