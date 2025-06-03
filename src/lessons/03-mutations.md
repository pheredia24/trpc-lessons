---
slug: mutations
order: 3
title: Mutations - Changing Data
---

### Why Now?
Once you can read, you'll want to write. Mutations introduce cache invalidation and optimistic UI patterns.

### Real-life Scenario
A "Like" button increments a post's 👍 count without waiting for the round-trip.

### Goal
Implement `incrementLike` mutation, show optimistic update, and invalidate the post query.

### What You'll Learn
- Difference between queries and mutations
- Optimistic updates for better UX
- Cache invalidation patterns
- Mutation success/error handling

### Exercise

1. Create a `likePost` mutation that accepts a post ID
2. Implement optimistic UI updates
3. Handle success and error states
4. Invalidate related queries after mutation

### Example Implementation

```ts
// In your lessons router
likePost: t.procedure
  .input(z.object({ postId: z.number() }))
  .mutation(async ({ input }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Failed to like post');
    }
    
    return {
      postId: input.postId,
      likes: Math.floor(Math.random() * 100) + 1,
      message: 'Post liked successfully!'
    };
  }),

getPost: t.procedure
  .input(z.object({ id: z.number() }))
  .query(({ input }) => {
    return {
      id: input.id,
      title: `Post ${input.id}`,
      content: 'This is a sample post content...',
      likes: Math.floor(Math.random() * 50),
      author: 'Demo User'
    };
  }),
```

### Key Concepts
- **Mutations vs Queries**: Use `.mutation()` for data changes
- **Async Operations**: Handle promises and loading states
- **Error Handling**: Graceful failure recovery
- **Cache Management**: Invalidate stale data after mutations

### Best Practices
- Always show loading states during mutations
- Implement optimistic updates for better UX
- Handle both success and error cases
- Invalidate or update related cached data

Try liking posts in the playground below! 