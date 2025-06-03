---
slug: queries
order: 2
title: Queries - Reading Data
---

### Why Now?
Reading data is 90% of client traffic. Master this before touching state-changing calls.

### Real-life Scenario
Fetching a user profile by `id` to hydrate a dashboard after login.

### Goal
Build a typed `user` query, feed it into `useQuery`, and render JSON.

### What You'll Learn
- Input validation with Zod schemas
- Parameter passing to tRPC procedures
- Error handling for missing data
- TypeScript inference from server to client

### Exercise

1. Create a `getUser` procedure that accepts a user ID
2. Return mock user data based on the ID
3. Handle the case when a user doesn't exist
4. Use the procedure in the playground below

### Example Implementation

```ts
// In your lessons router
getUser: t.procedure
  .input(z.object({ id: z.number() }))
  .query(({ input }) => {
    const users = [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
      { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user' },
    ];
    
    const user = users.find(u => u.id === input.id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }),
```

### Key Concepts
- **Input Validation**: Zod ensures the ID is a number
- **Data Fetching**: The procedure returns structured data
- **Error Handling**: Throws an error for missing users
- **Type Safety**: TypeScript infers the return type automatically

Try different user IDs in the playground below! 