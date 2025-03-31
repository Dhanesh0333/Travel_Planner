import { Destination, Activity, DayPlan } from '@shared/schema';

// Type definitions for the mock data
export interface MockDestination extends Destination {}
export interface MockActivity extends Activity {}

// Export data access functions
export const getDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await fetch('/api/destinations');
    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
};

export const getDestination = async (id: number): Promise<Destination | null> => {
  try {
    const response = await fetch(`/api/destinations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch destination');
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching destination ${id}:`, error);
    return null;
  }
};

export const searchDestinations = async (query: string): Promise<Destination[]> => {
  try {
    const response = await fetch(`/api/destinations/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search destinations');
    }
    return response.json();
  } catch (error) {
    console.error('Error searching destinations:', error);
    return [];
  }
};

export const getActivities = async (destinationId?: number): Promise<Activity[]> => {
  try {
    const url = destinationId 
      ? `/api/activities?destinationId=${destinationId}` 
      : '/api/activities';
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

export const getTrips = async (): Promise<Trip[]> => {
  try {
    const response = await fetch('/api/trips');
    if (!response.ok) {
      throw new Error('Failed to fetch trips');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
};

export const createTrip = async (tripData: any): Promise<any> => {
  try {
    const response = await fetch('/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create trip');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

export const updateTrip = async (id: number, tripData: any): Promise<any> => {
  try {
    const response = await fetch(`/api/trips/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update trip');
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error updating trip ${id}:`, error);
    throw error;
  }
};

export const deleteTrip = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/trips/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error deleting trip ${id}:`, error);
    return false;
  }
};
