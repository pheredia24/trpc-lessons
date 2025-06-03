---
slug: validation
order: 4
title: Validation - Input Safety
---

### Why Now?
Inputs get messy the moment users type. Catch issues at the boundary, not deep inside handlers.

### Real-life Scenario
A registration form must reject bad emails and short passwords before hitting the DB.

### Goal
Add Zod schemas with refinements and surface client-side validation errors instantly.

### What You'll Learn
- Advanced Zod schema patterns
- Custom validation rules and refinements
- Error messages and field-level validation
- Client-side validation integration

### Exercise

1. Create a user registration procedure with complex validation
2. Implement custom validation rules
3. Handle and display validation errors
4. Test edge cases with malformed input

### Example Implementation

```ts
// In your lessons router
const createUserSchema = z.object({
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
});

createUser: t.procedure
  .input(createUserSchema)
  .mutation(({ input }) => {
    // Simulate checking if email exists
    const existingEmails = ['admin@example.com', 'user@example.com'];
    
    if (existingEmails.includes(input.email)) {
      throw new Error('Email already registered');
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
```

### Key Concepts
- **Schema Composition**: Build complex validation rules
- **Custom Refinements**: Add business logic validation
- **Error Messages**: Provide clear, actionable feedback
- **Type Safety**: Zod ensures runtime and compile-time safety

### Advanced Patterns
- **Conditional Validation**: Different rules based on other fields
- **Async Validation**: Server-side uniqueness checks
- **Transform**: Modify data during validation
- **Default Values**: Provide sensible defaults

### Common Validation Rules
- Email format and domain restrictions
- Password strength requirements
- Username availability and format
- Age and date validations
- File upload restrictions

Try the registration form below with various inputs! 