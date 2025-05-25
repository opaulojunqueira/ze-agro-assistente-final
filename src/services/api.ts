import { auth } from '../lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-ze-agro-app.paulojunqueira.com';

interface UserProfile {
  _id?: string;
  firebaseUid?: string;
  email?: string;
  name?: string;
  dateOfBirth?: string;
  phone?: string;
  properties?: Property[];
  preferredWeatherPropertyId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateProfileData {
  name?: string;
  dateOfBirth?: string;
  phone?: string;
}

interface Property {
  _id: string;
  propertyName: string;
  sizeHa: number;
  propertyType?: string;
  imageUrl?: string;
  geolocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
}

interface CreatePropertyData {
  propertyName: string;
  sizeHa: number;
  propertyType?: string;
  imageUrl?: string;
  geolocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface UpdatePropertyData {
  propertyName?: string;
  sizeHa?: number;
  propertyType?: string;
  imageUrl?: string;
  geolocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface ChatMessage {
  _id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  userId: string;
  title: string;
  lastMessagePreview: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  messages?: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface WeatherForecast {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        chance_of_rain: number;
      };
    }>;
  };
}

class ApiService {
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    return response.json();
  }

  // User Profile Routes
  async createOrUpdateProfile(data?: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>('/api/users/profile', {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async getUserProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/api/users/profile');
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    return this.request<UserProfile>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async setWeatherPreference(propertyId: string | null): Promise<{ message: string; preferredWeatherPropertyId: string | null }> {
    return this.request('/api/users/profile/weather-preference', {
      method: 'PUT',
      body: JSON.stringify({ propertyId }),
    });
  }

  // Properties Routes
  async addProperty(data: CreatePropertyData): Promise<Property> {
    return this.request<Property>('/api/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProperties(): Promise<Property[]> {
    return this.request<Property[]>('/api/properties');
  }

  async updateProperty(propertyId: string, data: UpdatePropertyData): Promise<Property> {
    return this.request<Property>(`/api/properties/${propertyId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(propertyId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/properties/${propertyId}`, {
      method: 'DELETE',
    });
  }

  // Chat Routes
  async createChat(): Promise<Chat> {
    return this.request<Chat>('/api/chats', {
      method: 'POST',
    });
  }

  async getChats(): Promise<Chat[]> {
    return this.request<Chat[]>('/api/chats');
  }

  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>(`/api/chats/${chatId}/messages`);
  }

  async sendMessage(chatId: string, text: string): Promise<ChatMessage> {
    return this.request<ChatMessage>(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async deleteChat(chatId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/chats/${chatId}`, {
      method: 'DELETE',
    });
  }

  // Weather Routes
  async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast> {
    return this.request<WeatherForecast>(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
  }
}

export const apiService = new ApiService();
export type { 
  UserProfile, 
  UpdateProfileData, 
  Property, 
  CreatePropertyData, 
  UpdatePropertyData,
  Chat,
  ChatMessage,
  WeatherForecast
};
