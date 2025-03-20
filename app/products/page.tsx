'use client';

import { useState, useEffect } from 'react';
import { usePrintify } from '@/lib/PrintifyContext';
import { Product, Blueprint } from '@/lib/types';

export default function ProductsPage() {
  const {
    products,
    blueprints,
    loading,
    error,
    initialize,
    createProduct,
    updateProduct,
    deleteProduct,
    publishProduct,
    unpublishProduct,
  } = usePrintify();

  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Initialize Printify with environment variables
    const apiKey = process.env.NEXT_PUBLIC_PRINTIFY_API_KEY;
    const shopId = process.env.NEXT_PUBLIC_PRINTIFY_SHOP_ID;
    if (apiKey && shopId) {
      initialize(apiKey, shopId);
    }
  }, [initialize]);

  const handleConnectPrintify = async () => {
    setIsConnecting(true);
    try {
      // In a real implementation, this would redirect to Printify's OAuth flow
      // For now, we'll just initialize with the API key
      const apiKey = process.env.NEXT_PUBLIC_PRINTIFY_API_KEY;
      const shopId = process.env.NEXT_PUBLIC_PRINTIFY_SHOP_ID;
      if (apiKey && shopId) {
        await initialize(apiKey, shopId);
      }
    } catch (err) {
      console.error('Failed to connect to Printify:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!selectedBlueprint) return;
    try {
      await createProduct({
        title: 'New Product',
        description: 'Product description',
        blueprint_id: selectedBlueprint.id,
        print_provider_id: 1, // This would be selected by the user
        variants: [],
        images: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: null,
        visible: true,
        is_locked: false,
        is_template: false,
        is_printify_express: false,
        is_customizable: true,
        is_digital: false,
        is_saved: false,
        user_id: 1, // This would come from the authenticated user
        shop_id: parseInt(process.env.NEXT_PUBLIC_PRINTIFY_SHOP_ID || '1'),
        print_areas: [],
      });
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={handleCreateProduct}
          disabled={!selectedBlueprint}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Printify Integration */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Printify Integration</h2>
            <p className="mt-1 text-sm text-gray-500">Connect your Printify account to start selling</p>
          </div>
          <button
            onClick={handleConnectPrintify}
            disabled={isConnecting}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isConnecting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            {isConnecting ? 'Connecting...' : 'Connect Printify'}
          </button>
        </div>
      </div>

      {/* Product Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Product Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {blueprints.map((blueprint) => (
            <button
              key={blueprint.id}
              onClick={() => setSelectedBlueprint(blueprint)}
              className={`flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 ${
                selectedBlueprint?.id === blueprint.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <img
                src={blueprint.images[0]}
                alt={blueprint.title}
                className="w-16 h-16 object-contain mb-2"
              />
              <span className="text-sm font-medium text-gray-900">{blueprint.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Products</h2>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.images[0]?.url || '/placeholder.png'}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      ${product.variants[0]?.price || 0}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => publishProduct(product.id)}
                        disabled={!!product.published_at}
                        className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        Publish
                      </button>
                      <button
                        onClick={() => unpublishProduct(product.id)}
                        disabled={!product.published_at}
                        className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      >
                        Unpublish
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 