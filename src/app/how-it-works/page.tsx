'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Lessons
        </Link>
      </div>

      <div className="prose max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          🔍 How We Use tRPC in This App
        </h1>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            🎯 Meta-Learning: tRPC Teaching tRPC
          </h2>
          <p className="text-blue-700">
            This tRPC lessons app is itself built with tRPC! By examining our own implementation, 
            you can see tRPC patterns in action in a real-world application. We practice what we preach! 🚀
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">⚙️ What You'll See</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Complete tRPC setup with Next.js 14</li>
              <li>• Real procedure implementations</li>
              <li>• Type-safe client-server communication</li>
              <li>• Interactive playground components</li>
              <li>• Error handling patterns</li>
              <li>• Performance optimizations</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🛠️ tRPC-Related Changes</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Added tRPC dependencies to package.json</li>
              <li>• Modified .gitignore for tRPC cache</li>
              <li>• Updated tsconfig.json for path aliases</li>
              <li>• Configured Next.js for API routes</li>
              <li>• Set up React Query providers</li>
              <li>• Created tRPC router structure</li>
            </ul>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🏗️ Application Architecture</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <pre className="text-sm overflow-x-auto">
{`src/
├── app/                    # Next.js 14 App Router
│   ├── api/trpc/[trpc]/   # tRPC API route handler
│   ├── lesson/[slug]/     # Dynamic lesson pages
│   ├── how-it-works/      # This documentation page
│   └── layout.tsx         # Root layout with tRPC providers
├── server/                # tRPC server-side code
│   ├── routers/          # tRPC procedure definitions
│   ├── context.ts        # Request context creation
│   └── trpc.ts          # Client-side tRPC setup
└── lessons/              # Markdown lesson content`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔧 tRPC Server Setup</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Core Configuration</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre>
{`// src/server/trpc.ts
import { initTRPC } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Router Organization</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre>
{`// src/server/routers/_app.ts
import { router } from '../trpc';
import { lessonsRouter } from './lessons';

export const appRouter = router({
  lessons: lessonsRouter,
});

export type AppRouter = typeof appRouter;`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Example Procedures</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre>
{`// src/server/routers/lessons.ts
export const lessonsRouter = router({
  // Basic procedure for "Getting Started" lesson
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => ({
      message: \`Hello \${input.name ?? 'World'}!\`,
      timestamp: new Date().toISOString(),
    })),

  // Query with error handling
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

  // Mutation with random failures
  likePost: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(({ input }) => {
      if (Math.random() < 0.3) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to like post',
        });
      }
      return { success: true, likes: Math.floor(Math.random() * 100) };
    }),
});`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🌐 Next.js Integration</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">API Route Handler</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre>
{`// src/app/api/trpc/[trpc]/route.ts
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

export { handler as GET, handler as POST };`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Provider Setup</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre>
{`// src/app/layout.tsx (simplified)
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎮 Interactive Playground Examples</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Query Example</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre>
{`function QueriesPlayground() {
  const [userId, setUserId] = useState(1);
  
  // tRPC query with manual triggering
  const { data: user, isLoading, error, refetch } = 
    trpc.lessons.getUser.useQuery(
      { id: userId },
      { enabled: false } // Manual control
    );

  return (
    <div>
      <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
        <option value={1}>Alice</option>
        <option value={99}>Non-existent user</option>
      </select>
      
      <button onClick={() => refetch()}>Get User</button>
      
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}`}
              </pre>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Mutation Example</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre>
{`function MutationsPlayground() {
  const [postId, setPostId] = useState(1);
  
  // tRPC mutation with loading states
  const likeMutation = trpc.lessons.likePost.useMutation({
    onSuccess: (data) => console.log('Post liked!', data),
    onError: (error) => console.error('Failed:', error.message),
  });

  return (
    <div>
      <input 
        type="number" 
        value={postId} 
        onChange={(e) => setPostId(Number(e.target.value))} 
      />
      
      <button 
        onClick={() => likeMutation.mutate({ postId })}
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
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🛡️ Type Safety in Action</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Server-Side Types</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre>
{`// Input validation with Zod
const createUserInput = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(13, 'Must be 13+'),
});

// Procedure with typed input/output
createUser: publicProcedure
  .input(createUserInput)
  .mutation(({ input }) => {
    // input is fully typed!
    return {
      id: Math.random(),
      ...input,
      createdAt: new Date(),
    };
  }),`}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Client-Side Types</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre>
{`// TypeScript knows exact shapes
const createUser = 
  trpc.lessons.createUser.useMutation();

// Type-checked at compile time:
createUser.mutate({
  name: "Alice",
  email: "alice@example.com",
  age: 25, // Error if not number
});

// Response is fully typed
createUser.data?.id // TS knows this exists`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📂 Configuration Changes</h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">package.json Dependencies</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre>
{`{
  "dependencies": {
    "@trpc/client": "^11.2.0",
    "@trpc/react-query": "^11.2.0", 
    "@trpc/server": "^11.2.0",
    "@tanstack/react-query": "^5.79.2",
    "zod": "^3.22.4"
  }
}`}
                </pre>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">tsconfig.json Path Aliases</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre>
{`{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`}
                </pre>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">.gitignore Additions</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre>
{`# tRPC and development cache
.turbo

# Next.js
.next/
out/
build/
dist/`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Performance Optimizations</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">HTTP Request Batching</h3>
              <p className="text-gray-600 mb-3">
                tRPC automatically batches multiple queries into a single HTTP request:
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                <pre className="text-sm">
{`// These queries batch together
const user1 = trpc.lessons.getUser.useQuery({id: 1});
const user2 = trpc.lessons.getUser.useQuery({id: 2});
const user3 = trpc.lessons.getUser.useQuery({id: 3});`}
                </pre>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">React Query Caching</h3>
              <p className="text-gray-600 mb-3">
                Leverage React Query's powerful caching:
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                <pre className="text-sm">
{`const { data } = trpc.lessons.getStats.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // Fresh for 5 min
  cacheTime: 10 * 60 * 1000, // Cache for 10 min
  refetchOnWindowFocus: false,
});`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Key Benefits We Experience</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Development Experience</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ <strong>Type Safety:</strong> Catch errors at compile time</li>
                <li>✅ <strong>IntelliSense:</strong> Full autocomplete across the stack</li>
                <li>✅ <strong>Hot Reloading:</strong> Changes trigger TypeScript compilation</li>
                <li>✅ <strong>Refactoring:</strong> Rename procedures safely</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Runtime Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li>🚀 <strong>Performance:</strong> Automatic batching and caching</li>
                <li>🛡️ <strong>Validation:</strong> Zod schemas ensure data integrity</li>
                <li>📦 <strong>Bundle Size:</strong> Tree shaking removes unused code</li>
                <li>🔄 <strong>Simplicity:</strong> No REST boilerplate needed</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-3">
            🎓 Ready to Learn?
          </h2>
          <p className="text-green-700 mb-4">
            Now that you've seen how we use tRPC in this very application, you're ready to dive into the lessons 
            and build your own tRPC applications with confidence!
          </p>
          <Link 
            href="/" 
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Start Learning tRPC →
          </Link>
        </div>
      </div>
    </div>
  );
} 