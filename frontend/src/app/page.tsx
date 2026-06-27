'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🔬</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Consensus
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Search scientific consensus on any topic</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a scientific question..."
              className="flex-1 px-6 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={!query || loading}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Query: "{result.query}"</p>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full font-bold text-lg ${
                  result.evidence_level === 'Strong' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                }`}>
                  {result.evidence_level} Evidence
                </span>
                <span className="text-2xl font-bold text-emerald-400">
                  {(result.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-emerald-400 mb-3">Answer</h3>
              <p className="text-gray-200 leading-relaxed">{result.answer}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-900/20 rounded-xl border border-green-700/50">
                <p className="text-green-400 text-2xl font-bold">{result.supporting_papers}</p>
                <p className="text-sm text-gray-400">Supporting Papers</p>
              </div>
              <div className="p-4 bg-red-900/20 rounded-xl border border-red-700/50">
                <p className="text-red-400 text-2xl font-bold">{result.contradicting_papers}</p>
                <p className="text-sm text-gray-400">Contradicting Papers</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-emerald-400 mb-3">Key Findings</h3>
              <ul className="space-y-2">
                {result.key_findings.map((finding: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!result && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-3">Popular Questions</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="cursor-pointer hover:text-white" onClick={() => setQuery('Is climate change real?')}>
                  • Is climate change caused by humans?
                </li>
                <li className="cursor-pointer hover:text-white" onClick={() => setQuery('Do vaccines cause autism?')}>
                  • Do vaccines cause autism?
                </li>
                <li className="cursor-pointer hover:text-white" onClick={() => setQuery('Is organic food healthier?')}>
                  • Is organic food healthier?
                </li>
              </ul>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-3">How It Works</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Analyzes peer-reviewed papers</li>
                <li>✓ Measures scientific agreement</li>
                <li>✓ Identifies evidence strength</li>
                <li>✓ Provides citations</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
