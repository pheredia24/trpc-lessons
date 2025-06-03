# tRPC Learning App

A hands-on learning application for mastering tRPC (TypeScript Remote Procedure Call).

## Features

- 📚 Step-by-step lessons with clear explanations
- 🛝 Interactive playground for testing tRPC procedures
- 🎯 Practical exercises with solutions
- 🔧 Modern tech stack: Next.js 14, React 18, TypeScript, Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone or initialize the project**
   ```bash
   # If starting fresh, create a new directory
   mkdir trpc-learning-app
   cd trpc-learning-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
.
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout with tRPC providers
│   │   ├── page.tsx          # Home page with lesson list
│   │   ├── lesson/[slug]/    # Dynamic lesson pages
│   │   └── api/trpc/         # tRPC API routes
│   ├── server/               # tRPC server setup
│   │   ├── context.ts        # Request context
│   │   ├── trpc.ts          # tRPC React client
│   │   └── routers/         # tRPC route definitions
│   ├── lessons/             # Markdown lesson content
│   └── styles/              # Global CSS
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## How It Works

### tRPC Setup

The app demonstrates a complete tRPC setup:

1. **Server Setup**: tRPC router with procedures in `src/server/routers/`
2. **Client Setup**: React Query integration with tRPC hooks
3. **API Routes**: Next.js API routes handling tRPC requests
4. **Type Safety**: End-to-end TypeScript types

📖 **Deep Dive**: See [`docs/trpc-in-our-app.md`](./docs/trpc-in-our-app.md) for a comprehensive explanation of how we use tRPC in this very application!

### Learning Flow

1. **Browse Lessons**: Start at the homepage to see available lessons
2. **Follow Along**: Each lesson includes explanations, code examples, and exercises
3. **Practice**: Use the interactive playground to test procedures
4. **Experiment**: Modify inputs and see real-time results

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: TanStack React Query
- **RPC**: tRPC v11
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Learning from Our Implementation

This tRPC lessons app is itself built with tRPC! 🎯

- ✅ **Real-world patterns**: See how we structure routers, handle errors, and manage state
- ✅ **Best practices**: Learn from our provider setup, type safety patterns, and performance optimizations
- ✅ **Interactive examples**: Every playground component demonstrates tRPC concepts in action
- ✅ **End-to-end type safety**: Experience the full power of TypeScript + tRPC integration

**Want to see how it works under the hood?** Check out our detailed technical documentation: [`docs/trpc-in-our-app.md`](./docs/trpc-in-our-app.md)

## Adding New Lessons

To add a new lesson:

1. Create a markdown file in `src/lessons/`
2. Add lesson metadata (frontmatter)
3. Update the lessons router to include the new lesson
4. Create the lesson page component

Example lesson structure:
```markdown
---
slug: new-lesson
order: 2
title: New Lesson Title
---

### Goal
What the student will learn...

### Exercise
Steps to complete...

### Solution
Working implementation...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your lesson or improvement
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for educational purposes.

---

Happy learning! 🚀 