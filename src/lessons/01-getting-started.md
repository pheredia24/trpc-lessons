---
slug: getting-started
order: 1
title: Getting Started
---

### Goal
Create a minimal tRPC procedure that returns `"hello"`.

```ts
// server/routers/lessons.ts (inside this lesson)
export const lessonsRouter = t.router({
  hello: t.procedure.query(() => 'hello'),
});
```

### Exercise

1. Modify the `hello` procedure to accept a `name`.
2. Update the playground to allow editing the input.

### Solution

The `hello` procedure should accept a name parameter and return a personalized greeting:

```ts
hello: t.procedure
  .input(z.object({ name: z.string().optional() }).optional())
  .query(({ input }) => {
    const name = input?.name ?? 'World';
    return `Hello, ${name}!`;
  }),
```

This procedure:
- Uses Zod for input validation
- Makes the input optional with a default value
- Returns a personalized greeting

Try it in the playground below! 