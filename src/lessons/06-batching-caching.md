---
slug: batching-caching
order: 6
title: Batching & Caching - Performance Optimization
---

### Why Now?
Multiple widgets on a page fire simultaneous queries. Batching trims latency, caching kills duplicates.

### Real-life Scenario
A dashboard issues 5 small stats queries; you want one network round-trip.

### Goal
Enable `httpBatchLink`, observe single POST, inspect React Query cache for hits.

### What You'll Learn
- HTTP request batching configuration
- React Query cache management
- Cache invalidation strategies
- Performance optimization techniques

### Exercise

1. Configure HTTP batching for multiple simultaneous queries
2. Observe network requests in DevTools
3. Implement smart caching strategies
4. Test cache hits and misses

### Batching Configuration

```ts
// In your tRPC client setup (layout.tsx)
const [trpcClient] = useState(() =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        maxBatchSize: 10, // Batch up to 10 requests
        maxURLLength: 2048, // Use GET for small batches
      }),
    ],
  })
);
```

### Example Implementation

```ts
// In your lessons router
getDashboardStats: t.procedure.query(() => {
  return {
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    activeUsers: Math.floor(Math.random() * 200) + 100,
    totalPosts: Math.floor(Math.random() * 5000) + 1000,
    totalComments: Math.floor(Math.random() * 10000) + 2000,
  };
}),

getUserActivity: t.procedure
  .input(z.object({ userId: z.number() }))
  .query(({ input }) => {
    return {
      userId: input.userId,
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      postsCount: Math.floor(Math.random() * 50),
      commentsCount: Math.floor(Math.random() * 200),
      likesReceived: Math.floor(Math.random() * 500),
    };
  }),

getRecentPosts: t.procedure
  .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
  .query(({ input }) => {
    return Array.from({ length: input.limit }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      author: `User ${Math.floor(Math.random() * 10) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 100),
    }));
  }),

getSystemHealth: t.procedure.query(() => {
  return {
    status: 'healthy',
    uptime: '99.9%',
    responseTime: Math.floor(Math.random() * 100) + 50,
    errorRate: (Math.random() * 0.1).toFixed(3),
    lastChecked: new Date().toISOString(),
  };
}),
```

### Caching Strategies

```tsx
// Different cache strategies for different data types
const { data: stats } = trpc.getDashboardStats.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
});

const { data: health } = trpc.getSystemHealth.useQuery(undefined, {
  refetchInterval: 30 * 1000, // Refetch every 30 seconds
  staleTime: 0, // Always consider stale (refetch on focus)
});

const { data: posts } = trpc.getRecentPosts.useQuery({ limit: 5 }, {
  staleTime: 2 * 60 * 1000, // Fresh for 2 minutes
  keepPreviousData: true, // Keep showing old data while fetching new
});
```

### Key Concepts
- **Batching**: Combine multiple requests into single HTTP call
- **Stale Time**: How long data is considered fresh
- **Cache Time**: How long data stays in memory
- **Refetch Intervals**: Automatic background updates

### Performance Benefits
- **Reduced Network Calls**: Batch multiple queries
- **Lower Latency**: Fewer round-trips to server
- **Better UX**: Instant responses from cache
- **Bandwidth Savings**: Avoid duplicate requests

### Cache Management
- **Invalidation**: Remove stale data from cache
- **Prefetching**: Load data before it's needed
- **Background Updates**: Keep cache fresh silently
- **Optimistic Updates**: Update cache immediately

### Debugging Tips
- Use React Query DevTools to inspect cache
- Monitor network tab for batched requests
- Check cache hit rates in DevTools
- Profile performance with React DevTools

Test multiple simultaneous queries in the playground below! 