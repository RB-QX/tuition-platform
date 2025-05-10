'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('checking…');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
      .then(res => res.text())
      .then(setStatus)
      .catch(() => setStatus('error'));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center text-2xl">
      Backend status: {status}
    </main>
  );
}
