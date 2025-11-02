import React from 'react';
import { Trash2 } from 'lucide-react';

export function DeleteConfirmationModal({ entry, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[140] p-4"
      style={{
        background: 'rgba(13,31,28,0.95)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full relative"
        style={{
          background: 'rgba(13,31,28,0.95)',
          border: '1px solid rgba(239,68,68,0.4)',
          boxShadow: '0 0 40px rgba(239,68,68,0.3)',
        }}
      >
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 inline-block" style={{
            color: '#ef4444',
            filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))'
          }}>
            <Trash2 size={64} />
          </div>
          <h3 className="text-white mb-2" style={{ fontWeight: '700', fontSize: '1.5rem' }}>
            Delete Entry?
          </h3>
          <p className="text-gray-400">
            Are you sure you want to delete "{entry.title}"? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(34,197,94,0.3)',
              fontWeight: '600',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              boxShadow: '0 0 20px rgba(239,68,68,0.4)',
              fontWeight: '600',
            }}
          >
            <Trash2 className="inline mr-2" size={20} />
            Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
}