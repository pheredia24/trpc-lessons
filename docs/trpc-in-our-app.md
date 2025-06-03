# How We Use tRPC in This Lessons App

This document explains how tRPC is implemented and used throughout the tRPC lessons web application itself. By examining our own implementation, you can see tRPC patterns in action in a real-world application.

## 🏗️ Application Architecture

Our tRPC lessons app follows modern full-stack TypeScript patterns:

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/trpc/[trpc]/   # tRPC API route handler
│   ├── lesson/[slug]/     # Dynamic lesson pages
│   └── providers.tsx      # React Query + tRPC providers
├── server/                # tRPC server-side code
│   ├── routers/          # tRPC procedure definitions
│   ├── context.ts        # Request context creation
│   └── trpc.ts          # Client-side tRPC setup
└── lessons/              # Markdown lesson content
```

## ⚙️ tRPC Server Setup

### 1. Core tRPC Configuration (`src/server/trpc.ts`)

We initialize tRPC with a minimal context and proper TypeScript inference:

```typescript
import { initTRPC } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

### 2. Request Context (`src/server/context.ts`)

Our context provides access to request metadata and could be extended for authentication:

```typescript
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

export function createContext(opts: CreateNextContextOptions) {
  return {
    req: opts.req,
    res: opts.res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

### 3. API Router Structure (`src/server/routers/`)

We organize procedures into logical routers:

#### Main App Router (`src/server/routers/_app.ts`)
```typescript
import { router } from '../trpc';
import { lessonsRouter } from './lessons';

export const appRouter = router({
  lessons: lessonsRouter,
});

export type AppRouter = typeof appRouter;
```

#### Lessons Router (`src/server/routers/lessons.ts`)
Contains all procedures used in lesson examples:

```typescript
export const lessonsRouter = router({
  // Basic procedure for "Getting Started" lesson
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => ({
      message: `Hello ${input.name ?? 'World'}!`,
      timestamp: new Date().toISOString(),
    })),

  // Query procedure for "Queries" lesson
  getUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const user = MOCK_USERS.find(u => u.id === input.id);
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      return user;
    }),

  // Mutation procedure for "Mutations" lesson
  likePost: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(({ input }) => {
      // Simulate random failure for demo
      if (Math.random() < 0.3) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to like post',
        });
      }
      return { success: true, likes: Math.floor(Math.random() * 100) };
    }),
});
```

## 🌐 Next.js API Integration

### API Route Handler (`src/app/api/trpc/[trpc]/route.ts`)

We use Next.js 14 App Router with tRPC's fetch adapter:

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
```

## 🔌 Client-Side Integration

### 1. tRPC Client Setup (`src/server/trpc.ts` - client portion)

```typescript
import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from './routers/_app';

export const trpc = createTRPCReact<AppRouter>();
```

### 2. Provider Setup (`src/app/providers.tsx`)

We wrap the app with React Query and tRPC providers:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from '@/server/trpc';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 3. Layout Integration (`src/app/layout.tsx`)

```typescript
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## 🎮 Interactive Playgrounds

Each lesson includes interactive playgrounds that demonstrate tRPC patterns:

### Query Example (from Lesson 2 - Queries)
```typescript
function QueriesPlayground() {
  const [userId, setUserId] = useState(1);
  
  // tRPC query with manual triggering
  const { data: user, isLoading, error, refetch } = trpc.lessons.getUser.useQuery(
    { id: userId },
    { enabled: false } // Manual control
  );

  return (
    <div>
      <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
        <option value={1}>Alice</option>
        <option value={99}>Non-existent user</option>
      </select>
      
      <button onClick={() => refetch()}>
        Get User
      </button>
      
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

### Mutation Example (from Lesson 3 - Mutations)
```typescript
function MutationsPlayground() {
  const [postId, setPostId] = useState(1);
  
  // tRPC mutation with loading states
  const likeMutation = trpc.lessons.likePost.useMutation({
    onSuccess: (data) => {
      console.log('Post liked!', data);
    },
    onError: (error) => {
      console.error('Failed to like post:', error.message);
    },
  });

  const handleLike = () => {
    likeMutation.mutate({ postId });
  };

  return (
    <div>
      <input 
        type="number" 
        value={postId} 
        onChange={(e) => setPostId(Number(e.target.value))} 
      />
      
      <button 
        onClick={handleLike}
        disabled={likeMutation.isPending}
      >
        {likeMutation.isPending ? 'Liking...' : 'Like Post'}
      </button>
      
      {likeMutation.data && (
        <div>✅ Liked! {likeMutation.data.likes} total likes</div>
      )}
      
      {likeMutation.error && (
        <div>❌ Error: {likeMutation.error.message}</div>
      )}
    </div>
  );
}
```

## 🛡️ Type Safety in Action

One of tRPC's biggest advantages is end-to-end type safety. In our app:

### Server-Side Types
```typescript
// Input validation with Zod
const createUserInput = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(13, 'Must be at least 13'),
});

// Procedure with typed input/output
createUser: publicProcedure
  .input(createUserInput)
  .mutation(({ input }) => {
    // input is fully typed as: { name: string, email: string, age: number }
    return {
      id: Math.random(),
      ...input,
      createdAt: new Date(),
    };
  }),
```

### Client-Side Types
```typescript
// TypeScript knows the exact shape of input/output
const createUser = trpc.lessons.createUser.useMutation();

// This is type-checked at compile time:
createUser.mutate({
  name: "Alice",
  email: "alice@example.com",
  age: 25, // TypeScript error if not a number
});

// Response is also fully typed
createUser.data?.id // TypeScript knows this exists and is a number
```

## 🚀 Performance Optimizations

### HTTP Request Batching
tRPC automatically batches multiple queries into a single HTTP request:

```typescript
// These three queries will be batched into one HTTP request
const user1 = trpc.lessons.getUser.useQuery({ id: 1 });
const user2 = trpc.lessons.getUser.useQuery({ id: 2 });
const user3 = trpc.lessons.getUser.useQuery({ id: 3 });
```

### React Query Integration
We leverage React Query's caching and background refetching:

```typescript
const { data: stats } = trpc.lessons.getStats.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  refetchOnWindowFocus: false, // Don't refetch on focus
});
```

## 🔧 Development Experience

### Hot Reloading
Changes to tRPC procedures automatically trigger TypeScript compilation and hot reload in development.

### IntelliSense
Full autocomplete and type checking across the entire stack:
- Procedure names
- Input/output shapes
- Error types
- Available methods (.useQuery, .useMutation, etc.)

### Error Messages
Clear error messages at compile time and runtime:
- TypeScript errors for type mismatches
- Zod validation errors with custom messages
- tRPC error codes for different failure types

## 📦 Build Output

When building for production:

1. **Type Generation**: TypeScript generates type definitions from our tRPC router
2. **Tree Shaking**: Only used procedures are included in the client bundle
3. **Serialization**: Automatic JSON serialization/deserialization
4. **Bundle Splitting**: tRPC code is properly split across chunks

## 🎯 Key Benefits We Experience

1. **Type Safety**: Catch errors at compile time, not runtime
2. **Developer Experience**: Excellent IntelliSense and refactoring support
3. **Performance**: Automatic batching and caching
4. **Simplicity**: No need to write separate API schemas or client SDKs
5. **Flexibility**: Easy to add new procedures and modify existing ones

## 🔄 Comparison with Traditional REST

Instead of this traditional approach:
```typescript
// REST API route
app.get('/api/users/:id', (req, res) => {
  const user = getUser(req.params.id);
  res.json(user);
});

// Client-side fetch with no type safety
const response = await fetch(`/api/users/${id}`);
const user = await response.json(); // any type 😞
```

We get this with tRPC:
```typescript
// tRPC procedure
getUser: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(({ input }) => getUser(input.id)),

// Client usage with full type safety
const { data: user } = trpc.lessons.getUser.useQuery({ id }); // fully typed! 🎉
```

This demonstrates tRPC's power: **reducing boilerplate while increasing type safety and developer experience**.

---

*This documentation shows how we practice what we preach - using tRPC to build the very application that teaches tRPC! 🚀* 