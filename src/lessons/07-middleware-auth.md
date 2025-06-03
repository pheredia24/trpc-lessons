---
slug: middleware-auth
order: 7
title: Middleware & Auth - Securing Procedures
---

### Why Now?
Now that CRUD is flowing, lock down sensitive procedures.

### Real-life Scenario
Only the owner may update their profile; guests see 401.

### Goal
Write an `isAuthed` middleware, attach it, and test both success and failure paths.

### What You'll Learn
- Creating reusable middleware functions
- Authentication patterns in tRPC
- Context manipulation and user injection
- Authorization vs Authentication

### Exercise

1. Create authentication middleware
2. Build protected procedures
3. Implement role-based access control
4. Test authentication flows

### Example Implementation

```ts
// Enhanced context with user authentication
export async function createContext({ req }: { req: Request }) {
  // Extract token from Authorization header
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  
  let user = null;
  if (token) {
    // Simulate token verification (in real app, verify JWT)
    const users = [
      { id: 1, email: 'admin@example.com', role: 'admin', name: 'Admin User' },
      { id: 2, email: 'user@example.com', role: 'user', name: 'Regular User' },
    ];
    
    // Simple token simulation: token = user id
    const userId = parseInt(token);
    user = users.find(u => u.id === userId);
  }
  
  return { user };
}

// Middleware definitions
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Type-safe user is now guaranteed
    },
  });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }
  
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin privileges required',
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Protected procedures
const protectedProcedure = t.procedure.use(isAuthed);
const adminProcedure = t.procedure.use(isAdmin);

// Example protected routes
getUserProfile: protectedProcedure.query(({ ctx }) => {
  return {
    id: ctx.user.id,
    email: ctx.user.email,
    name: ctx.user.name,
    role: ctx.user.role,
    lastLogin: new Date().toISOString(),
  };
}),

updateProfile: protectedProcedure
  .input(z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
  }))
  .mutation(({ input, ctx }) => {
    // Only allow users to update their own profile
    return {
      id: ctx.user.id,
      name: input.name,
      email: input.email,
      role: ctx.user.role,
      updatedAt: new Date().toISOString(),
      message: 'Profile updated successfully',
    };
  }),

deleteUser: adminProcedure
  .input(z.object({ userId: z.number() }))
  .mutation(({ input, ctx }) => {
    // Prevent admin from deleting themselves
    if (input.userId === ctx.user.id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot delete your own account',
      });
    }
    
    return {
      success: true,
      message: `User ${input.userId} deleted successfully`,
      deletedBy: ctx.user.id,
    };
  }),

getAllUsers: adminProcedure.query(({ ctx }) => {
  return [
    { id: 1, email: 'admin@example.com', role: 'admin', name: 'Admin User' },
    { id: 2, email: 'user@example.com', role: 'user', name: 'Regular User' },
    { id: 3, email: 'guest@example.com', role: 'user', name: 'Guest User' },
  ];
}),
```

### Client-Side Authentication

```tsx
// Custom hook for managing auth tokens
function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  
  const login = (userId: number) => {
    const token = userId.toString(); // Simplified token
    setToken(token);
    localStorage.setItem('token', token);
  };
  
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };
  
  return { token, login, logout };
}

// tRPC client with auth headers
const [trpcClient] = useState(() =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers: () => {
          const token = localStorage.getItem('token');
          return token ? { authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  })
);
```

### Key Concepts
- **Middleware**: Reusable logic that runs before procedures
- **Context Enhancement**: Adding authenticated user to context
- **Protected Procedures**: Procedures that require authentication
- **Role-Based Access**: Different permissions for different users

### Security Best Practices
- Always validate tokens server-side
- Use HTTPS in production
- Implement token expiration
- Rate limit authentication attempts
- Log security events
- Sanitize user inputs

### Common Auth Patterns
- **JWT Tokens**: Stateless authentication
- **Session Cookies**: Server-side session management
- **API Keys**: Service-to-service authentication
- **OAuth**: Third-party authentication

Test authentication flows in the playground below! 