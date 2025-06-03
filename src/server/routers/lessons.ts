import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import type { Context } from '../context';
import { getAllLessons, getLessonContent } from '@/lib/markdown-server';

const t = initTRPC.context<Context>().create();

export const lessonsRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query(({ input }) => {
      const name = input?.name ?? 'World';
      return `Hello, ${name}!`;
    }),
  
  getAllLessons: t.procedure.query(() => {
    return getAllLessons();
  }),

  getLessonContent: t.procedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => {
      const content = getLessonContent(input.slug);
      if (!content) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Lesson "${input.slug}" not found`,
        });
      }
      return content;
    }),

  // Lesson 2: Queries
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
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      
      return user;
    }),

  // Lesson 3: Mutations
  likePost: t.procedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random failure (10% chance)
      if (Math.random() < 0.1) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to like post',
        });
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

  // Lesson 4: Validation
  createUser: t.procedure
    .input(z.object({
      email: z.string()
        .email('Invalid email format')
        .min(5, 'Email too short'),
      
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain uppercase letter')
        .regex(/[a-z]/, 'Password must contain lowercase letter')
        .regex(/[0-9]/, 'Password must contain a number'),
      
      age: z.number()
        .min(13, 'Must be at least 13 years old')
        .max(120, 'Age seems unrealistic'),
      
      username: z.string()
        .min(3, 'Username too short')
        .max(20, 'Username too long')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .refine(
          (username) => !['admin', 'root', 'system'].includes(username.toLowerCase()),
          'Username is reserved'
        ),
    }))
    .mutation(({ input }) => {
      // Simulate checking if email exists
      const existingEmails = ['admin@example.com', 'user@example.com'];
      
      if (existingEmails.includes(input.email)) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already registered',
        });
      }
      
      return {
        id: Math.floor(Math.random() * 1000),
        email: input.email,
        username: input.username,
        age: input.age,
        createdAt: new Date().toISOString(),
        message: 'User created successfully!'
      };
    }),

  // Lesson 5: Error Handling
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

  // Lesson 6: Batching & Caching
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
}); 