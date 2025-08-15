import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simple-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1>Your Adventure Awaits</h1>
          <p>Discover breathtaking destinations and create unforgettable memories</p>
          <button class="cta-button" (click)="startPlanning()">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>

    <!-- Why Choose TravelDay Section -->
    <section class="features-section">
      <div class="container">
        <h2>Why Choose TravelDay?</h2>
        <p class="features-subtitle">Experience the difference with our personalized travel planning</p>
        
        <div class="features-grid">
          <div class="feature-card blue">
            <div class="feature-icon blue-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
              </svg>
            </div>
            <h3>Personalized Itineraries</h3>
            <p>Every plan is crafted specifically for your preferences, budget, and travel style using advanced AI.</p>
          </div>
          
          <div class="feature-card pink">
            <div class="feature-icon pink-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
                <polyline points="12,6 12,12 16,14" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Save Time & Money</h3>
            <p>Get cost-effective recommendations for flights, hotels, and activities in minutes, not hours.</p>
          </div>
          
          <div class="feature-card teal">
            <div class="feature-icon teal-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="white"/>
              </svg>
            </div>
            <h3>Expert Recommendations</h3>
            <p>Discover hidden gems and must-visit attractions curated by travel experts and locals.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <h2>What Our Travelers Say</h2>
        <p class="testimonials-subtitle">Real experiences from real adventurers</p>
        
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="stars">★★★★★</div>
            <p>"TravelDay created the perfect honeymoon itinerary for us. Every recommendation was spot-on, and we discovered places we never would have found on our own!"</p>
            <div class="testimonial-author">
              <strong>Sarah M.</strong>
              <span>Honeymooner</span>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="stars">★★★★★</div>
            <p>"As a solo traveler, I was nervous about planning my first international trip. TravelDay made everything so easy and gave me the confidence to explore!"</p>
            <div class="testimonial-author">
              <strong>Michael R.</strong>
              <span>Solo Adventurer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Hero Section */
    .hero {
      height: 100vh;
      min-height: 600px;
      background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
                  url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .hero-overlay {
      text-align: center;
      color: white;
      z-index: 2;
    }

    .hero-content h1 {
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .hero-content p {
      font-size: 1.5rem;
      margin-bottom: 3rem;
      max-width: 600px;
      opacity: 0.95;
    }

    .cta-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1.25rem 3rem;
      font-size: 1.2rem;
      font-weight: 600;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
    }

    /* Container */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Features Section */
    .features-section {
      padding: 6rem 0;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .features-section h2 {
      text-align: center;
      font-size: 3rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .features-subtitle {
      text-align: center;
      font-size: 1.2rem;
      color: #6b7280;
      margin-bottom: 4rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 2.5rem 2rem;
      border-radius: 24px;
      text-align: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      margin: 1rem;
    }

    .feature-card:hover {
      transform: translateY(-25px);
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .feature-card.blue {
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 
        0 20px 40px rgba(59, 130, 246, 0.15),
        0 8px 16px rgba(59, 130, 246, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .feature-card.blue:hover {
      box-shadow: 
        0 60px 120px rgba(59, 130, 246, 0.25),
        0 40px 80px rgba(59, 130, 246, 0.2),
        0 20px 40px rgba(59, 130, 246, 0.15),
        0 10px 20px rgba(59, 130, 246, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 1);
    }

    .feature-card.pink {
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 
        0 20px 40px rgba(236, 72, 153, 0.15),
        0 8px 16px rgba(236, 72, 153, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .feature-card.pink:hover {
      box-shadow: 
        0 60px 120px rgba(236, 72, 153, 0.25),
        0 40px 80px rgba(236, 72, 153, 0.2),
        0 20px 40px rgba(236, 72, 153, 0.15),
        0 10px 20px rgba(236, 72, 153, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 1);
    }

    .feature-card.teal {
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 
        0 20px 40px rgba(20, 184, 166, 0.15),
        0 8px 16px rgba(20, 184, 166, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .feature-card.teal:hover {
      box-shadow: 
        0 60px 120px rgba(20, 184, 166, 0.25),
        0 40px 80px rgba(20, 184, 166, 0.2),
        0 20px 40px rgba(20, 184, 166, 0.15),
        0 10px 20px rgba(20, 184, 166, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 1);
    }

    .feature-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem auto;
      box-shadow: 
        0 8px 16px rgba(0, 0, 0, 0.15),
        0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .blue-icon {
      background: linear-gradient(135deg, #3b82f6, #1e40af);
    }

    .pink-icon {
      background: linear-gradient(135deg, #ec4899, #be185d);
    }

    .teal-icon {
      background: linear-gradient(135deg, #14b8a6, #0f766e);
    }

    .feature-card h3 {
      font-size: 1.4rem;
      color: #1f2937;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .feature-card p {
      color: #6b7280;
      line-height: 1.6;
      font-size: 0.95rem;
      font-weight: 400;
    }

    /* Testimonials Section */
    .testimonials-section {
      padding: 6rem 0;
      background: #1f2937;
      color: white;
    }

    .testimonials-section h2 {
      text-align: center;
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .testimonials-subtitle {
      text-align: center;
      font-size: 1.2rem;
      opacity: 0.8;
      margin-bottom: 4rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 3rem;
      margin-top: 3rem;
    }

    .testimonial-card {
      background: #374151;
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .stars {
      color: #fbbf24;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .testimonial-card p {
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 2rem;
      font-style: italic;
    }

    .testimonial-author strong {
      display: block;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
    }

    .testimonial-author span {
      color: #9ca3af;
      font-size: 0.9rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5rem;
      }
      
      .hero-content p {
        font-size: 1.2rem;
      }

      .features-section h2,
      .testimonials-section h2 {
        font-size: 2.5rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .testimonial-card {
        padding: 2rem;
      }

      .feature-card {
        padding: 2rem 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .hero-content h1 {
        font-size: 2rem;
      }
      
      .cta-button {
        padding: 1rem 2rem;
        font-size: 1rem;
      }

      .features-section,
      .testimonials-section {
        padding: 4rem 0;
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