'use client';

import { trpc } from '@/server/trpc';
import Link from 'next/link';

export default function HomePage() {
  const { data: lessons, isLoading } = trpc.lessons.getAllLessons.useQuery();

  if (isLoading) {
    return <div className="text-center">Loading lessons...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Learn tRPC
      </h1>
      
      <p className="text-lg text-gray-600 mb-12">
        Welcome to the tRPC learning app! Follow these lessons to master tRPC step by step.
      </p>

      <div className="grid gap-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lessons</h2>
        
        {lessons?.map((lesson) => (
          <Link 
            key={lesson.slug}
            href={`/lesson/${lesson.slug}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  {lesson.title}
                </h3>
                <p className="text-gray-500 mt-1">Lesson {lesson.order}</p>
              </div>
              <div className="text-blue-600">
                →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          Quick Test
        </h3>
        <p className="text-blue-700 mb-4">
          Try the hello procedure to make sure everything is working:
        </p>
        <HelloTest />
      </div>
    </div>
  );
}

function HelloTest() {
  const { data: greeting, isLoading } = trpc.lessons.hello.useQuery({ name: 'tRPC Learner' });
  
  if (isLoading) return <div className="text-blue-600">Loading...</div>;
  
  return (
    <div className="bg-white p-4 rounded border border-blue-200">
      <code className="text-sm text-gray-800">{greeting}</code>
    </div>
  );
} 