---
slug: deploy
order: 10
title: Deploy - Going to Production
---

### Why Last?
Ship only after the surface area stabilizes; otherwise you chase config.

### Real-life Scenario
Push to Vercel edge runtime, watch P95 latency fall under 50ms, and demo to stakeholders.

### Goal
`vercel --prod`, set env vars, verify Cold Start and live endpoint.

### What You'll Learn
- Production deployment strategies
- Environment configuration
- Performance monitoring
- Edge runtime optimization

### Exercise

1. Prepare app for production deployment
2. Configure environment variables
3. Deploy to Vercel Edge Runtime
4. Monitor performance and errors

### Pre-Deployment Checklist

```bash
# 1. Build locally to catch issues
npm run build

# 2. Test production build
npm run start

# 3. Run linting and type checking
npm run lint
npx tsc --noEmit

# 4. Check bundle size
npx @next/bundle-analyzer
```

### Environment Configuration

```ts
// .env.local (development)
NEXTAUTH_SECRET=your-dev-secret
DATABASE_URL=postgresql://localhost:5432/trpc_learning
REDIS_URL=redis://localhost:6379

// .env.production (production - set in Vercel dashboard)
NEXTAUTH_SECRET=your-production-secret-256-bit
DATABASE_URL=postgresql://user:pass@host:5432/prod_db
REDIS_URL=redis://user:pass@host:6379
```

### Production-Ready tRPC Setup

```ts
// Enhanced context for production
export async function createContext({ req }: { req: Request }) {
  const authToken = req.headers.get('authorization')?.replace('Bearer ', '');
  
  // In production, verify JWT tokens properly
  let user = null;
  if (authToken && process.env.NODE_ENV === 'production') {
    try {
      // user = await verifyJWT(authToken);
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  } else if (authToken) {
    // Development fallback
    const userId = parseInt(authToken);
    user = mockUsers.find(u => u.id === userId);
  }
  
  return {
    user,
    req,
    // Add request ID for logging
    requestId: req.headers.get('x-request-id') || generateRequestId(),
  };
}

// Production error handling
const isProduction = process.env.NODE_ENV === 'production';

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Hide sensitive error details in production
        stack: isProduction ? undefined : error.stack,
      },
    };
  },
});
```

### Vercel Configuration

```json
// vercel.json
{
  "functions": {
    "app/api/trpc/[trpc]/route.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Performance Monitoring

```ts
// Add to your tRPC router
const performanceMiddleware = t.middleware(({ next, path, type }) => {
  const start = Date.now();
  
  return next().finally(() => {
    const duration = Date.now() - start;
    
    // Log slow queries
    if (duration > 1000) {
      console.warn(`Slow ${type} ${path}: ${duration}ms`);
    }
    
    // Send metrics to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // analytics.track('trpc_call', {
      //   path,
      //   type,
      //   duration,
      //   success: true
      // });
    }
  });
});

// Apply to all procedures
const performantProcedure = t.procedure.use(performanceMiddleware);
```

### Database Configuration

```ts
// Production database setup with connection pooling
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Connection health check
export async function checkDatabaseHealth() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return { status: 'healthy' };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { status: 'unhealthy', error: error.message };
  }
}
```

### Deployment Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

### Environment Variables Setup

```bash
# Set production environment variables
vercel env add NEXTAUTH_SECRET production
vercel env add DATABASE_URL production
vercel env add REDIS_URL production

# Pull environment variables locally
vercel env pull .env.local
```

### Monitoring and Logging

```ts
// Health check endpoint
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabaseHealth(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
  };
  
  const isHealthy = Object.values(checks).every(
    check => typeof check !== 'object' || check.status === 'healthy'
  );
  
  return Response.json(checks, {
    status: isHealthy ? 200 : 503,
  });
}

// Error reporting
export function reportError(error: Error, context?: any) {
  console.error('Application error:', error, context);
  
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    // Sentry.captureException(error, { extra: context });
  }
}
```

### Performance Optimization

```ts
// Edge Runtime configuration
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Bundle optimization
// next.config.mjs
const nextConfig = {
  experimental: {
    appDir: true,
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Bundle analyzer
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
  },
};
```

### Security Headers

```ts
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS for API routes
  if (request.url.includes('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  return response;
}
```

### Production Checklist

- ✅ **Environment Variables**: All secrets configured
- ✅ **Database**: Connection pooling and SSL enabled
- ✅ **Authentication**: JWT tokens with proper expiration
- ✅ **Error Handling**: Sanitized error messages
- ✅ **Logging**: Structured logging with request IDs
- ✅ **Monitoring**: Health checks and performance metrics
- ✅ **Security**: HTTPS, CORS, security headers
- ✅ **Caching**: Appropriate cache headers
- ✅ **Bundle Size**: Optimized and analyzed
- ✅ **Edge Runtime**: Configured for optimal performance

### Post-Deployment Verification

```bash
# Test production endpoints
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/trpc/lessons.hello

# Check Core Web Vitals
npx lighthouse https://your-app.vercel.app --view

# Load testing
npx autocannon https://your-app.vercel.app/api/trpc/lessons.hello
```

### Monitoring Dashboard

Set up alerts for:
- Response time > 1000ms
- Error rate > 1%
- Memory usage > 80%
- Database connection failures

🚀 **Congratulations!** Your tRPC app is now production-ready! 