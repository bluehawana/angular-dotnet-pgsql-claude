-- AI Travel Planner Database Schema

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Continents lookup table
CREATE TABLE continents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL
);

-- Destinations table
CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    continent_id INTEGER REFERENCES continents(id),
    description TEXT,
    popularity_score INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget categories lookup table
CREATE TABLE budget_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    min_daily_budget DECIMAL(10,2),
    max_daily_budget DECIMAL(10,2)
);

-- Travel preferences table
CREATE TABLE travel_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    gender VARCHAR(20),
    age_range VARCHAR(20),
    budget_category_id INTEGER REFERENCES budget_categories(id),
    preferred_continent_id INTEGER REFERENCES continents(id),
    travel_duration_days INTEGER,
    accommodation_type VARCHAR(50),
    transportation_preference VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Travel plans table
CREATE TABLE travel_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    travel_preference_id INTEGER REFERENCES travel_preferences(id),
    destination_id INTEGER REFERENCES destinations(id),
    title VARCHAR(255) NOT NULL,
    total_budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'draft',
    ai_generated_plan JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Travel plan activities table
CREATE TABLE travel_plan_activities (
    id SERIAL PRIMARY KEY,
    travel_plan_id INTEGER REFERENCES travel_plans(id) ON DELETE CASCADE,
    day_number INTEGER,
    activity_name VARCHAR(255),
    activity_type VARCHAR(50),
    description TEXT,
    estimated_cost DECIMAL(10,2),
    location VARCHAR(255),
    start_time TIME,
    duration_minutes INTEGER
);

-- Travel plan accommodations table
CREATE TABLE travel_plan_accommodations (
    id SERIAL PRIMARY KEY,
    travel_plan_id INTEGER REFERENCES travel_plans(id) ON DELETE CASCADE,
    name VARCHAR(255),
    type VARCHAR(50),
    address TEXT,
    check_in_date DATE,
    check_out_date DATE,
    cost_per_night DECIMAL(10,2),
    booking_platform VARCHAR(100),
    booking_url VARCHAR(500)
);

-- Travel plan transportation table
CREATE TABLE travel_plan_transportation (
    id SERIAL PRIMARY KEY,
    travel_plan_id INTEGER REFERENCES travel_plans(id) ON DELETE CASCADE,
    type VARCHAR(50),
    from_location VARCHAR(255),
    to_location VARCHAR(255),
    departure_date DATE,
    departure_time TIME,
    arrival_date DATE,
    arrival_time TIME,
    cost DECIMAL(10,2),
    booking_platform VARCHAR(100),
    booking_reference VARCHAR(100)
);

-- Insert initial data for continents
INSERT INTO continents (name, code) VALUES
('Asia', 'AS'),
('Europe', 'EU'),
('North America', 'NA'),
('South America', 'SA'),
('Africa', 'AF'),
('Australia/Oceania', 'OC'),
('Antarctica', 'AN');

-- Insert budget categories
INSERT INTO budget_categories (name, min_daily_budget, max_daily_budget) VALUES
('Economy', 30.00, 80.00),
('Mid-range', 80.00, 200.00),
('Luxury', 200.00, 500.00),
('Ultra Luxury', 500.00, NULL);

-- Insert popular destinations
INSERT INTO destinations (name, country, continent_id, description, popularity_score, image_url) VALUES
-- Asia
('Tokyo', 'Japan', 1, 'Modern metropolis with rich culture and cuisine', 95, 'https://example.com/tokyo.jpg'),
('Bangkok', 'Thailand', 1, 'Vibrant city with temples, street food, and nightlife', 90, 'https://example.com/bangkok.jpg'),
('Singapore', 'Singapore', 1, 'Garden city with diverse culture and food scene', 88, 'https://example.com/singapore.jpg'),
('Seoul', 'South Korea', 1, 'K-pop capital with modern amenities and history', 85, 'https://example.com/seoul.jpg'),
('Bali', 'Indonesia', 1, 'Tropical paradise with beaches and temples', 92, 'https://example.com/bali.jpg'),

-- Europe
('Paris', 'France', 2, 'City of lights with art, culture, and romance', 98, 'https://example.com/paris.jpg'),
('Rome', 'Italy', 2, 'Ancient city with history, art, and cuisine', 96, 'https://example.com/rome.jpg'),
('Barcelona', 'Spain', 2, 'Artistic city with Gaudi architecture and beaches', 90, 'https://example.com/barcelona.jpg'),
('Amsterdam', 'Netherlands', 2, 'Canal city with museums and bike culture', 87, 'https://example.com/amsterdam.jpg'),
('London', 'United Kingdom', 2, 'Historic city with royal heritage and diversity', 94, 'https://example.com/london.jpg'),

-- North America
('New York City', 'United States', 3, 'The city that never sleeps with iconic landmarks', 97, 'https://example.com/nyc.jpg'),
('Vancouver', 'Canada', 3, 'Mountain and ocean city with outdoor activities', 89, 'https://example.com/vancouver.jpg'),
('Mexico City', 'Mexico', 3, 'Cultural capital with rich history and cuisine', 85, 'https://example.com/mexico-city.jpg'),
('San Francisco', 'United States', 3, 'Tech hub with Golden Gate Bridge and hills', 91, 'https://example.com/san-francisco.jpg'),
('Toronto', 'Canada', 3, 'Diverse city with CN Tower and cultural districts', 86, 'https://example.com/toronto.jpg'),

-- South America
('Rio de Janeiro', 'Brazil', 4, 'Beach city with Christ the Redeemer and carnival', 93, 'https://example.com/rio.jpg'),
('Buenos Aires', 'Argentina', 4, 'Tango capital with European architecture', 88, 'https://example.com/buenos-aires.jpg'),
('Machu Picchu', 'Peru', 4, 'Ancient Incan ruins in the Andes mountains', 95, 'https://example.com/machu-picchu.jpg'),
('Santiago', 'Chile', 4, 'Modern city surrounded by mountains and vineyards', 82, 'https://example.com/santiago.jpg'),
('Cartagena', 'Colombia', 4, 'Colonial coastal city with colorful architecture', 87, 'https://example.com/cartagena.jpg');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_destinations_continent ON destinations(continent_id);
CREATE INDEX idx_destinations_popularity ON destinations(popularity_score DESC);
CREATE INDEX idx_travel_plans_user ON travel_plans(user_id);
CREATE INDEX idx_travel_plans_status ON travel_plans(status);
CREATE INDEX idx_travel_preferences_user ON travel_preferences(user_id);