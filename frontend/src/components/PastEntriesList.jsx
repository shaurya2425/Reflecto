import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export function PastEntriesList({ entries, onView, onEdit, onDelete }) {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 backdrop-blur-lg"
      style={{
        background: 'rgba(13, 31, 28, 0.6)',
        border: '1px solid rgba(34,197,94,0.2)',
        boxShadow: '0 0 30px rgba(34,197,94,0.15)',
      }}
    >
      <h2 className="text-white mb-6 text-xl font-semibold">Your Past Entries</h2>

      <div className="grid gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl p-5 relative backdrop-blur-sm transition-all hover:scale-[1.01]"
            style={{
              background: 'rgba(13, 31, 28, 0.8)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)',
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-green-400 font-semibold text-lg">{entry.title}</h3>
                <span className="text-gray-400 text-sm">{entry.date}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(entry)}
                  className="text-xs px-3 py-1 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #0F766E 100%)',
                    color: '#0D1F1C',
                    fontWeight: 600,
                    boxShadow: '0 0 10px rgba(34,197,94,0.4)',
                  }}
                >
                  <Edit className="inline mr-1" size={14} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(entry)}
                  className="text-xs px-3 py-1 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 0 10px rgba(239,68,68,0.4)',
                  }}
                >
                  <Trash2 className="inline mr-1" size={14} />
                  Delete
                </button>
                <button
                  onClick={() => onView(entry)}
                  className="text-xs px-3 py-1 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 0 10px rgba(249,115,22,0.4)',
                  }}
                >
                  View
                </button>
              </div>
            </div>

            <p className="text-gray-300 mb-3 line-clamp-2">{entry.description}</p>

            <div className="flex justify-between text-sm text-gray-400">
              <span>😊 Mood: <b className="text-green-400">{entry.mood}/10</b></span>
              <span>💼 Productivity: <b className="text-teal-400">{entry.productivity}/10</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}