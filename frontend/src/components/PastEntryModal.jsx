import React from 'react';
import { Edit, Trash2, BarChart3 } from 'lucide-react';

export function PastEntryModal({ entry, onClose, onEdit, onDelete, onViewAnalytics }) {
  return (
    <div
      className="fixed inset-0 z-[50] flex items-center justify-center z-[120] p-4 overflow-y-auto"
      style={{
        background: 'rgba(13,31,28,0.9)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="rounded-2xl p-8 max-w-xl w-full relative"
        style={{
          background: 'rgba(13,31,28,0.95)',
          border: '1px solid rgba(34,197,94,0.3)',
          boxShadow: '0 0 40px rgba(34,197,94,0.3)',
        }}
      >
        <h3 className="text-green-400 font-bold text-2xl mb-3">{entry.title}</h3>
        <p className="text-gray-400 mb-5">{entry.date}</p>
        <p className="text-gray-200 mb-6 whitespace-pre-wrap">{entry.description}</p>

        <div className="flex justify-between text-gray-400 mb-8">
          <span>😊 Mood: <b className="text-green-400">{entry.mood}/10</b></span>
          <span>💼 Productivity: <b className="text-teal-400">{entry.productivity}/10</b></span>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="py-3 px-8 rounded-xl transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(34,197,94,0.3)',
            }}
          >
            Close
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(entry)}
              className="py-3 px-6 ml-2 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #0F766E 100%)',
                color: '#0D1F1C',
                boxShadow: '0 0 20px rgba(34,197,94,0.4)',
                fontWeight: '600',
              }}
            >
              <Edit className="inline mr-1" size={20} />
              Edit Entry
            </button>

            <button
              onClick={() => onDelete(entry)}
              className="py-3 px-6 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(239,68,68,0.4)',
                fontWeight: '600',
              }}
            >
              <Trash2 className="inline mr-2" size={20} />
              Delete
            </button>

            <button
              onClick={onViewAnalytics}
              className="py-3 px-6 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(249,115,22,0.4)',
                fontWeight: '600',
              }}
            >
              <BarChart3 className="inline mr-2" size={20} />
              Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}