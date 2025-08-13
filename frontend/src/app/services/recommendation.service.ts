import { Injectable } from '@angular/core';
import { TravelPreferences } from '../components/travel-questionnaire/travel-questionnaire.component';

export interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  popularityScore: number;
  budgetLevel: 'economy' | 'mid-range' | 'luxury' | 'ultra-luxury';
  ageAppeal: string[];
  genderAppeal: string[];
  continentCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private allDestinations: Destination[] = [
    // Asia - Economy Friendly
    {
      id: 1, name: 'Bangkok', country: 'Thailand', 
      description: 'Budget-friendly paradise with street food and temples',
      imageUrl: 'https://images.unsplash.com/photo-1563492065153-83ee6b0f4d12?w=400',
      popularityScore: 95, budgetLevel: 'economy', 
      ageAppeal: ['18-25', '26-35'], genderAppeal: ['male', 'female', 'other'], 
      continentCode: 'asia'
    },
    {
      id: 2, name: 'Ho Chi Minh City', country: 'Vietnam',
      description: 'Vibrant city perfect for young budget travelers',
      imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
      popularityScore: 88, budgetLevel: 'economy',
      ageAppeal: ['18-25', '26-35'], genderAppeal: ['male', 'female', 'other'],
      continentCode: 'asia'
    },
    
    // Asia - Luxury
    {
      id: 3, name: 'Tokyo', country: 'Japan',
      description: 'Sophisticated metropolis perfect for mature luxury travelers',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      popularityScore: 98, budgetLevel: 'luxury',
      ageAppeal: ['36-45', '46-55', '56-65'], genderAppeal: ['male', 'female', 'other'],
      continentCode: 'asia'
    },
    
    // Europe - Mid-range
    {
      id: 4, name: 'Barcelona', country: 'Spain',
      description: 'Perfect blend of culture, nightlife, and affordability',
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400',
      popularityScore: 92, budgetLevel: 'mid-range',
      ageAppeal: ['26-35', '36-45'], genderAppeal: ['male', 'female', 'other'],
      continentCode: 'europe'
    },
    {
      id: 5, name: 'Prague', country: 'Czech Republic',
      description: 'Fairy-tale city with affordable luxury and rich history',
      imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400',
      popularityScore: 89, budgetLevel: 'mid-range',
      ageAppeal: ['26-35', '36-45', '46-55'], genderAppeal: ['male', 'female', 'other'],
      continentCode: 'europe'
    },
    
    // Europe - Luxury
    {
      id: 6, name: 'Paris', country: 'France',
      description: 'Ultimate luxury destination for sophisticated travelers',
      imageUrl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400',
      popularityScore: 99, budgetLevel: 'luxury',
      ageAppeal: ['36-45', '46-55', '56-65', '65+'], genderAppeal: ['female', 'other'],
      continentCode: 'europe'
    },
    
    // North America
    {
      id: 7, name: 'New York City', country: 'United States',
      description: 'The city that never sleeps - perfect for ambitious travelers',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
      popularityScore: 96, budgetLevel: 'luxury',
      ageAppeal: ['26-35', '36-45'], genderAppeal: ['male', 'female', 'other'],
      continentCode: 'north-america'
    },
    {
      id: 8, name: 'Vancouver', country: 'Canada',
      description: 'Nature meets urban sophistication',
      imageUrl: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=400',
      popularityScore: 87, budgetLevel: 'mid-range',
      ageAppeal: ['26-35', '36-45', '46-55'], genderAppeal: ['male', 'female', 'other'],
      continentCode: 'north-america'
    },
    
    // South America
    {
      id: 9, name: 'Buenos Aires', country: 'Argentina',
      description: 'Passionate city perfect for tango lovers and culture enthusiasts',
      imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400',
      popularityScore: 90, budgetLevel: 'economy',
      ageAppeal: ['26-35', '36-45'], genderAppeal: ['male', 'female', 'other'],
      continentCode: 'south-america'
    },
    {
      id: 10, name: 'Rio de Janeiro', country: 'Brazil',
      description: 'Beach paradise with vibrant nightlife and carnival spirit',
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400',
      popularityScore: 94, budgetLevel: 'mid-range',
      ageAppeal: ['18-25', '26-35'], genderAppeal: ['male', 'female', 'other'],
      continentCode: 'south-america'
    }
  ];

  getPersonalizedRecommendations(preferences: TravelPreferences): Destination[] {
    let recommendations: Destination[] = [];
    
    // Step 1: Filter by continent preference
    if (preferences.preferredContinent && preferences.preferredContinent !== '') {
      recommendations = this.allDestinations.filter(dest => 
        dest.continentCode === preferences.preferredContinent
      );
    } else {
      recommendations = [...this.allDestinations];
    }
    
    // Step 2: Apply AI-like logic based on customer profile
    recommendations = this.applyPersonalizationRules(recommendations, preferences);
    
    // Step 3: Sort by relevance score and return top 5
    return recommendations
      .sort((a, b) => this.calculateRelevanceScore(b, preferences) - this.calculateRelevanceScore(a, preferences))
      .slice(0, 5);
  }

  private applyPersonalizationRules(destinations: Destination[], preferences: TravelPreferences): Destination[] {
    return destinations.filter(dest => {
      // Budget compatibility check
      if (!this.isBudgetCompatible(dest, preferences.budgetCategory)) {
        return false;
      }
      
      // Age group appeal check
      if (!this.isAgeAppropriate(dest, preferences.ageRange)) {
        return false;
      }
      
      // Duration compatibility
      if (!this.isDurationCompatible(dest, preferences.travelDuration)) {
        return false;
      }
      
      return true;
    });
  }

  private isBudgetCompatible(destination: Destination, budgetCategory: string): boolean {
    const budgetHierarchy = ['economy', 'mid-range', 'luxury', 'ultra-luxury'];
    const userBudgetLevel = budgetHierarchy.indexOf(budgetCategory);
    const destBudgetLevel = budgetHierarchy.indexOf(destination.budgetLevel);
    
    // Allow destinations up to one level above user's budget
    return destBudgetLevel <= userBudgetLevel + 1;
  }

  private isAgeAppropriate(destination: Destination, ageRange: string): boolean {
    if (!ageRange) return true;
    return destination.ageAppeal.includes(ageRange);
  }

  private isDurationCompatible(destination: Destination, duration: number): boolean {
    // Business logic: Some destinations need minimum time
    const minimumDays: { [key: string]: number } = {
      'Tokyo': 5,
      'Paris': 4,
      'New York City': 4,
      'Bangkok': 3,
      'Barcelona': 3
    };
    
    const requiredDays = minimumDays[destination.name] || 2;
    return duration >= requiredDays;
  }

  private calculateRelevanceScore(destination: Destination, preferences: TravelPreferences): number {
    let score = destination.popularityScore;
    
    // Boost score for exact budget match
    if (destination.budgetLevel === preferences.budgetCategory) {
      score += 10;
    }
    
    // Boost for age group match
    if (preferences.ageRange && destination.ageAppeal.includes(preferences.ageRange)) {
      score += 8;
    }
    
    // Boost for gender appeal (if specified)
    if (preferences.gender && destination.genderAppeal.includes(preferences.gender)) {
      score += 5;
    }
    
    // Apply accommodation preference logic
    if (preferences.accommodationType) {
      if (preferences.accommodationType === 'luxury' && destination.budgetLevel === 'luxury') {
        score += 7;
      } else if (preferences.accommodationType === 'budget' && destination.budgetLevel === 'economy') {
        score += 7;
      }
    }
    
    return score;
  }

  generatePersonalizedDescription(destination: Destination, preferences: TravelPreferences): string {
    let description = destination.description;
    
    // Add personalized touches based on profile
    if (preferences.ageRange === '18-25') {
      description += ' Perfect for young adventurers looking for excitement and new experiences.';
    } else if (preferences.ageRange === '26-35') {
      description += ' Ideal for career-focused travelers seeking cultural enrichment.';
    } else if (preferences.ageRange === '36-45' || preferences.ageRange === '46-55') {
      description += ' Great for experienced travelers who appreciate refined experiences.';
    } else if (preferences.ageRange === '56-65' || preferences.ageRange === '65+') {
      description += ' Perfect for sophisticated travelers seeking comfort and cultural depth.';
    }
    
    // Budget-specific messaging
    if (preferences.budgetCategory === 'economy') {
      description += ' Offers excellent value with many free and affordable attractions.';
    } else if (preferences.budgetCategory === 'luxury') {
      description += ' Features world-class luxury amenities and exclusive experiences.';
    }
    
    return description;
  }
}