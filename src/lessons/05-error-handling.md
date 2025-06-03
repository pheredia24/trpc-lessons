---
slug: error-handling
order: 5
title: Error Handling - Graceful Failures
---

### Why Now?
After validation, you still need to map server failures to friendly UI messages.

### Real-life Scenario
Display "Insufficient permissions" when a non-admin presses "Delete post".

### Goal
Throw `TRPCError('UNAUTHORIZED')`, catch it in React, and map codes to banners.

### What You'll Learn
- tRPC error types and status codes
- Custom error messages and metadata
- Client-side error handling patterns
- User-friendly error display

### Exercise

1. Create procedures that throw different types of errors
2. Handle errors gracefully in the UI
3. Display appropriate error messages to users
4. Implement retry mechanisms for recoverable errors

### Example Implementation

```ts
import { TRPCError } from '@trpc/server';

// In your lessons router
deletePost: t.procedure
  .input(z.object({ 
    postId: z.number(),
    userId: z.number() 
  }))
  .mutation(({ input }) => {
    // Simulate user permission check
    const adminUsers = [1, 2]; // Admin user IDs
    
    if (!adminUsers.includes(input.userId)) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Insufficient permissions to delete posts',
        cause: 'User is not an admin'
      });
    }
    
    // Simulate post not found
    if (input.postId > 100) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found',
        cause: `Post ${input.postId} does not exist`
      });
    }
    
    // Simulate server error
    if (input.postId === 13) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database connection failed',
        cause: 'Temporary server issue'
      });
    }
    
    return {
      success: true,
      message: `Post ${input.postId} deleted successfully`
    };
  }),

getProtectedData: t.procedure
  .input(z.object({ token: z.string().optional() }))
  .query(({ input }) => {
    if (!input.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication token required'
      });
    }
    
    if (input.token !== 'valid-token') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid or expired token'
      });
    }
    
    return {
      secretData: 'This is protected information',
      timestamp: new Date().toISOString()
    };
  }),
```

### Common tRPC Error Codes
- **BAD_REQUEST**: Invalid input or malformed request
- **UNAUTHORIZED**: Authentication required
- **FORBIDDEN**: Insufficient permissions
- **NOT_FOUND**: Resource doesn't exist
- **TIMEOUT**: Request took too long
- **CONFLICT**: Resource conflict (e.g., duplicate email)
- **INTERNAL_SERVER_ERROR**: Unexpected server error

### Error Handling Best Practices
- Use specific error codes for different scenarios
- Provide helpful error messages for users
- Include debugging information for developers
- Implement retry logic for transient errors
- Log errors for monitoring and debugging

### Client-Side Error Handling
```tsx
const { mutate, error, isError } = trpc.deletePost.useMutation({
  onError: (error) => {
    // Handle specific error codes
    if (error.data?.code === 'UNAUTHORIZED') {
      showToast('You don\'t have permission to delete posts');
    } else if (error.data?.code === 'NOT_FOUND') {
      showToast('Post not found');
    } else {
      showToast('Something went wrong. Please try again.');
    }
  }
});
```

Test different error scenarios in the playground below! 