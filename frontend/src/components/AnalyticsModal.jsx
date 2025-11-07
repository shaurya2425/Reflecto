import React from 'react';
import { Sparkles } from 'lucide-react';

export function AnalyticsModal({ analyticsData, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      style={{
        background: 'rgba(13,31,28,0.9)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="rounded-2xl p-8 max-w-2xl w-full relative"
        style={{
          background: 'rgba(13,31,28,0.95)',
          border: '1px solid rgba(34,197,94,0.3)',
          boxShadow: '0 0 40px rgba(34,197,94,0.3)',
          maxHeight: '85vh', // ✅ prevent modal from growing too tall
          overflowY: 'auto', // ✅ add internal scroll
        }}
      >
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="mr-3" size={28} style={{ color: '#22C55E' }} />
          <h3 className="text-white font-bold text-2xl">Journal Analytics</h3>
          <Sparkles className="ml-3" size={28} style={{ color: '#22C55E' }} />
        </div>

        <div className="text-gray-300 space-y-6">
          <div>
            <h4 className="text-green-400 font-semibold text-lg mb-2">Sentiment Analysis</h4>
            <p><b>Sentiment:</b> {analyticsData.sentiment}</p>
            <p><b>Polarity Score:</b> {analyticsData.polarity_score}</p>
          </div>

          <div>
            <h4 className="text-teal-400 font-semibold text-lg mb-2">🩵 Emotional Summary</h4>
            <p>{analyticsData.emotional_summary}</p>
          </div>

          <div>
            <h4 className="text-green-400 font-semibold text-lg mb-2">💬 Reflection</h4>
            <p>{analyticsData.reflection}</p>
          </div>

          <div>
            <h4 className="text-green-400 font-semibold text-lg mb-2">🌱 Suggestions</h4>
            <ol className="list-decimal ml-5 space-y-2">
              {analyticsData.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="py-3 px-8 rounded-xl transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              boxShadow: '0 0 25px rgba(249,115,22,0.4)',
              fontWeight: '600',
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* ✅ Custom Scrollbar Styling */}
      <style>{`
        .rounded-2xl::-webkit-scrollbar {
          width: 10px;
        }

        .rounded-2xl::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #22C55E, #0F766E);
          border-radius: 10px;
          box-shadow: 0 0 8px rgba(34,197,94,0.4);
        }

        .rounded-2xl::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #16A34A, #0D9488);
        }

        .rounded-2xl::-webkit-scrollbar-track {
          background: rgba(13,31,28,0.4);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
