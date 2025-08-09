import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Discover Your Perfect Journey</h1>
          <p class="hero-subtitle">
            Let AI craft personalized travel experiences based on your preferences, budget, and dreams.
            From hidden gems to iconic destinations, we'll plan every detail of your adventure.
          </p>
          <button class="cta-button" (click)="startPlanning()">
            Start Planning Your Trip
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="arrow-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div class="hero-image">
          <div class="image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="features-container">
          <h2 class="features-title">Why Choose AI Travel Planning?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>AI-Powered Recommendations</h3>
              <p>Our advanced AI analyzes your preferences to suggest destinations and activities perfectly matched to your interests.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3>Budget Optimization</h3>
              <p>Get the most value from your travel budget with smart recommendations for flights, accommodations, and activities.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2H9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </div>
              <h3>Personalized Itineraries</h3>
              <p>Receive detailed day-by-day plans tailored to your travel style, duration, and preferred activities.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="how-it-works">
        <div class="how-it-works-container">
          <h2>How It Works</h2>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Share Your Preferences</h3>
                <p>Tell us about your travel style, budget, preferred destinations, and interests.</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>AI Finds Perfect Destinations</h3>
                <p>Our AI analyzes millions of travel data points to recommend the best destinations for you.</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Get Your Custom Itinerary</h3>
                <p>Receive a detailed travel plan with accommodations, activities, and transportation options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      min-height: 70vh;
      margin-bottom: 4rem;
    }

    .hero-content {
      max-width: 600px;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      color: #6b7280;
      margin-bottom: 2.5rem;
    }

    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .arrow-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }

    .cta-button:hover .arrow-icon {
      transform: translateX(4px);
    }

    .hero-image {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .image-placeholder {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .image-placeholder svg {
      width: 200px;
      height: 200px;
      color: #667eea;
    }

    .features {
      margin-bottom: 4rem;
    }

    .features-container {
      text-align: center;
    }

    .features-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 3rem;
      color: #1f2937;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
    }

    .feature-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .feature-icon svg {
      width: 30px;
      height: 30px;
      color: white;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .feature-card p {
      color: #6b7280;
      line-height: 1.6;
    }

    .how-it-works {
      margin-bottom: 4rem;
    }

    .how-it-works-container {
      text-align: center;
    }

    .how-it-works h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 3rem;
      color: #1f2937;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      text-align: left;
    }

    .step-number {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1f2937;
    }

    .step-content p {
      color: #6b7280;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 0 1rem;
      }

      .hero {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
        min-height: auto;
        margin-bottom: 3rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .image-placeholder {
        width: 300px;
        height: 300px;
      }

      .image-placeholder svg {
        width: 150px;
        height: 150px;
      }

      .features-title,
      .how-it-works h2 {
        font-size: 2rem;
      }

      .step {
        text-align: center;
        flex-direction: column;
        align-items: center;
      }

      .step-content {
        text-align: center;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  startPlanning(): void {
    this.router.navigate(['/plan']);
  }
}