import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrintifyService } from './printify';
import { Product, Blueprint, PrintProvider, Variant } from './types';

interface PrintifyContextType {
  service: PrintifyService | null;
  products: Product[];
  blueprints: Blueprint[];
  printProviders: Record<number, PrintProvider[]>;
  variants: Record<string, Variant[]>;
  loading: boolean;
  error: string | null;
  initialize: (apiKey: string, shopId: string) => Promise<void>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (productId: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<void>;
  publishProduct: (productId: string) => Promise<void>;
  unpublishProduct: (productId: string) => Promise<void>;
}

const PrintifyContext = createContext<PrintifyContextType | undefined>(undefined);

export function PrintifyProvider({ children }: { children: React.ReactNode }) {
  const [service, setService] = useState<PrintifyService | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [printProviders, setPrintProviders] = useState<Record<number, PrintProvider[]>>({});
  const [variants, setVariants] = useState<Record<string, Variant[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = async (apiKey: string, shopId: string) => {
    try {
      setLoading(true);
      setError(null);
      const newService = new PrintifyService(apiKey, shopId);
      setService(newService);

      // Fetch initial data
      const [productsData, blueprintsData] = await Promise.all([
        newService.getProducts(),
        newService.getBlueprints(),
      ]);

      setProducts(productsData);
      setBlueprints(blueprintsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize Printify');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: Omit<Product, 'id'>) => {
    if (!service) throw new Error('Printify service not initialized');
    try {
      setLoading(true);
      setError(null);
      const newProduct = await service.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, product: Partial<Product>) => {
    if (!service) throw new Error('Printify service not initialized');
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await service.updateProduct(productId, product);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!service) throw new Error('Printify service not initialized');
    try {
      setLoading(true);
      setError(null);
      await service.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishProduct = async (productId: string) => {
    if (!service) throw new Error('Printify service not initialized');
    try {
      setLoading(true);
      setError(null);
      await service.publishProduct(productId);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, published_at: new Date().toISOString() } : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unpublishProduct = async (productId: string) => {
    if (!service) throw new Error('Printify service not initialized');
    try {
      setLoading(true);
      setError(null);
      await service.unpublishProduct(productId);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, published_at: null } : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrintifyContext.Provider
      value={{
        service,
        products,
        blueprints,
        printProviders,
        variants,
        loading,
        error,
        initialize,
        createProduct,
        updateProduct,
        deleteProduct,
        publishProduct,
        unpublishProduct,
      }}
    >
      {children}
    </PrintifyContext.Provider>
  );
}

export function usePrintify() {
  const context = useContext(PrintifyContext);
  if (context === undefined) {
    throw new Error('usePrintify must be used within a PrintifyProvider');
  }
  return context;
} 