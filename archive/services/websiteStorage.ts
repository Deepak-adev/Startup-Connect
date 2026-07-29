export interface GeneratedWebsite {
  id: string;
  title: string;
  prompt: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  createdAt: string;
  previewUrl: string;
}

const WEBSITE_STORAGE_KEY = 'generated_websites';

export class WebsiteStorageService {
  static saveWebsite(website: GeneratedWebsite): void {
    const websites = this.getAllWebsites();
    websites.unshift(website); // Add to beginning

    // Keep only last 20 websites to avoid localStorage limits
    const limited = websites.slice(0, 20);
    localStorage.setItem(WEBSITE_STORAGE_KEY, JSON.stringify(limited));
  }

  static getAllWebsites(): GeneratedWebsite[] {
    const data = localStorage.getItem(WEBSITE_STORAGE_KEY);
    try {
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to parse websites:', error);
      return [];
    }
  }

  static getWebsiteById(id: string): GeneratedWebsite | null {
    const websites = this.getAllWebsites();
    return websites.find(w => w.id === id) || null;
  }

  static deleteWebsite(id: string): void {
    const websites = this.getAllWebsites();
    const filtered = websites.filter(w => w.id !== id);
    localStorage.setItem(WEBSITE_STORAGE_KEY, JSON.stringify(filtered));
  }
}
