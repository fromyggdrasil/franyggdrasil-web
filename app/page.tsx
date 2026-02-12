'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Skickar...');
    try {
      await fetch('https://n8n.fromyggdrasil.com/webhook/8b3b3fee-a056-43bd-b051-57a4e09f1ff6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus('Tack!');
      setEmail('');
    } catch {
      setStatus('Fel');
    }
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 text-slate-100">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl text-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-widest bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">SKRIKET</h1>
            <p className="text-2xl sm:text-3xl md:text-5xl text-amber-400">från</p>
            <h2 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-widest bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">YGGDRASIL</h2>
          </div>
          <p className="text-base sm:text-lg text-emerald-200">En nordisk fantasysaga där myter vaknar till liv</p>
          <p className="text-sm sm:text-base text-amber-500">Eskil Larsson & CG Martini</p>
          <Link href="/wiki" className="inline-block px-6 py-3 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-100 transition-colors">Utforska Wiki</Link>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Din email" required className="flex-1 px-6 py-3 bg-slate-900 border border-amber-600 rounded-lg text-base" />
              <button type="submit" className="px-8 py-3 bg-amber-700 hover:bg-amber-600 rounded-lg text-base whitespace-nowrap">Meddela mig</button>
            </div>
            {status && <p className="text-emerald-400">{status}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}