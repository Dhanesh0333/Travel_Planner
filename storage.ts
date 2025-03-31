import { 
  users, type User, type InsertUser,
  destinations, type Destination, type InsertDestination,
  activities, type Activity, type InsertActivity,
  trips, type Trip, type InsertTrip,
  type DayPlan
} from "@shared/schema";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Destinations
  getAllDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  searchDestinations(query: string): Promise<Destination[]>;
  
  // Activities
  getAllActivities(): Promise<Activity[]>;
  getActivitiesByDestination(destinationId: number): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Trips
  getAllTrips(): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<InsertTrip>): Promise<Trip | undefined>;
  deleteTrip(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private activities: Map<number, Activity>;
  private trips: Map<number, Trip>;
  
  private userIdCounter: number;
  private destinationIdCounter: number;
  private activityIdCounter: number;
  private tripIdCounter: number;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.activities = new Map();
    this.trips = new Map();
    
    this.userIdCounter = 1;
    this.destinationIdCounter = 1;
    this.activityIdCounter = 1;
    this.tripIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample destinations
    const paris = this.createDestination({
      name: "Paris",
      country: "France",
      description: "The City of Light, known for its iconic Eiffel Tower, world-class museums, and romantic ambiance.",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 48, // 4.8
      tags: ["Cultural", "Historic", "Romantic"],
      pricePerPerson: 1200,
      type: "Popular"
    });
    
    const bali = this.createDestination({
      name: "Bali",
      country: "Indonesia",
      description: "A paradise island known for its beautiful beaches, lush rice terraces, and spiritual atmosphere.",
      imageUrl: "https://images.unsplash.com/photo-1560813962-ff3d8fcf59ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 47, // 4.7
      tags: ["Beach", "Adventure", "Relaxation"],
      pricePerPerson: 950,
      type: "Trending"
    });
    
    const santorini = this.createDestination({
      name: "Santorini",
      country: "Greece",
      description: "A stunning volcanic island known for its white-washed buildings, blue domes, and breathtaking sunsets.",
      imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 49, // 4.9
      tags: ["Beach", "Luxury", "Romantic"],
      pricePerPerson: 1450,
      type: "Romantic"
    });
    
    const tokyo = this.createDestination({
      name: "Tokyo",
      country: "Japan",
      description: "A vibrant metropolis blending traditional culture with futuristic innovation and technology.",
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 48, // 4.8
      tags: ["Urban", "Cultural", "Food"],
      pricePerPerson: 1500,
      type: "Popular"
    });
    
    const barcelona = this.createDestination({
      name: "Barcelona",
      country: "Spain",
      description: "A vibrant city known for its unique architecture, beautiful beaches, and vibrant culture.",
      imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 46, // 4.6
      tags: ["City", "Beach", "Cultural"],
      pricePerPerson: 1000,
      type: "Popular"
    });
    
    const maldives = this.createDestination({
      name: "Maldives",
      country: "Maldives",
      description: "A tropical paradise with pristine white sand beaches, crystal clear waters, and luxurious overwater bungalows.",
      imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 50, // 5.0
      tags: ["Beach", "Luxury", "Honeymoon"],
      pricePerPerson: 2500,
      type: "Romantic"
    });
    
    // Sample activities for Paris
    this.createActivity({
      destinationId: paris.id,
      name: "Eiffel Tower Visit",
      description: "Visit the iconic Eiffel Tower and enjoy panoramic views of Paris from the observation decks.",
      duration: "2-3 hours",
      category: "Sightseeing",
      imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      icon: "building-2-line",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500"
    });
    
    this.createActivity({
      destinationId: paris.id,
      name: "Local Food Tour",
      description: "Explore the culinary delights of Paris with a guided food tour through local neighborhoods.",
      duration: "3-4 hours",
      category: "Food & Dining",
      imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      icon: "restaurant-line",
      iconBg: "bg-green-100",
      iconColor: "text-green-500"
    });
    
    this.createActivity({
      destinationId: paris.id,
      name: "Louvre Museum",
      description: "Explore one of the world's largest and most famous art museums, home to the Mona Lisa.",
      duration: "3-5 hours",
      category: "Culture",
      imageUrl: "https://images.unsplash.com/photo-1565636688174-5a58e0f51d28?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      icon: "gallery-line",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500"
    });
    
    this.createActivity({
      destinationId: paris.id,
      name: "Champs-Élysées Shopping",
      description: "Shop along one of the world's most famous avenues, lined with luxury boutiques and shops.",
      duration: "2-4 hours",
      category: "Shopping",
      imageUrl: "https://images.unsplash.com/photo-1520048480352-1e6c7dc9a316?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      icon: "shopping-bag-line",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-500"
    });
    
    this.createActivity({
      destinationId: paris.id,
      name: "Seine River Cruise",
      description: "Enjoy a relaxing cruise along the Seine River and see Paris from a different perspective.",
      duration: "1-2 hours",
      category: "Sightseeing",
      imageUrl: "https://images.unsplash.com/photo-1581460436468-39d53783ce41?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      icon: "ship-line",
      iconBg: "bg-red-100",
      iconColor: "text-red-500"
    });
    
    // Add some activities for Bali
    this.createActivity({
      destinationId: bali.id,
      name: "Ubud Monkey Forest",
      description: "Explore the natural sanctuary of hundreds of Balinese long-tailed macaques.",
      duration: "2-3 hours",
      category: "Nature",
      imageUrl: "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      icon: "plant-line",
      iconBg: "bg-green-100",
      iconColor: "text-green-500"
    });
    
    this.createActivity({
      destinationId: bali.id,
      name: "Tegalalang Rice Terraces",
      description: "Visit the stunning rice terraces and learn about the traditional Balinese irrigation system.",
      duration: "2-3 hours",
      category: "Sightseeing",
      imageUrl: "https://images.unsplash.com/photo-1531973486229-75742a88c381?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      icon: "landscape-line",
      iconBg: "bg-green-100",
      iconColor: "text-green-500"
    });
    
    // Sample trip
    this.createTrip({
      userId: 1,
      name: "Paris Explorer",
      startDate: "2023-06-15",
      endDate: "2023-06-22",
      destination: "Paris, France",
      travelers: 2,
      itinerary: [
        {
          day: 1,
          date: "2023-06-15",
          activities: [
            {
              activityId: 3,
              name: "Louvre Museum",
              startTime: "15:00",
              endTime: "18:00",
              duration: "3h"
            }
          ]
        },
        {
          day: 2,
          date: "2023-06-16",
          activities: [
            {
              activityId: 1,
              name: "Eiffel Tower Visit",
              startTime: "10:00",
              endTime: "13:00",
              duration: "3h"
            },
            {
              activityId: 2,
              name: "Local Food Tour",
              startTime: "14:00",
              endTime: "17:00",
              duration: "3h"
            }
          ]
        }
      ]
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Destination methods
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }
  
  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }
  
  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = this.destinationIdCounter++;
    const newDestination: Destination = { ...destination, id };
    this.destinations.set(id, newDestination);
    return newDestination;
  }
  
  async searchDestinations(query: string): Promise<Destination[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.destinations.values()).filter(
      destination => 
        destination.name.toLowerCase().includes(lowerQuery) ||
        destination.country.toLowerCase().includes(lowerQuery) ||
        (destination.tags && destination.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }
  
  // Activity methods
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }
  
  async getActivitiesByDestination(destinationId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      activity => activity.destinationId === destinationId
    );
  }
  
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }
  
  // Trip methods
  async getAllTrips(): Promise<Trip[]> {
    return Array.from(this.trips.values());
  }
  
  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }
  
  async createTrip(trip: InsertTrip): Promise<Trip> {
    const id = this.tripIdCounter++;
    const createdAt = new Date();
    const newTrip: Trip = { ...trip, id, createdAt };
    this.trips.set(id, newTrip);
    return newTrip;
  }
  
  async updateTrip(id: number, updatedFields: Partial<InsertTrip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip: Trip = { ...trip, ...updatedFields };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }
  
  async deleteTrip(id: number): Promise<boolean> {
    return this.trips.delete(id);
  }
}

export const storage = new MemStorage();
