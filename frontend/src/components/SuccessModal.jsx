import React from 'react';
import { CheckCircle, X, BarChart3 } from 'lucide-react';

export function SuccessModal({ onContinue, onViewAnalytics }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(11, 18, 16, 0.95) 0%, rgba(16, 28, 24, 0.95) 100%)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full backdrop-blur-xl relative"
        style={{
          background: 'rgba(13, 31, 28, 0.95)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)'
        }}
      >
        <button
          onClick={onContinue}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-all hover:bg-green-500/20"
          style={{ color: '#9CA3AF' }}
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6 mt-2">
          <div className="mx-auto mb-4 inline-block" style={{
            color: '#22C55E',
            filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))'
          }}>
            <CheckCircle size={64} />
          </div>
          <h3 className="text-white mb-2" style={{ fontWeight: '700', fontSize: '1.5rem' }}>
            Journal Created Successfully!
          </h3>
          <p className="text-gray-400">Your entry has been saved</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onContinue}
            className="w-full py-3 rounded-xl transition-all backdrop-blur-sm hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #0F766E 100%)',
              color: '#0D1F1C',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
              fontWeight: '600'
            }}
          >
            Continue Writing
          </button>
          <button
            onClick={onViewAnalytics}
            className="w-full py-3 rounded-xl transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#FFFFFF',
              boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)',
              fontWeight: '600'
            }}
          >
            <BarChart3 className="inline mr-2" size={20} />
            See Full Analytics
          </button>
        </div>
      </div>
    </div>
  );
}