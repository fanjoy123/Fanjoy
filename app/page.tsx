'use client';

const FEATURED_CREATORS = [
  {
    name: "David Dobrik",
    followers: "18.4M",
    image: "https://cdn.shopify.com/s/files/1/0037/6679/7521/files/dobrik_1200x1200.jpg?v=1614323980"
  },
  {
    name: "Addison Rae",
    followers: "88.7M",
    image: "https://cdn.shopify.com/s/files/1/0037/6679/7521/files/addison_1200x1200.jpg?v=1614324016"
  },
  {
    name: "Charli D'Amelio",
    followers: "141.1M",
    image: "https://cdn.shopify.com/s/files/1/0037/6679/7521/files/charli_1200x1200.jpg?v=1614324050"
  }
];

const TRENDING_PRODUCTS = [
  {
    name: "Classic Hoodie",
    creator: "David Dobrik",
    price: 49.99,
    image: "https://cdn.shopify.com/s/files/1/0037/6679/7521/products/dobrik-hoodie-black_1024x1024.jpg?v=1614325000"
  },
  {
    name: "Signature Tee",
    creator: "Addison Rae",
    price: 24.99,
    image: "https://cdn.shopify.com/s/files/1/0037/6679/7521/products/addison-tee-white_1024x1024.jpg?v=1614325100"
  },
  {
    name: "Phone Case",
    creator: "Charli D'Amelio",
    price: 19.99,
    image: "https://cdn.shopify.com/s/files/1/0037/6679/7521/products/charli-phone-case_1024x1024.jpg?v=1614325200"
  },
  {
    name: "Sticker Pack",
    creator: "David Dobrik",
    price: 12.99,
    image: "https://cdn.shopify.com/s/files/1/0037/6679/7521/products/dobrik-stickers_1024x1024.jpg?v=1614325300"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full object-cover bg-gradient-to-r from-blue-600 to-blue-700" />
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
              {/* Navigation */}
              <nav className="relative flex items-center justify-between sm:h-10">
                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <a href="#" className="text-3xl font-bold text-white">
                      Fanjoy
                    </a>
                  </div>
                </div>
                <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                  <a href="#" className="font-medium text-white hover:text-gray-200">Explore</a>
                  <a href="#" className="font-medium text-white hover:text-gray-200">Start Selling</a>
                  <a href="#" className="font-medium text-white hover:text-gray-200">Sign in</a>
                </div>
              </nav>
            </div>

            {/* Search Bar */}
            <div className="mt-10 mx-auto max-w-3xl px-4 sm:px-6">
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-14 px-6 rounded-full border-2 border-white bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Search for creator merch..."
                />
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {['T-Shirts', 'Hoodies', 'Stickers', 'Accessories', 'Phone Cases', 'Posters'].map((category) => (
            <a
              key={category}
              href="#"
              className="px-6 py-3 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 whitespace-nowrap font-medium transition-colors"
            >
              {category}
            </a>
          ))}
        </div>
      </div>

      {/* Featured Creators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Creators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_CREATORS.map((creator) => (
            <div key={creator.name} className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="relative w-full h-64">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-200"
                  style={{ backgroundImage: `url(${creator.image})` }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-white font-semibold text-xl">{creator.name}</h3>
                <p className="text-gray-200 text-sm">{creator.followers} Followers</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {TRENDING_PRODUCTS.map((product) => (
            <div key={product.name} className="group">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1">
                <div className="relative w-full h-full">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:opacity-75 transition-opacity"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                </div>
                <div className="absolute bottom-2 right-2">
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.creator}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Start Selling CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Your Creator Store</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators selling custom merchandise. No upfront costs, just pure creativity.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors">
            Open Your Store
          </button>
        </div>
      </section>
    </div>
  );
}
