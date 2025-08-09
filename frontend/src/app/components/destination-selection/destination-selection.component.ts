import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  popularityScore: number;
}

@Component({
  selector: 'app-destination-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="destination-selection-container">
      <h2>Choose Your Destination</h2>
      <p class="subtitle">Based on your preferences, here are the top recommended destinations</p>
      
      <div class="destinations-grid" *ngIf="destinations && destinations.length > 0">
        <div *ngFor="let destination of destinations" 
             class="destination-card"
             [class.selected]="selectedDestination?.id === destination.id"
             (click)="selectDestination(destination)">
          
          <div class="destination-image">
            <img [src]="destination.imageUrl" [alt]="destination.name" 
                 onerror="this.src='assets/images/placeholder-destination.jpg'">
          </div>
          
          <div class="destination-content">
            <h3>{{ destination.name }}</h3>
            <p class="country">{{ destination.country }}</p>
            <p class="description">{{ destination.description }}</p>
            
            <div class="popularity-score">
              <span class="score-label">Popularity:</span>
              <div class="score-bar">
                <div class="score-fill" [style.width.%]="destination.popularityScore"></div>
              </div>
              <span class="score-value">{{ destination.popularityScore }}/100</span>
            </div>
          </div>
          
          <div class="selection-indicator" *ngIf="selectedDestination?.id === destination.id">
            <i class="checkmark">✓</i>
          </div>
        </div>
      </div>
      
      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Finding the perfect destinations for you...</p>
      </div>
      
      <div class="empty-state" *ngIf="!isLoading && (!destinations || destinations.length === 0)">
        <p>No destinations found. Please try different preferences.</p>
      </div>
      
      <div class="form-actions" *ngIf="selectedDestination">
        <button type="button" class="btn btn-primary" (click)="confirmSelection()">
          Generate AI Travel Plan for {{ selectedDestination.name }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .destination-selection-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
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

    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .destination-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .destination-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .destination-card.selected {
      border: 3px solid #007bff;
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
    }

    .destination-image {
      height: 200px;
      overflow: hidden;
    }

    .destination-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .destination-content {
      padding: 1.5rem;
    }

    .destination-content h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }

    .country {
      margin: 0 0 1rem 0;
      color: #007bff;
      font-weight: 600;
    }

    .description {
      margin: 0 0 1rem 0;
      color: #6c757d;
      line-height: 1.5;
    }

    .popularity-score {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .score-label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.875rem;
    }

    .score-bar {
      flex: 1;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .score-fill {
      height: 100%;
      background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);
      transition: width 0.3s ease;
    }

    .score-value {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.875rem;
    }

    .selection-indicator {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #007bff;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: bold;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }

    .spinner {
      width: 40px;
      height: 40px;
      margin: 0 auto 1rem;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .form-actions {
      text-align: center;
      margin-top: 2rem;
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
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    @media (max-width: 768px) {
      .destination-selection-container {
        margin: 1rem;
        padding: 1.5rem;
      }

      .destinations-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DestinationSelectionComponent {
  @Input() destinations: Destination[] = [];
  @Input() isLoading: boolean = false;
  @Output() destinationSelected = new EventEmitter<Destination>();

  selectedDestination: Destination | null = null;

  selectDestination(destination: Destination): void {
    this.selectedDestination = destination;
  }

  confirmSelection(): void {
    if (this.selectedDestination) {
      this.destinationSelected.emit(this.selectedDestination);
    }
  }
}