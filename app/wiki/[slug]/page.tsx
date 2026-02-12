'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function WikiArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const allForTitle = entries.filter(e => slugify(e.titel) === slug);
  const displayed = showSpoilers ? allForTitle : allForTitle.filter(e => e.spoiler?.toLowerCase() !== 'ja');
  const hasSpoilerContent = allForTitle.some(e => e.spoiler?.toLowerCase() === 'ja');
  const title = allForTitle[0]?.titel || slug;
  const kategori = allForTitle[0]?.kategori || '';

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 text-slate-100">
      <nav className="border-b border-amber-800/30 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-amber-400 font-bold text-lg hover:text-amber-300">Skriket från Yggdrasil</Link>
          <Link href="/wiki" className="text-amber-500 hover:text-amber-400">Wiki</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/wiki" className="text-amber-600 hover:text-amber-500 text-sm mb-6 inline-block">&larr; Tillbaka till wiki</Link>

        {loading ? (
          <p className="text-slate-400">Laddar...</p>
        ) : allForTitle.length === 0 ? (
          <p className="text-slate-400">Artikeln hittades inte.</p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-600">{kategori}</span>
                <h1 className="text-3xl sm:text-5xl font-bold text-amber-300 mt-1">{title}</h1>
              </div>
              {hasSpoilerContent && (
                <button
                  onClick={() => setShowSpoilers(!showSpoilers)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showSpoilers ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'}`}
                >
                  {showSpoilers ? 'Spoilers VISAS' : 'Visa spoilers'}
                </button>
              )}
            </div>

            <div className="space-y-6">
              {displayed.map((entry, i) => (
                <div key={i} className={`p-5 rounded-lg ${entry.spoiler?.toLowerCase() === 'ja' ? 'bg-red-950/30 border border-red-900/30' : 'bg-slate-800/50 border border-amber-900/30'}`}>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{entry.innehall}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-slate-500">{entry.datum}</span>
                    {entry.spoiler?.toLowerCase() === 'ja' && (
                      <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">Spoiler</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
