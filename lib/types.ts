export interface Blueprint {
  id: number;
  title: string;
  description: string;
  brand: string;
  model: string;
  images: string[];
  category: string;
}

export interface PrintProvider {
  id: number;
  title: string;
  location: {
    country: string;
    address1: string;
    address2: string;
    city: string;
    region: string;
    zip: string;
  };
}

export interface Variant {
  id: number;
  title: string;
  sku: string;
  enabled: boolean;
  is_default: boolean;
  options: {
    color: string;
    size: string;
  };
  price: number;
  is_available: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  blueprint_id: number;
  print_provider_id: number;
  variants: {
    id: number;
    sku: string;
    cost: number;
    price: number;
    title: string;
    grams: number;
    is_enabled: boolean;
    is_default: boolean;
    options: {
      color: string;
      size: string;
    };
    images: {
      id: number;
      url: string;
      preview_url: string;
    }[];
  }[];
  images: {
    id: number;
    url: string;
    preview_url: string;
  }[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  visible: boolean;
  is_locked: boolean;
  is_template: boolean;
  is_printify_express: boolean;
  is_customizable: boolean;
  is_digital: boolean;
  is_saved: boolean;
  user_id: number;
  shop_id: number;
  print_areas: {
    variant_ids: number[];
    placeholders: {
      position: string;
      images: {
        id: number;
        url: string;
        preview_url: string;
      }[];
    }[];
  }[];
} 