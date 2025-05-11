'use client';
import { useAuth } from '@/context/AuthContext';
import { fetchClasses, createClass, Class } from '@/app/lib/class';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClassesPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Class[]>([]);
  const [form, setForm] = useState({        // admin form
    title: '', description: '', startAt: '', durationMinutes: 60
  });
  const router = useRouter();

  useEffect(() => {
    if (!user) return router.replace('/login');
    (async () => setList(await fetchClasses()))();
  }, [user, router]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    await createClass(form as any);
    setForm({ title: '', description: '', startAt: '', durationMinutes: 60 });
    setList(await fetchClasses());
  };

  if (!user) return null;

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Upcoming Classes</h1>

      {/* admin create form (simple role check by email for demo) */}
      {user.email === 'admin@demo.com' && (
        <form onSubmit={onSubmit} className="space-y-2 border p-4 rounded">
          <h2 className="font-semibold">Create Class (Admin)</h2>
          <input className="border p-1 w-full"
            placeholder="Title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea className="border p-1 w-full"
            placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <input type="datetime-local" className="border p-1 w-full"
            value={form.startAt}
            onChange={e => setForm({ ...form, startAt: e.target.value })} required />
          <input type="number" min={15} max={240} className="border p-1 w-full"
            value={form.durationMinutes}
            onChange={e => setForm({ ...form, durationMinutes: +e.target.value })} required />
          <button className="btn btn-primary w-full" type="submit">Create</button>
        </form>
      )}

      <ul className="space-y-4">
        {list.map(c => (
          <li key={c.id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold">{c.title}</h3>
            <p>{new Date(c.startAt).toLocaleString()} · {c.durationMinutes} min</p>
            {c.description && <p>{c.description}</p>}
            <a href={c.meetLink} target="_blank" rel="noreferrer"
               className="text-blue-600 underline">Join Meet</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
