import { Injectable } from '@angular/core';
import { AdvancedTravelPreferences } from '../components/advanced-questionnaire/advanced-questionnaire.component';

export interface BudgetOptimizedPlan {
  totalBudget: number;
  dailyBudget: number;
  savings: BudgetSaving[];
  accommodation: AccommodationRecommendation;
  transportation: TransportationRecommendation;
  activities: ActivityRecommendation[];
  dailyItinerary: DailyItinerary[];
  costBreakdown: CostBreakdown;
  preparationChecklist: ChecklistItem[];
  travelTips: string[];
}

export interface BudgetSaving {
  category: string;
  tip: string;
  savings: number;
  icon: string;
}

export interface AccommodationRecommendation {
  type: string;
  suggestions: string[];
  avgCostPerNight: number;
  savingTips: string[];
  platforms: string[];
}

export interface TransportationRecommendation {
  primary: string;
  local: string[];
  costSavingTips: string[];
  avgCost: number;
}

export interface ActivityRecommendation {
  name: string;
  type: 'free' | 'low-cost' | 'mid-range' | 'premium';
  cost: number;
  description: string;
  savingTips: string[];
}

export interface DailyItinerary {
  day: number;
  date: string;
  totalCost: number;
  activities: {
    time: string;
    activity: string;
    location: string;
    cost: number;
    type: 'transport' | 'accommodation' | 'food' | 'activity' | 'shopping';
    budgetTip?: string;
  }[];
}

export interface CostBreakdown {
  accommodation: number;
  transportation: number;
  food: number;
  activities: number;
  shopping: number;
  miscellaneous: number;
  total: number;
}

export interface ChecklistItem {
  category: 'documents' | 'health' | 'money' | 'packing' | 'technology';
  item: string;
  required: boolean;
  daysBeforeTrip: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetOptimizerService {
  
  generateOptimizedPlan(preferences: AdvancedTravelPreferences): BudgetOptimizedPlan {
    const budgetMultipliers = this.getBudgetMultipliers(preferences.budget);
    const baseDailyBudget = budgetMultipliers.base;
    const totalBudget = baseDailyBudget * preferences.duration;
    
    const accommodation = this.getAccommodationRecommendation(preferences);
    const transportation = this.getTransportationRecommendation(preferences);
    const activities = this.getActivityRecommendations(preferences);
    const savings = this.getBudgetSavings(preferences);
    const dailyItinerary = this.generateDailyItinerary(preferences, baseDailyBudget);
    const costBreakdown = this.calculateCostBreakdown(dailyItinerary);
    const preparationChecklist = this.generatePreparationChecklist(preferences);
    const travelTips = this.getPersonalizedTravelTips(preferences);

    return {
      totalBudget,
      dailyBudget: baseDailyBudget,
      savings,
      accommodation,
      transportation,
      activities,
      dailyItinerary,
      costBreakdown,
      preparationChecklist,
      travelTips
    };
  }

  private getBudgetMultipliers(budget: string) {
    const multipliers = {
      student: { base: 25, accommodation: 0.4, food: 0.3, activities: 0.2, transport: 0.1 },
      economic: { base: 50, accommodation: 0.4, food: 0.3, activities: 0.2, transport: 0.1 },
      comfortable: { base: 100, accommodation: 0.35, food: 0.25, activities: 0.25, transport: 0.15 },
      business: { base: 200, accommodation: 0.4, food: 0.25, activities: 0.2, transport: 0.15 },
      luxury: { base: 400, accommodation: 0.45, food: 0.25, activities: 0.2, transport: 0.1 }
    };
    return multipliers[budget as keyof typeof multipliers];
  }

  private getAccommodationRecommendation(preferences: AdvancedTravelPreferences): AccommodationRecommendation {
    const destination = preferences.selectedDestination.toLowerCase();
    const budget = preferences.budget;
    
    const accommodationMap: { [key: string]: AccommodationRecommendation } = {
      student: {
        type: 'Hostels & Budget Options',
        suggestions: [
          'Youth hostels with shared dorms',
          'Airbnb shared rooms',
          'Capsule hotels (in Japan)',
          'Local guesthouses',
          'University dormitories (summer)'
        ],
        avgCostPerNight: budget === 'student' ? 15 : 25,
        savingTips: [
          'Book hostels 1-2 months in advance for better rates',
          'Look for hostels with free breakfast',
          'Consider longer stays for weekly discounts',
          'Use apps like Hostelworld for flash deals',
          'Join hostel membership programs'
        ],
        platforms: ['Hostelworld', 'Booking.com', 'Airbnb', 'Local apps']
      },
      economic: {
        type: 'Budget Hotels & Guesthouses',
        suggestions: [
          'Budget chain hotels',
          'Private Airbnb rooms',
          'Local guesthouses',
          'Business hotels (weekends)',
          '2-3 star hotels'
        ],
        avgCostPerNight: 35,
        savingTips: [
          'Book directly with hotels for loyalty points',
          'Check for package deals with breakfast',
          'Use price comparison sites',
          'Book refundable rates and monitor prices',
          'Stay slightly outside city center'
        ],
        platforms: ['Booking.com', 'Hotels.com', 'Agoda', 'Local platforms']
      },
      comfortable: {
        type: '3-4 Star Hotels',
        suggestions: [
          'Mid-range chain hotels',
          'Boutique hotels',
          'Entire Airbnb apartments',
          'Business hotels',
          'Resort hotels (off-season)'
        ],
        avgCostPerNight: 80,
        savingTips: [
          'Join hotel loyalty programs',
          'Book during shoulder season',
          'Look for hotels with included amenities',
          'Consider apartment hotels for longer stays',
          'Check for corporate rates'
        ],
        platforms: ['Official hotel sites', 'Booking.com', 'Expedia', 'Airbnb']
      },
      business: {
        type: '4-5 Star Hotels',
        suggestions: [
          'Business hotels',
          'Luxury chain hotels',
          'Premium Airbnb properties',
          'Resort hotels',
          'Serviced apartments'
        ],
        avgCostPerNight: 150,
        savingTips: [
          'Use corporate booking rates',
          'Book through travel agents for packages',
          'Consider hotel credit cards for status',
          'Look for suite upgrades at check-in',
          'Book packages with meals included'
        ],
        platforms: ['Hotel direct', 'Corporate travel', 'Luxury travel sites']
      },
      luxury: {
        type: '5-Star Luxury Hotels',
        suggestions: [
          'Luxury international chains',
          'Boutique luxury hotels',
          'Resort properties',
          'Private villas',
          'Palace hotels'
        ],
        avgCostPerNight: 300,
        savingTips: [
          'Book through luxury travel advisors',
          'Look for package deals with experiences',
          'Consider shoulder season luxury',
          'Use luxury hotel credit cards',
          'Book suites for special occasions'
        ],
        platforms: ['Luxury hotel direct', 'Virtuoso', 'Four Seasons', 'Ritz Carlton']
      }
    };

    return accommodationMap[budget] || accommodationMap['economic'];
  }

  private getTransportationRecommendation(preferences: AdvancedTravelPreferences): TransportationRecommendation {
    const destination = preferences.selectedDestination;
    const budget = preferences.budget;
    
    const transportMap: { [key: string]: any } = {
      'Japan': {
        student: {
          primary: 'Budget airlines with night flights',
          local: ['JR Pass (7-day)', 'Local trains', 'Buses', 'Walking', 'Bicycle rental'],
          costSavingTips: [
            'Book flights 2-3 months ahead for best deals',
            'Choose red-eye flights (cheaper)',
            'Get JR Pass before arrival (better rates)',
            'Use IC cards for local transport',
            'Walk/cycle for short distances',
            'Stay near train stations'
          ],
          avgCost: 800
        },
        comfortable: {
          primary: 'Regular airlines with good timing',
          local: ['JR Pass', 'Express trains', 'Taxis for convenience', 'Local trains'],
          costSavingTips: [
            'Book flights 1-2 months ahead',
            'Consider premium economy',
            'Get unlimited JR Pass',
            'Use taxi apps for better rates'
          ],
          avgCost: 1200
        }
      },
      'China Mainland': {
        student: {
          primary: 'Budget airlines or overland',
          local: ['High-speed rail', 'Metro systems', 'Buses', 'Shared bikes'],
          costSavingTips: [
            'Use Chinese budget airlines',
            'Book high-speed rail online',
            'Download local transport apps',
            'Use shared mobility services'
          ],
          avgCost: 600
        }
      }
    };

    // Default recommendations
    const budgetDefaults = {
      student: {
        primary: 'Budget airlines with flexible dates',
        local: ['Public transport', 'Walking', 'Buses', 'Shared rides'],
        costSavingTips: [
          'Use budget airline comparison sites',
          'Book red-eye flights',
          'Use public transport passes',
          'Walk when possible',
          'Use ride-sharing apps'
        ],
        avgCost: 500
      },
      economic: {
        primary: 'Economy airlines',
        local: ['Public transport', 'Trains', 'Occasional taxis'],
        costSavingTips: [
          'Book flights 6-8 weeks ahead',
          'Use train passes',
          'Mix walking with public transport'
        ],
        avgCost: 700
      },
      comfortable: {
        primary: 'Regular airlines',
        local: ['Trains', 'Taxis', 'Rental cars'],
        costSavingTips: [
          'Book flights early',
          'Consider rail passes',
          'Use ride apps for transparency'
        ],
        avgCost: 1000
      }
    };

    const destRec = transportMap[destination];
    if (destRec && destRec[budget]) {
      return destRec[budget];
    }
    
    return budgetDefaults[budget as keyof typeof budgetDefaults] || budgetDefaults.economic;
  }

  private getActivityRecommendations(preferences: AdvancedTravelPreferences): ActivityRecommendation[] {
    const destination = preferences.selectedDestination;
    const budget = preferences.budget;
    
    // Japan-specific activities
    if (destination === 'Japan') {
      const activities: ActivityRecommendation[] = [
        {
          name: 'Visit Free Temples and Shrines',
          type: 'free',
          cost: 0,
          description: 'Explore thousands of beautiful temples and shrines across Japan',
          savingTips: ['Many temples are free to enter', 'Visit during festival seasons', 'Join free walking tours']
        },
        {
          name: 'Enjoy Cherry Blossom Parks',
          type: 'free',
          cost: 0,
          description: 'Hanami (flower viewing) in public parks during spring',
          savingTips: ['Bring your own picnic', 'Visit local neighborhood parks', 'Join locals for hanami parties']
        },
        {
          name: 'Street Food Adventures',
          type: 'low-cost',
          cost: 15,
          description: 'Try authentic Japanese street food and convenience store meals',
          savingTips: ['Eat at convenience stores', 'Try standing sushi bars', 'Visit local markets', 'Lunch sets are cheaper']
        },
        {
          name: 'Traditional Onsen Experience',
          type: budget === 'student' ? 'mid-range' : 'low-cost',
          cost: budget === 'student' ? 25 : 15,
          description: 'Relax in natural hot springs',
          savingTips: ['Visit public baths instead of resort onsen', 'Go during off-peak hours', 'Look for day-use rates']
        },
        {
          name: 'Tokyo DisneySea/Disneyland',
          type: 'mid-range',
          cost: 75,
          description: 'World-famous theme parks',
          savingTips: ['Buy tickets in advance online', 'Bring your own food', 'Visit during weekdays', 'Use Disney app for wait times']
        }
      ];

      // Filter based on budget
      if (budget === 'student') {
        return activities.filter(a => a.type === 'free' || a.type === 'low-cost').slice(0, 8);
      } else if (budget === 'economic') {
        return activities.filter(a => a.type !== 'premium').slice(0, 10);
      }
      
      return activities;
    }

    // Generic activities for other destinations
    return [
      {
        name: 'Free Walking Tours',
        type: 'free',
        cost: 0,
        description: 'Explore the city with knowledgeable local guides',
        savingTips: ['Tip based on experience', 'Book popular tours early', 'Join multiple themed tours']
      },
      {
        name: 'Local Markets and Street Food',
        type: 'low-cost',
        cost: 10,
        description: 'Experience authentic local cuisine at budget prices',
        savingTips: ['Eat where locals eat', 'Try lunch specials', 'Share dishes with others']
      },
      {
        name: 'Museums and Cultural Sites',
        type: 'low-cost',
        cost: 15,
        description: 'Learn about local history and culture',
        savingTips: ['Look for student discounts', 'Visit on free days', 'Get city museum passes']
      }
    ];
  }

  private getBudgetSavings(preferences: AdvancedTravelPreferences): BudgetSaving[] {
    const budget = preferences.budget;
    const duration = preferences.duration;
    
    const savings: BudgetSaving[] = [
      {
        category: 'Accommodation',
        tip: 'Book hostels/guesthouses instead of hotels',
        savings: Math.round((duration * 50) * 0.6), // 60% savings on accommodation
        icon: '🏨'
      },
      {
        category: 'Transportation',
        tip: 'Use public transport and walk when possible',
        savings: Math.round(duration * 15),
        icon: '🚇'
      },
      {
        category: 'Food',
        tip: 'Eat at local markets and cook when possible',
        savings: Math.round(duration * 25),
        icon: '🍜'
      },
      {
        category: 'Activities',
        tip: 'Focus on free attractions and nature',
        savings: Math.round(duration * 20),
        icon: '🎯'
      },
      {
        category: 'Flight',
        tip: 'Book night flights and use budget airlines',
        savings: 200,
        icon: '✈️'
      }
    ];

    // Adjust savings based on budget level
    const multiplier = budget === 'student' ? 1.2 : budget === 'economic' ? 1.0 : 0.8;
    return savings.map(s => ({ ...s, savings: Math.round(s.savings * multiplier) }));
  }

  private generateDailyItinerary(preferences: AdvancedTravelPreferences, dailyBudget: number): DailyItinerary[] {
    const itinerary: DailyItinerary[] = [];
    const startDate = new Date();
    
    for (let day = 1; day <= Math.min(preferences.duration, 7); day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day - 1);
      
      const dayPlan: DailyItinerary = {
        day,
        date: currentDate.toLocaleDateString(),
        totalCost: 0,
        activities: []
      };

      if (day === 1) {
        // Arrival day
        dayPlan.activities = [
          {
            time: '06:00',
            activity: 'Flight Arrival (Night Flight)',
            location: 'Airport',
            cost: 0,
            type: 'transport',
            budgetTip: 'Night flights are 20-40% cheaper'
          },
          {
            time: '08:00',
            activity: 'Airport to City Center',
            location: 'Public Transport',
            cost: preferences.budget === 'student' ? 5 : 10,
            type: 'transport',
            budgetTip: 'Use airport express trains instead of taxis'
          },
          {
            time: '10:00',
            activity: 'Check-in to Accommodation',
            location: 'Hostel/Hotel',
            cost: 0,
            type: 'accommodation'
          },
          {
            time: '12:00',
            activity: 'Local Street Food Lunch',
            location: 'Street Market',
            cost: preferences.budget === 'student' ? 8 : 15,
            type: 'food',
            budgetTip: 'Eat at local markets for authentic and cheap meals'
          },
          {
            time: '14:00',
            activity: 'Free Walking Tour',
            location: 'City Center',
            cost: 5, // tip
            type: 'activity',
            budgetTip: 'Free tours only require tips - great value!'
          },
          {
            time: '18:00',
            activity: 'Grocery Shopping & Cooking',
            location: 'Local Supermarket',
            cost: preferences.budget === 'student' ? 10 : 15,
            type: 'food',
            budgetTip: 'Cook your own meals to save 60% on food costs'
          }
        ];
      } else if (day === 2) {
        // Full exploration day
        dayPlan.activities = [
          {
            time: '08:00',
            activity: 'Breakfast at Accommodation',
            location: 'Hostel Kitchen',
            cost: 3,
            type: 'food',
            budgetTip: 'Free breakfast hostels save $10-15 per day'
          },
          {
            time: '09:00',
            activity: 'Major Tourist Attraction',
            location: 'City Center',
            cost: preferences.budget === 'student' ? 15 : 25,
            type: 'activity',
            budgetTip: 'Look for student discounts and combo tickets'
          },
          {
            time: '12:00',
            activity: 'Lunch at Local Restaurant',
            location: 'Local District',
            cost: preferences.budget === 'student' ? 10 : 18,
            type: 'food',
            budgetTip: 'Lunch sets are much cheaper than dinner'
          },
          {
            time: '14:00',
            activity: 'Free Museum/Cultural Site',
            location: 'Cultural District',
            cost: 0,
            type: 'activity',
            budgetTip: 'Many museums have free days or hours'
          },
          {
            time: '16:00',
            activity: 'Local Park/Nature Walk',
            location: 'City Park',
            cost: 0,
            type: 'activity',
            budgetTip: 'Parks and nature areas are free and relaxing'
          },
          {
            time: '19:00',
            activity: 'Street Food Dinner',
            location: 'Night Market',
            cost: preferences.budget === 'student' ? 12 : 20,
            type: 'food',
            budgetTip: 'Night markets offer variety and great prices'
          }
        ];
      } else {
        // Regular days - mix of paid and free activities
        dayPlan.activities = [
          {
            time: '08:00',
            activity: 'Breakfast',
            location: 'Accommodation',
            cost: 5,
            type: 'food'
          },
          {
            time: '10:00',
            activity: day % 2 === 0 ? 'Paid Attraction' : 'Free Activity',
            location: 'Various',
            cost: day % 2 === 0 ? (preferences.budget === 'student' ? 12 : 20) : 0,
            type: 'activity',
            budgetTip: day % 2 === 0 ? 'Mix paid and free activities' : 'Free activities can be just as rewarding'
          },
          {
            time: '13:00',
            activity: 'Lunch',
            location: 'Local Area',
            cost: preferences.budget === 'student' ? 8 : 15,
            type: 'food'
          },
          {
            time: '15:00',
            activity: 'Exploration/Shopping',
            location: 'Shopping District',
            cost: preferences.budget === 'student' ? 10 : 25,
            type: 'shopping',
            budgetTip: 'Set a daily shopping budget to avoid overspending'
          },
          {
            time: '19:00',
            activity: 'Dinner',
            location: 'Local Restaurant',
            cost: preferences.budget === 'student' ? 15 : 25,
            type: 'food'
          }
        ];
      }

      dayPlan.totalCost = dayPlan.activities.reduce((sum, activity) => sum + activity.cost, 0);
      itinerary.push(dayPlan);
    }

    return itinerary;
  }

  private calculateCostBreakdown(itinerary: DailyItinerary[]): CostBreakdown {
    const breakdown: CostBreakdown = {
      accommodation: 0,
      transportation: 0,
      food: 0,
      activities: 0,
      shopping: 0,
      miscellaneous: 0,
      total: 0
    };

    itinerary.forEach(day => {
      day.activities.forEach(activity => {
        switch (activity.type) {
          case 'accommodation':
            breakdown.accommodation += activity.cost;
            break;
          case 'transport':
            breakdown.transportation += activity.cost;
            break;
          case 'food':
            breakdown.food += activity.cost;
            break;
          case 'activity':
            breakdown.activities += activity.cost;
            break;
          case 'shopping':
            breakdown.shopping += activity.cost;
            break;
        }
      });
    });

    breakdown.miscellaneous = Math.round((breakdown.food + breakdown.activities) * 0.1); // 10% buffer
    breakdown.total = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0) - breakdown.total;

    return breakdown;
  }

  private generatePreparationChecklist(preferences: AdvancedTravelPreferences): ChecklistItem[] {
    const destination = preferences.selectedDestination;
    const duration = preferences.duration;
    
    const baseChecklist: ChecklistItem[] = [
      // Documents (60+ days before)
      { category: 'documents', item: 'Check passport expiry (6+ months validity)', required: true, daysBeforeTrip: 90 },
      { category: 'documents', item: 'Apply for visa if required', required: true, daysBeforeTrip: 60, notes: 'Check embassy website for requirements' },
      { category: 'documents', item: 'Make copies of important documents', required: true, daysBeforeTrip: 7 },
      
      // Health (30+ days before)
      { category: 'health', item: 'Check required vaccinations', required: true, daysBeforeTrip: 45 },
      { category: 'health', item: 'Get travel insurance', required: true, daysBeforeTrip: 14, notes: 'Compare policies for best coverage' },
      { category: 'health', item: 'Pack basic medications', required: true, daysBeforeTrip: 3 },
      
      // Money (14+ days before)
      { category: 'money', item: 'Notify bank of travel plans', required: true, daysBeforeTrip: 7 },
      { category: 'money', item: 'Get travel-friendly credit/debit cards', required: true, daysBeforeTrip: 21 },
      { category: 'money', item: 'Exchange some local currency', required: false, daysBeforeTrip: 7 },
      
      // Technology
      { category: 'technology', item: 'Download offline maps and translation apps', required: true, daysBeforeTrip: 3 },
      { category: 'technology', item: 'Get universal power adapter', required: true, daysBeforeTrip: 7 },
      { category: 'technology', item: 'Backup photos and important files', required: true, daysBeforeTrip: 1 },
      
      // Packing
      { category: 'packing', item: 'Check weather forecast and pack accordingly', required: true, daysBeforeTrip: 3 },
      { category: 'packing', item: 'Pack light - one week of clothes max', required: false, daysBeforeTrip: 2, notes: 'You can do laundry during the trip' }
    ];

    // Add destination-specific items
    if (destination === 'Japan') {
      baseChecklist.push(
        { category: 'documents', item: 'Download JR Pass mobile app', required: false, daysBeforeTrip: 7 },
        { category: 'technology', item: 'Get pocket WiFi or SIM card', required: true, daysBeforeTrip: 14 },
        { category: 'money', item: 'Get cash - Japan is cash-heavy', required: true, daysBeforeTrip: 7 },
        { category: 'packing', item: 'Pack modest clothing for temples', required: true, daysBeforeTrip: 3 }
      );
    }

    if (preferences.budget === 'student') {
      baseChecklist.push(
        { category: 'documents', item: 'Get international student ID card', required: false, daysBeforeTrip: 30, notes: 'For student discounts' },
        { category: 'money', item: 'Download budget tracking app', required: true, daysBeforeTrip: 7 },
        { category: 'packing', item: 'Pack reusable water bottle and utensils', required: false, daysBeforeTrip: 3, notes: 'Save money on drinks and takeout' }
      );
    }

    return baseChecklist.sort((a, b) => b.daysBeforeTrip - a.daysBeforeTrip);
  }

  private getPersonalizedTravelTips(preferences: AdvancedTravelPreferences): string[] {
    const tips: string[] = [];
    
    // Budget-specific tips
    if (preferences.budget === 'student') {
      tips.push(
        '💡 Use student discounts everywhere - museums, transport, restaurants often offer 10-20% off',
        '🍜 Cook your own breakfast and pack lunch to save $20-30 per day',
        '🚶‍♀️ Walk instead of taking transport when possible - it\'s free and you see more',
        '📱 Download apps like HappyCow (food), Citymapper (transport) for budget options',
        '🏨 Stay in hostels with kitchens and free breakfast to cut costs in half'
      );
    }
    
    // Destination-specific tips
    if (preferences.selectedDestination === 'Japan') {
      tips.push(
        '🎫 Buy JR Pass before arrival - it\'s significantly cheaper than buying in Japan',
        '🏪 Convenience stores (konbini) have quality cheap meals 24/7',
        '♨️ Try public baths (sento) for $3-5 instead of expensive hotel onsen',
        '🎌 Many temples and shrines are free - perfect for budget sightseeing',
        '🎁 100-yen shops (like Daiso) are great for souvenirs and travel essentials'
      );
    }

    // Duration-specific tips
    if (preferences.duration > 14) {
      tips.push(
        '🧳 Pack light and do laundry weekly - saves luggage fees and makes travel easier',
        '🏠 Consider longer-term accommodation rentals for better weekly rates',
        '📊 Track your spending daily to stay within budget for the full trip'
      );
    }

    // Gender-specific tips (safety and cultural)
    if (preferences.gender === 'female') {
      tips.push(
        '🔒 Research women-only accommodations and transport options for added comfort',
        '📱 Share your location with family/friends and check in regularly'
      );
    }

    // General smart travel tips
    tips.push(
      '💳 Use credit cards with no foreign transaction fees to save 3% on all purchases',
      '📈 Download XE Currency app to avoid getting overcharged',
      '🎯 Focus on experiences over shopping - memories last longer than souvenirs',
      '📱 Use Google Translate camera feature for menus and signs in foreign languages'
    );

    return tips;
  }
}