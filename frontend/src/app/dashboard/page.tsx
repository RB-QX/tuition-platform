'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  if (!user) return null; // or a spinner

  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-3xl">Hello {user.email}</h1>
      <button onClick={logout} className="btn btn-outline">
        Log out
      </button>
    </main>
  );
}
    