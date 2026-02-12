'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WikiEntry {
  kategori: string;
  titel: string;
  innehall: string;
  datum: string;
  spoiler: string;
}

const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || '';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function WikiPage() {
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(SHEET_URL);
        const data = await res.json();
        setEntries(data);
      } catch {
        setEntries([]);
      }
      setLoading(false);
    }
    if (SHEET_URL) fetchData();
    else setLoading(false);
  }, []);

  const filtered = showSpoilers ? entries : entries.filter(e => e.spoiler?.toLowerCase() !== 'ja');

  const categories = [...new Set(filtered.map(e => e.kategori))];

  const displayed = activeCategory ? filtered.filter(e => e.kategori === activeCategory) : filtered;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 text-slate-100">
      <nav className="border-b border-amber-800/30 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-amber-400 font-bold text-lg hover:text-amber-300">Skriket från Yggdrasil</Link>
          <Link href="/wiki" className="text-amber-500 hover:text-amber-400">Wiki</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">Wiki</h1>
          <button
            onClick={() => setShowSpoilers(!showSpoilers)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showSpoilers ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'}`}
          >
            {showSpoilers ? 'Spoilers VISAS' : 'Spoilers DOLDA'}
          </button>
        </div>

        {loading ? (
          <p className="text-slate-400">Laddar...</p>
        ) : entries.length === 0 ? (
          <p className="text-slate-400">Inga artiklar hittades. Kontrollera att Google Sheets-länken är konfigurerad.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${!activeCategory ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Alla
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${activeCategory === cat ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((entry, i) => (
                <Link
                  key={i}
                  href={`/wiki/${slugify(entry.titel)}`}
                  className="block p-5 bg-slate-800/50 border border-amber-900/30 rounded-lg hover:border-amber-600/50 transition-colors"
                >
                  <span className="text-xs uppercase tracking-wider text-amber-600">{entry.kategori}</span>
                  <h2 className="text-lg font-semibold text-amber-300 mt-1">{entry.titel}</h2>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{entry.innehall}</p>
                  {entry.spoiler?.toLowerCase() === 'ja' && (
                    <span className="inline-block mt-2 text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">Spoiler</span>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
