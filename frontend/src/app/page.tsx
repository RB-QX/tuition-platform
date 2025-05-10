'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'OK' | 'error' | 'checking'>('checking');

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
      .then(r => r.text())
      .then(() => setBackendStatus('OK'))
      .catch(() => setBackendStatus('error'));
  }, [user, router]);

  if (user) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-50 p-24">
      <div className="flex flex-col items-center gap-12 max-w-2xl text-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Welcome to
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Tuition Platform
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Empowering Educators and Students Worldwide
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-lg shadow-sm">
            <span className="text-lg font-medium text-gray-700">
              Service Status:
            </span>
            <div className="flex items-center gap-2">
              {backendStatus === 'checking' && (
                <svg
                  className="w-5 h-5 text-yellow-500 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {backendStatus === 'OK' && (
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {backendStatus === 'error' && (
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span
                className={`text-lg font-semibold ${
                  backendStatus === 'OK'
                    ? 'text-green-600'
                    : backendStatus === 'error'
                    ? 'text-red-600'
                    : 'text-yellow-500'
                }`}
              >
                {backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1)}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="group flex items-center gap-2 px-8 py-4 text-lg font-medium text-white transition-all transform bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>

        {backendStatus === 'error' && (
          <p className="max-w-md text-red-600">
            We're experiencing temporary service interruptions. Please try
            again later or contact support if the problem persists.
          </p>
        )}
      </div>
    </main>
  );
}