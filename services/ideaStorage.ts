import { StartupIdea } from '../types';
import { MOCK_IDEA_SALES } from '../data/ideaSaleMockData';

const STORAGE_KEY = 'startup_idea_sales';
const MOCK_DATA_MIGRATED_KEY = 'mock_data_migrated';

export class IdeaStorageService {
  // Initialize storage with mock data if empty
  static initializeStorage(): void {
    if (typeof window === 'undefined') return;

    const hasMigrated = localStorage.getItem(MOCK_DATA_MIGRATED_KEY);
    const existingData = localStorage.getItem(STORAGE_KEY);

    if (!hasMigrated && !existingData) {
      // First time - load mock data
      this.saveIdeas(MOCK_IDEA_SALES);
      localStorage.setItem(MOCK_DATA_MIGRATED_KEY, 'true');
      console.log('Initialized storage with mock data');
    }
  }

  // Save all ideas to local storage
  static saveIdeas(ideas: StartupIdea[]): void {
    if (typeof window === 'undefined') return;

    try {
      const dataToSave = JSON.stringify(ideas);
      localStorage.setItem(STORAGE_KEY, dataToSave);
      console.log(`Saved ${ideas.length} ideas to local storage`);
    } catch (error) {
      console.error('Failed to save ideas to local storage:', error);
      // If storage is full, try to save only the most recent ideas
      try {
        const recentIdeas = ideas.slice(-50); // Keep only last 50 ideas
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIdeas));
        console.log('Saved recent ideas due to storage limits');
      } catch (fallbackError) {
        console.error('Failed to save even recent ideas:', fallbackError);
      }
    }
  }

  // Load all ideas from local storage
  static loadIdeas(): StartupIdea[] {
    if (typeof window === 'undefined') return MOCK_IDEA_SALES;

    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) {
        // If no data exists, initialize with mock data
        this.initializeStorage();
        return this.loadIdeas(); // Recursive call after initialization
      }

      const ideas = JSON.parse(storedData) as StartupIdea[];
      console.log(`Loaded ${ideas.length} ideas from local storage`);
      return ideas;
    } catch (error) {
      console.error('Failed to load ideas from local storage:', error);
      // Fallback to mock data
      return MOCK_IDEA_SALES;
    }
  }

  // Add a single idea to storage
  static addIdea(newIdea: StartupIdea): StartupIdea[] {
    const existingIdeas = this.loadIdeas();
    const updatedIdeas = [newIdea, ...existingIdeas];
    this.saveIdeas(updatedIdeas);
    return updatedIdeas;
  }

  // Update an existing idea
  static updateIdea(updatedIdea: StartupIdea): StartupIdea[] {
    const existingIdeas = this.loadIdeas();
    const updatedIdeas = existingIdeas.map(idea => 
      idea.id === updatedIdea.id ? updatedIdea : idea
    );
    this.saveIdeas(updatedIdeas);
    return updatedIdeas;
  }

  // Delete an idea by ID
  static deleteIdea(ideaId: string): StartupIdea[] {
    const existingIdeas = this.loadIdeas();
    const updatedIdeas = existingIdeas.filter(idea => idea.id !== ideaId);
    this.saveIdeas(updatedIdeas);
    return updatedIdeas;
  }

  // Get idea by ID
  static getIdeaById(ideaId: string): StartupIdea | null {
    const ideas = this.loadIdeas();
    return ideas.find(idea => idea.id === ideaId) || null;
  }

  // Get storage statistics
  static getStorageStats(): {
    totalIdeas: number;
    activeIdeas: number;
    soldIdeas: number;
    pendingIdeas: number;
    storageSize: string;
  } {
    const ideas = this.loadIdeas();
    const activeIdeas = ideas.filter(i => i.status === 'active').length;
    const soldIdeas = ideas.filter(i => i.status === 'sold').length;
    const pendingIdeas = ideas.filter(i => i.status === 'pending').length;
    
    let storageSize = '0 KB';
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const bytes = new Blob([storedData]).size;
        storageSize = `${(bytes / 1024).toFixed(2)} KB`;
      }
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
    }

    return {
      totalIdeas: ideas.length,
      activeIdeas,
      soldIdeas,
      pendingIdeas,
      storageSize
    };
  }

  // Clear all data (for testing/reset)
  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MOCK_DATA_MIGRATED_KEY);
    console.log('Cleared all idea storage data');
  }

  // Export data as JSON (for backup)
  static exportData(): string {
    const ideas = this.loadIdeas();
    const exportData = {
      exportDate: new Date().toISOString(),
      totalIdeas: ideas.length,
      ideas: ideas
    };
    return JSON.stringify(exportData, null, 2);
  }

  // Import data from JSON
  static importData(jsonData: string): { success: boolean; message: string; imported: number } {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.ideas || !Array.isArray(data.ideas)) {
        return { success: false, message: 'Invalid data format', imported: 0 };
      }

      // Validate that each idea has required fields
      const validIdeas = data.ideas.filter((idea: any) => {
        return idea.id && idea.title && idea.description && idea.industry && 
               idea.founderName && idea.contactEmail && idea.saleTerms;
      });

      if (validIdeas.length === 0) {
        return { success: false, message: 'No valid ideas found in data', imported: 0 };
      }

      this.saveIdeas(validIdeas);
      return { 
        success: true, 
        message: `Successfully imported ${validIdeas.length} ideas`, 
        imported: validIdeas.length 
      };
    } catch (error) {
      return { success: false, message: 'Failed to parse JSON data', imported: 0 };
    }
  }

  // Get ideas by status
  static getIdeasByStatus(status: StartupIdea['status']): StartupIdea[] {
    const ideas = this.loadIdeas();
    return ideas.filter(idea => idea.status === status);
  }

  // Search ideas
  static searchIdeas(query: string): StartupIdea[] {
    const ideas = this.loadIdeas();
    const lowerQuery = query.toLowerCase();
    
    return ideas.filter(idea => 
      idea.title.toLowerCase().includes(lowerQuery) ||
      idea.description.toLowerCase().includes(lowerQuery) ||
      idea.industry.toLowerCase().includes(lowerQuery) ||
      idea.founderName.toLowerCase().includes(lowerQuery) ||
      idea.businessModel.toLowerCase().includes(lowerQuery)
    );
  }

  // Get ideas by price range
  static getIdeasByPriceRange(min: number, max: number): StartupIdea[] {
    const ideas = this.loadIdeas();
    return ideas.filter(idea => 
      idea.saleTerms.askingPrice >= min && idea.saleTerms.askingPrice <= max
    );
  }

  // Sort ideas by different criteria
  static sortIdeas(ideas: StartupIdea[], sortBy: 'newest' | 'price_low' | 'price_high' | 'views' | 'profit'): StartupIdea[] {
    const sorted = [...ideas];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
      case 'price_low':
        return sorted.sort((a, b) => a.saleTerms.askingPrice - b.saleTerms.askingPrice);
      case 'price_high':
        return sorted.sort((a, b) => b.saleTerms.askingPrice - a.saleTerms.askingPrice);
      case 'views':
        return sorted.sort((a, b) => b.views - a.views);
      case 'profit':
        return sorted.sort((a, b) => b.financialBreakdown.founderProfit - a.financialBreakdown.founderProfit);
      default:
        return sorted;
    }
  }
}
