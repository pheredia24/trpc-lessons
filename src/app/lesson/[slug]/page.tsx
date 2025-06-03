'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/server/trpc';

interface LessonPageProps {
  params: {
    slug: string;
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Lessons
        </Link>
      </div>

      <LessonContent slug={params.slug} />
      <Playground slug={params.slug} />
    </div>
  );
}

function LessonContent({ slug }: { slug: string }) {
  const lessonTitles = {
    'getting-started': 'Getting Started',
    'queries': 'Queries - Reading Data',
    'mutations': 'Mutations - Changing Data',
    'validation': 'Validation - Input Safety',
    'error-handling': 'Error Handling - Graceful Failures',
    'batching-caching': 'Batching & Caching - Performance Optimization',
    'middleware-auth': 'Middleware & Auth - Securing Procedures',
    'subscriptions': 'Subscriptions - Real-time Updates',
    'server-components': 'React Server Components - Server-Side Data',
    'deploy': 'Deploy - Going to Production',
  };

  const title = lessonTitles[slug as keyof typeof lessonTitles] || 'Unknown Lesson';

  return (
    <div className="prose max-w-none mb-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <p className="text-blue-800 font-medium mb-2">
          📚 Lesson Content
        </p>
        <p className="text-blue-700">
          This lesson covers {title.toLowerCase()}. The content would be dynamically loaded from 
          the markdown files in <code>src/lessons/{slug}.md</code>.
        </p>
        <p className="text-blue-700 mt-2">
          In a complete implementation, we would parse the markdown files and render the content here.
          For now, try the interactive playground below to explore the tRPC procedures!
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-green-800 font-medium mb-2">What you'll learn:</h3>
        <div className="text-green-700 text-sm">
          {slug === 'getting-started' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Basic tRPC procedure creation</li>
              <li>Input validation with Zod</li>
              <li>Type safety from server to client</li>
            </ul>
          )}
          {slug === 'queries' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Data fetching with tRPC queries</li>
              <li>Error handling for missing data</li>
              <li>Parameter passing and validation</li>
            </ul>
          )}
          {slug === 'mutations' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Data modification with mutations</li>
              <li>Optimistic updates</li>
              <li>Cache invalidation patterns</li>
            </ul>
          )}
          {slug === 'validation' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Advanced Zod schema patterns</li>
              <li>Custom validation rules</li>
              <li>Error message handling</li>
            </ul>
          )}
          {slug === 'error-handling' && (
            <ul className="list-disc list-inside space-y-1">
              <li>tRPC error types and codes</li>
              <li>Graceful error handling in UI</li>
              <li>Custom error messages</li>
            </ul>
          )}
          {slug === 'batching-caching' && (
            <ul className="list-disc list-inside space-y-1">
              <li>HTTP request batching</li>
              <li>React Query cache strategies</li>
              <li>Performance optimization</li>
            </ul>
          )}
          {(slug === 'middleware-auth' || slug === 'subscriptions' || slug === 'server-components' || slug === 'deploy') && (
            <p>Advanced topics for production-ready applications</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Playground({ slug }: { slug: string }) {
  if (slug === 'getting-started') {
    return <HelloPlayground />;
  }
  
  if (slug === 'queries') {
    return <QueriesPlayground />;
  }
  
  if (slug === 'mutations') {
    return <MutationsPlayground />;
  }
  
  if (slug === 'validation') {
    return <ValidationPlayground />;
  }
  
  if (slug === 'error-handling') {
    return <ErrorHandlingPlayground />;
  }
  
  if (slug === 'batching-caching') {
    return <BatchingCachingPlayground />;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Interactive Playground
      </h3>
      <p className="text-gray-600">
        Playground for "{slug}" coming soon! This lesson covers advanced topics.
      </p>
    </div>
  );
}

function HelloPlayground() {
  const [inputName, setInputName] = useState('');
  
  const { data: greeting, isLoading, refetch } = trpc.lessons.hello.useQuery(
    { name: inputName || undefined },
    { enabled: false }
  );

  const handleTest = () => {
    refetch();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Interactive Playground - Hello Procedure
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name (optional):
          </label>
          <input
            id="name"
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter a name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleTest}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Test Hello Procedure'}
        </button>

        {greeting && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">Result:</h4>
            <pre className="text-sm text-green-700">
              <code>{JSON.stringify(greeting, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function QueriesPlayground() {
  const [userId, setUserId] = useState(1);
  
  const { data: user, isLoading, error, refetch } = trpc.lessons.getUser.useQuery(
    { id: userId },
    { enabled: false }
  );

  const handleTest = () => {
    refetch();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Interactive Playground - User Query
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
            User ID:
          </label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1 (Alice - Admin)</option>
            <option value={2}>2 (Bob - User)</option>
            <option value={3}>3 (Charlie - User)</option>
            <option value={99}>99 (Non-existent user)</option>
          </select>
        </div>

        <button
          onClick={handleTest}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Get User'}
        </button>

        {user && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">User Found:</h4>
            <pre className="text-sm text-green-700">
              <code>{JSON.stringify(user, null, 2)}</code>
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Error:</h4>
            <pre className="text-sm text-red-700">
              <code>{error.message}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function MutationsPlayground() {
  const [postId, setPostId] = useState(1);
  
  const likePostMutation = trpc.lessons.likePost.useMutation();

  const handleLike = () => {
    likePostMutation.mutate({ postId });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Interactive Playground - Like Post Mutation
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="postId" className="block text-sm font-medium text-gray-700 mb-2">
            Post ID:
          </label>
          <input
            id="postId"
            type="number"
            value={postId}
            onChange={(e) => setPostId(Number(e.target.value))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleLike}
          disabled={likePostMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {likePostMutation.isPending ? 'Liking...' : '👍 Like Post'}
        </button>

        {likePostMutation.data && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">Success:</h4>
            <pre className="text-sm text-green-700">
              <code>{JSON.stringify(likePostMutation.data, null, 2)}</code>
            </pre>
          </div>
        )}

        {likePostMutation.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Error:</h4>
            <pre className="text-sm text-red-700">
              <code>{likePostMutation.error.message}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function ValidationPlayground() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    age: 25,
    username: '',
  });
  
  const createUserMutation = trpc.lessons.createUser.useMutation();

  const handleSubmit = () => {
    createUserMutation.mutate(formData);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Interactive Playground - User Registration
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email:
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="user@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password:
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Password123"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username:
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="john_doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age:
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: Number(e.target.value) }))}
            min="13"
            max="120"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={createUserMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createUserMutation.isPending ? 'Creating...' : 'Create User'}
        </button>

        {createUserMutation.data && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">User Created:</h4>
            <pre className="text-sm text-green-700">
              <code>{JSON.stringify(createUserMutation.data, null, 2)}</code>
            </pre>
          </div>
        )}

        {createUserMutation.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Validation Error:</h4>
            <pre className="text-sm text-red-700">
              <code>{createUserMutation.error.message}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorHandlingPlayground() {
  const [deleteData, setDeleteData] = useState({
    postId: 1,
    userId: 1,
  });
  
  const deletePostMutation = trpc.lessons.deletePost.useMutation();

  const handleDelete = () => {
    deletePostMutation.mutate(deleteData);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Interactive Playground - Error Scenarios
      </h3>
      
      <div className="space-y-4">
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <p className="text-yellow-800 text-sm">
            <strong>Test scenarios:</strong> Try postId=13 (server error), postId=101 (not found), userId=3 (unauthorized)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post ID:
          </label>
          <input
            type="number"
            value={deleteData.postId}
            onChange={(e) => setDeleteData(prev => ({ ...prev, postId: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID (1,2=admin, others=regular user):
          </label>
          <select
            value={deleteData.userId}
            onChange={(e) => setDeleteData(prev => ({ ...prev, userId: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1 (Admin - Can delete)</option>
            <option value={2}>2 (Admin - Can delete)</option>
            <option value={3}>3 (Regular user - Cannot delete)</option>
          </select>
        </div>

        <button
          onClick={handleDelete}
          disabled={deletePostMutation.isPending}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deletePostMutation.isPending ? 'Deleting...' : '🗑️ Delete Post'}
        </button>

        {deletePostMutation.data && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">Success:</h4>
            <pre className="text-sm text-green-700">
              <code>{JSON.stringify(deletePostMutation.data, null, 2)}</code>
            </pre>
          </div>
        )}

        {deletePostMutation.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Error ({deletePostMutation.error.data?.code}):
            </h4>
            <pre className="text-sm text-red-700">
              <code>{deletePostMutation.error.message}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function BatchingCachingPlayground() {
  const [userId, setUserId] = useState(1);
  
  // Multiple simultaneous queries to demonstrate batching
  const statsQuery = trpc.lessons.getDashboardStats.useQuery();
  const activityQuery = trpc.lessons.getUserActivity.useQuery({ userId });
  const postsQuery = trpc.lessons.getRecentPosts.useQuery({ limit: 5 });
  const healthQuery = trpc.lessons.getSystemHealth.useQuery();

  const refetchAll = () => {
    statsQuery.refetch();
    activityQuery.refetch();
    postsQuery.refetch();
    healthQuery.refetch();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Interactive Playground - Batching & Caching
      </h3>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <p className="text-blue-800 text-sm">
            <strong>Open DevTools Network tab</strong> and click "Load All Data" to see batched requests!
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID for activity:
          </label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={refetchAll}
          disabled={statsQuery.isLoading || activityQuery.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📊 Load All Data (Watch Network Tab!)
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded border">
            <h5 className="font-medium text-gray-800 mb-2">📈 Dashboard Stats</h5>
            {statsQuery.data && (
              <pre className="text-xs text-gray-600">
                <code>{JSON.stringify(statsQuery.data, null, 2)}</code>
              </pre>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded border">
            <h5 className="font-medium text-gray-800 mb-2">👤 User Activity</h5>
            {activityQuery.data && (
              <pre className="text-xs text-gray-600">
                <code>{JSON.stringify(activityQuery.data, null, 2)}</code>
              </pre>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded border">
            <h5 className="font-medium text-gray-800 mb-2">📝 Recent Posts</h5>
            {postsQuery.data && (
              <div className="text-xs text-gray-600">
                {postsQuery.data.slice(0, 3).map(post => (
                  <div key={post.id}>{post.title} - {post.likes} likes</div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded border">
            <h5 className="font-medium text-gray-800 mb-2">🏥 System Health</h5>
            {healthQuery.data && (
              <pre className="text-xs text-gray-600">
                <code>{JSON.stringify(healthQuery.data, null, 2)}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 