import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TravelPlan {
  destination: string;
  duration: number;
  budget: string;
  totalEstimatedCost: number;
  itinerary: DayItinerary[];
  budgetTips: string[];
  travelAdvice: string[];
  preparationChecklist: string[];
  costBreakdown: CostBreakdown;
}

export interface DayItinerary {
  day: number;
  activities: string[];
  accommodation: string;
  transportation: string;
  meals: string[];
  estimatedCost: number;
}

export interface CostBreakdown {
  accommodation: number;
  transportation: number;
  meals: number;
  activities: number;
  miscellaneous: number;
}

@Injectable({
  providedIn: 'root'
})
export class TravelPlanGeneratorService {
  private apiUrl = 'http://localhost:5555/api';

  constructor(private http: HttpClient) {}

  generateEnhancedTravelPlan(preferences: any): Observable<TravelPlan> {
    // Map frontend preferences to backend format
    const request = {
      destinationId: this.getDestinationId(preferences.selectedDestination),
      preferences: {
        gender: preferences.gender,
        ageRange: preferences.ageRange,
        budgetCategory: preferences.budgetCategory,
        preferredContinent: preferences.preferredContinent,
        travelDurationDays: preferences.travelDuration,
        selectedDestination: preferences.selectedDestination
      }
    };

    return this.http.post<any>(`${this.apiUrl}/TravelPlan/generate`, request)
      .pipe(map(response => this.mapBackendResponseToTravelPlan(response, preferences)));
  }

  private getDestinationId(destination: string): number {
    // Map destination strings to IDs (would normally come from destinations API)
    const destinationIds: {[key: string]: number} = {
      'japan': 1,
      'china': 2,
      'hong-kong': 3,
      'india': 4,
      'taiwan': 5,
      'france': 6,
      'italy': 7,
      'spain': 8,
      'germany': 9,
      'uk': 10,
      'usa': 11,
      'canada': 12,
      'mexico': 13,
      'costa-rica': 14,
      'guatemala': 15,
      'brazil': 16,
      'argentina': 17,
      'peru': 18,
      'chile': 19,
      'colombia': 20,
      'south-africa': 21,
      'morocco': 22,
      'egypt': 23,
      'kenya': 24,
      'tanzania': 25
    };
    return destinationIds[destination] || 1;
  }

  private mapBackendResponseToTravelPlan(response: any, preferences: any): TravelPlan {
    // Convert backend response to frontend TravelPlan format
    const itinerary: DayItinerary[] = response.dailyItinerary?.map((day: any) => ({
      day: day.dayNumber,
      activities: day.activities?.map((a: any) => `${a.time}: ${a.name} - ${a.description}`) || [],
      accommodation: response.recommendedAccommodation || 'Standard accommodation',
      transportation: response.recommendedTransport || 'Public transport',
      meals: this.getMealRecommendations(preferences.budgetCategory),
      estimatedCost: day.estimatedCost || 0
    })) || [];

    const costBreakdown: CostBreakdown = {
      accommodation: response.budgetBreakdown?.accommodation || 0,
      transportation: response.budgetBreakdown?.transportation || 0,
      meals: response.budgetBreakdown?.food || 0,
      activities: response.budgetBreakdown?.activities || 0,
      miscellaneous: response.budgetBreakdown?.misc || 0
    };

    return {
      destination: preferences.selectedDestination,
      duration: preferences.travelDuration,
      budget: preferences.budgetCategory,
      totalEstimatedCost: response.totalBudget || 0,
      itinerary,
      budgetTips: response.moneySavingTips || [],
      travelAdvice: response.travelTips || [],
      preparationChecklist: response.preparationChecklist || [],
      costBreakdown
    };
  }

  private budgetMultipliers = {
    'student': 1,
    'economic': 1.5,
    'comfortable': 2.5,
    'business': 4,
    'luxury': 7
  };

  private destinationBaseCosts: {[key: string]: number} = {
    'japan': 80,
    'china': 40,
    'hong-kong': 90,
    'india': 25,
    'taiwan': 60,
    'france': 100,
    'italy': 85,
    'spain': 75,
    'germany': 90,
    'uk': 110,
    'usa': 120,
    'canada': 95,
    'mexico': 45,
    'costa-rica': 55,
    'guatemala': 35,
    'brazil': 50,
    'argentina': 45,
    'peru': 35,
    'chile': 60,
    'colombia': 40,
    'south-africa': 50,
    'morocco': 40,
    'egypt': 35,
    'kenya': 45,
    'tanzania': 50
  };

  generateTravelPlan(preferences: any): TravelPlan {
    const baseCost = this.destinationBaseCosts[preferences.selectedDestination] || 60;
    const budgetMultiplier = this.budgetMultipliers[preferences.budgetCategory as keyof typeof this.budgetMultipliers] || 1;
    const dailyBudget = baseCost * budgetMultiplier;
    const totalCost = dailyBudget * preferences.travelDuration;

    const itinerary = this.generateItinerary(preferences, dailyBudget);
    const budgetTips = this.getBudgetTips(preferences.budgetCategory, preferences.selectedDestination);
    const travelAdvice = this.getTravelAdvice(preferences);
    const preparationChecklist = this.getPreparationChecklist(preferences.selectedDestination);
    const costBreakdown = this.getCostBreakdown(dailyBudget);

    return {
      destination: preferences.selectedDestination,
      duration: preferences.travelDuration,
      budget: preferences.budgetCategory,
      totalEstimatedCost: totalCost,
      itinerary,
      budgetTips,
      travelAdvice,
      preparationChecklist,
      costBreakdown
    };
  }

  private generateItinerary(preferences: any, dailyBudget: number): DayItinerary[] {
    const itinerary: DayItinerary[] = [];
    
    for (let day = 1; day <= preferences.travelDuration; day++) {
      const dayPlan: DayItinerary = {
        day,
        activities: this.getDayActivities(preferences, day),
        accommodation: this.getAccommodationRecommendation(preferences.budgetCategory),
        transportation: this.getTransportationRecommendation(preferences.budgetCategory),
        meals: this.getMealRecommendations(preferences.budgetCategory),
        estimatedCost: dailyBudget
      };
      itinerary.push(dayPlan);
    }

    return itinerary;
  }

  private getDayActivities(preferences: any, day: number): string[] {
    const destinationActivities: {[key: string]: string[]} = {
      'japan': ['Visit Senso-ji Temple', 'Explore Shibuya Crossing', 'Experience traditional onsen', 'Try authentic ramen', 'Visit Mount Fuji'],
      'china': ['Walk the Great Wall', 'Explore Forbidden City', 'Visit Terracotta Warriors', 'Cruise Li River', 'Discover Shanghai Bund'],
      'hong-kong': ['Ride Star Ferry', 'Visit Victoria Peak', 'Explore Temple Street Night Market', 'Take tram to Peak', 'Dim sum experience'],
      'india': ['Visit Taj Mahal', 'Explore Red Fort', 'Experience Varanasi ghats', 'Kerala backwaters cruise', 'Rajasthan desert safari'],
      'taiwan': ['Visit Taipei 101', 'Explore Night Markets', 'Taroko Gorge hiking', 'Sun Moon Lake', 'Hot springs in Beitou']
    };

    const activities = destinationActivities[preferences.selectedDestination] || ['Explore city center', 'Visit local museums', 'Try local cuisine'];
    const shuffled = [...activities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(2, shuffled.length));
  }

  private getAccommodationRecommendation(budget: string): string {
    const recommendations: {[key: string]: string} = {
      'student': 'Hostels, guesthouses, Airbnb shared rooms',
      'economic': 'Budget hotels, Airbnb private rooms, capsule hotels',
      'comfortable': 'Mid-range hotels, boutique accommodations, private Airbnb',
      'business': 'Business hotels, premium locations, hotel chains',
      'luxury': 'Luxury resorts, 5-star hotels, premium suites'
    };
    return recommendations[budget] || 'Mid-range accommodations';
  }

  private getTransportationRecommendation(budget: string): string {
    const recommendations: {[key: string]: string} = {
      'student': 'Public transport, walking, overnight buses/trains',
      'economic': 'Public transport, budget airlines, regional trains',
      'comfortable': 'Mix of public transport and taxis, domestic flights',
      'business': 'Taxis, business class flights, private transfers',
      'luxury': 'Private cars, first class flights, luxury transfers'
    };
    return recommendations[budget] || 'Public transportation';
  }

  private getMealRecommendations(budget: string): string[] {
    const recommendations: {[key: string]: string[]} = {
      'student': ['Street food', 'Local markets', 'Convenience stores', 'Self-cooking'],
      'economic': ['Local restaurants', 'Food courts', 'Casual dining', 'Market food'],
      'comfortable': ['Mid-range restaurants', 'Hotel breakfast', 'Local specialties', 'Cafe dining'],
      'business': ['Restaurant dining', 'Hotel meals', 'Business lunches', 'Quality establishments'],
      'luxury': ['Fine dining', 'Michelin restaurants', 'Hotel dining', 'Premium experiences']
    };
    return recommendations[budget] || ['Local restaurants', 'Street food'];
  }

  private getBudgetTips(budget: string, destination: string): string[] {
    const tips: {[key: string]: string[]} = {
      'student': [
        'Book night flights to save on accommodation',
        'Use public transport extensively - get day/week passes',
        'Stay in hostels or shared Airbnb accommodations',
        'Eat street food and cook your own meals when possible',
        'Look for free walking tours and museums',
        'Use student discounts where available',
        'Travel during shoulder seasons for better prices',
        'Book group tours for better rates',
        'Use coupon apps and loyalty programs',
        'Visit free attractions and public parks'
      ],
      'economic': [
        'Compare flight prices across multiple dates',
        'Use metro/train systems for city travel',
        'Stay in budget hotels or guesthouses',
        'Mix street food with casual restaurants',
        'Look for city tourism cards with discounts',
        'Book activities in advance for deals'
      ],
      'comfortable': [
        'Book flights with one connection to save money',
        'Use ride-sharing when public transport isn\'t convenient',
        'Stay in mid-range hotels or quality Airbnb',
        'Enjoy local restaurants and specialties',
        'Book popular attractions in advance'
      ],
      'business': [
        'Priority boarding and seat selection',
        'Airport lounges and fast-track services',
        'Business hotels in central locations',
        'Quality dining experiences',
        'Private tour guides and experiences'
      ],
      'luxury': [
        'First-class flights and premium services',
        'Luxury hotels and resorts',
        'Private transfers and concierge services',
        'Exclusive dining and experiences',
        'Premium spa and wellness treatments'
      ]
    };
    return tips[budget] || tips['comfortable'];
  }

  private getTravelAdvice(preferences: any): string[] {
    return [
      `Pack appropriately for ${preferences.travelDuration} days`,
      'Check visa requirements well in advance',
      'Get travel insurance for your trip',
      'Notify banks of your travel plans',
      'Research local customs and etiquette',
      'Download offline maps and translation apps',
      'Keep digital and physical copies of important documents',
      'Research local emergency numbers and embassy contacts'
    ];
  }

  private getPreparationChecklist(destination: string): string[] {
    const baseChecklist = [
      'Valid passport (6+ months validity)',
      'Visa application (if required)',
      'Travel insurance',
      'Flight tickets',
      'Hotel/accommodation bookings',
      'Travel adapter and chargers',
      'Emergency contact information',
      'Bank/credit card notifications',
      'Prescription medications',
      'Weather-appropriate clothing'
    ];

    const destinationSpecific: {[key: string]: string[]} = {
      'japan': ['JR Pass (if staying 7+ days)', 'IC Card for public transport', 'Cash (Japan is cash-heavy)'],
      'china': ['VPN app (for internet access)', 'Translation app', 'Cash and mobile payment setup'],
      'india': ['Vaccination certificates', 'Anti-diarrheal medication', 'Water purification tablets'],
      'usa': ['ESTA authorization', 'Travel-sized toiletries (TSA rules)', 'Tipping cash'],
      'uk': ['Umbrella/rain gear', 'Contactless payment card', 'UK power adapter']
    };

    return [...baseChecklist, ...(destinationSpecific[destination] || [])];
  }

  private getCostBreakdown(dailyBudget: number): CostBreakdown {
    return {
      accommodation: Math.round(dailyBudget * 0.4),
      transportation: Math.round(dailyBudget * 0.2),
      meals: Math.round(dailyBudget * 0.25),
      activities: Math.round(dailyBudget * 0.1),
      miscellaneous: Math.round(dailyBudget * 0.05)
    };
  }
}