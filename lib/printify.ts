import { Product, Blueprint, PrintProvider, Variant } from './types';

const PRINTIFY_API_URL = 'https://api.printify.com/v1';

export class PrintifyService {
  private apiKey: string;
  private shopId: string;

  constructor(apiKey: string, shopId: string) {
    this.apiKey = apiKey;
    this.shopId = shopId;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${PRINTIFY_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all available blueprints (product types)
  async getBlueprints(): Promise<Blueprint[]> {
    return this.fetch('/blueprints.json');
  }

  // Get all print providers for a specific blueprint
  async getPrintProviders(blueprintId: number): Promise<PrintProvider[]> {
    return this.fetch(`/blueprints/${blueprintId}/print_providers.json`);
  }

  // Get all variants for a specific blueprint and print provider
  async getVariants(blueprintId: number, printProviderId: number): Promise<Variant[]> {
    return this.fetch(`/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`);
  }

  // Create a new product
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return this.fetch(`/shops/${this.shopId}/products.json`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  // Get all products
  async getProducts(): Promise<Product[]> {
    return this.fetch(`/shops/${this.shopId}/products.json`);
  }

  // Get a specific product
  async getProduct(productId: string): Promise<Product> {
    return this.fetch(`/shops/${this.shopId}/products/${productId}.json`);
  }

  // Update a product
  async updateProduct(productId: string, product: Partial<Product>): Promise<Product> {
    return this.fetch(`/shops/${this.shopId}/products/${productId}.json`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  // Delete a product
  async deleteProduct(productId: string): Promise<void> {
    await this.fetch(`/shops/${this.shopId}/products/${productId}.json`, {
      method: 'DELETE',
    });
  }

  // Publish a product
  async publishProduct(productId: string): Promise<void> {
    await this.fetch(`/shops/${this.shopId}/products/${productId}/publish.json`, {
      method: 'POST',
    });
  }

  // Unpublish a product
  async unpublishProduct(productId: string): Promise<void> {
    await this.fetch(`/shops/${this.shopId}/products/${productId}/unpublish.json`, {
      method: 'POST',
    });
  }
} 