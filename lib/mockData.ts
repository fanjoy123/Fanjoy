// Mock data store
let orders: any[] = [];
let products: any[] = [];

export const mockData = {
  // Orders
  getOrder: async (orderId: string) => {
    return orders.find(order => order.id === orderId || order.orderId === orderId);
  },
  
  createOrder: async (orderData: any) => {
    const order = {
      id: Math.random().toString(36).substring(7),
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(order);
    return order;
  },
  
  updateOrder: async (orderId: string, updateData: any) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return orders[orderIndex];
  },
  
  getOrders: async () => {
    return orders;
  },
  
  // Products
  getProducts: async () => {
    return products;
  },
  
  addProduct: async (productData: any) => {
    const product = {
      id: Math.random().toString(36).substring(7),
      ...productData,
      createdAt: new Date().toISOString(),
    };
    products.push(product);
    return product;
  },
}; 