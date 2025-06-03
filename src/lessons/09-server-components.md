---
slug: server-components
order: 9
title: React Server Components - Server-Side Data
---

### Why Now?
Server Components cut bundle size and allow data-fetching without waterfalls—ideal after you understand client calls.

### Real-life Scenario
Server-render a marketing page pulling product catalog data with zero client JS.

### Goal
Move a heavy query into an RSC, compare bundle diff, and confirm hydration cost drops.

### What You'll Learn
- Server Components vs Client Components
- Server-side tRPC calling patterns
- Bundle size optimization
- SEO and performance benefits

### Exercise

1. Create a Server Component that fetches data
2. Compare with client-side data fetching
3. Measure performance differences
4. Implement hybrid patterns

### Example Implementation

```tsx
// Server Component for product catalog
// app/products/page.tsx (Server Component by default)
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';

export default async function ProductsPage() {
  // Direct server-side tRPC call
  const caller = appRouter.createCaller(await createContext());
  
  // Fetch data on the server
  const products = await caller.lessons.getProducts();
  const categories = await caller.lessons.getCategories();
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      {/* Categories navigation */}
      <nav className="mb-8">
        <ul className="flex gap-4">
          {categories.map(category => (
            <li key={category.id}>
              <a 
                href={`/products?category=${category.slug}`}
                className="px-4 py-2 bg-blue-100 rounded-lg hover:bg-blue-200"
              >
                {category.name} ({category.count})
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Server Component for individual product
function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-200 rounded-lg mb-4">
        {/* Image placeholder */}
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No Image
        </div>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-green-600">
          ${product.price}
        </span>
        <span className="text-sm text-gray-500">
          {product.category}
        </span>
      </div>
      
      {/* Add to cart - Client Component */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}
```

### Server-Side tRPC Procedures

```ts
// Add these to your lessons router
getProducts: t.procedure
  .input(z.object({
    category: z.string().optional(),
    limit: z.number().min(1).max(100).default(20),
    search: z.string().optional(),
  }).optional())
  .query(async ({ input }) => {
    // Simulate database query
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const allProducts = [
      { id: 1, name: 'Laptop Pro', price: 1299, category: 'Electronics', description: 'High-performance laptop for professionals' },
      { id: 2, name: 'Wireless Headphones', price: 199, category: 'Electronics', description: 'Premium sound quality' },
      { id: 3, name: 'Coffee Maker', price: 89, category: 'Home', description: 'Brew perfect coffee every time' },
      { id: 4, name: 'Ergonomic Chair', price: 299, category: 'Furniture', description: 'Comfortable office seating' },
      { id: 5, name: 'Smart Watch', price: 249, category: 'Electronics', description: 'Track your fitness goals' },
      { id: 6, name: 'Desk Lamp', price: 45, category: 'Furniture', description: 'Adjustable LED lighting' },
    ];
    
    let filtered = allProducts;
    
    if (input?.category) {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === input.category?.toLowerCase()
      );
    }
    
    if (input?.search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(input.search!.toLowerCase()) ||
        p.description.toLowerCase().includes(input.search!.toLowerCase())
      );
    }
    
    return filtered.slice(0, input?.limit || 20);
  }),

getCategories: t.procedure.query(async () => {
  return [
    { id: 1, name: 'Electronics', slug: 'electronics', count: 3 },
    { id: 2, name: 'Home', slug: 'home', count: 1 },
    { id: 3, name: 'Furniture', slug: 'furniture', count: 2 },
  ];
}),

getProductDetails: t.procedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    // Simulate slow database query
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      id: input.id,
      name: `Product ${input.id}`,
      price: Math.floor(Math.random() * 1000) + 50,
      description: 'Detailed product description with all specifications...',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      inStock: Math.random() > 0.2,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviews: Math.floor(Math.random() * 1000),
    };
  }),
```

### Client Component for Interactivity

```tsx
// components/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { trpc } from '@/server/trpc';

export function AddToCartButton({ productId }: { productId: number }) {
  const [quantity, setQuantity] = useState(1);
  
  const addToCart = trpc.lessons.addToCart.useMutation({
    onSuccess: () => {
      alert('Added to cart!');
    },
  });
  
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        <label htmlFor="quantity" className="text-sm">Qty:</label>
        <select 
          id="quantity"
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[1,2,3,4,5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      
      <button
        onClick={() => addToCart.mutate({ productId, quantity })}
        disabled={addToCart.isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {addToCart.isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### Hybrid Pattern: Server + Client

```tsx
// app/product/[id]/page.tsx
export default async function ProductDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const caller = appRouter.createCaller(await createContext());
  
  // Server-rendered data
  const product = await caller.lessons.getProductDetails({ 
    id: Number(params.id) 
  });
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Server-rendered content */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-lg">
          Product Image
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-green-600 font-bold mb-4">
            ${product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              {product.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
          
          {/* Client-side interactive components */}
          <ProductInteractions product={product} />
        </div>
      </div>
      
      {/* Related products - Client component for dynamic loading */}
      <RelatedProducts categoryId={product.categoryId} />
    </div>
  );
}
```

### Key Benefits
- **Faster Initial Load**: No client-side data fetching waterfalls
- **Better SEO**: Content available for crawlers
- **Smaller Bundle**: Less JavaScript sent to client
- **Improved Core Web Vitals**: Better performance metrics

### When to Use Server Components
- **Static Content**: Product pages, blog posts, documentation
- **Heavy Data**: Large datasets that don't need real-time updates
- **SEO Critical**: Landing pages, marketing content
- **Initial Page Load**: First paint optimization

### When to Use Client Components
- **Interactivity**: Forms, buttons, user input
- **Real-time Updates**: Live data, subscriptions
- **Browser APIs**: Local storage, geolocation
- **User State**: Authentication, preferences

### Performance Comparison
- **Server Components**: Zero JS bundle, instant rendering
- **Client Components**: Interactive, real-time updates
- **Hybrid Approach**: Best of both worlds

Test the performance difference in the playground below! 