import React from 'react';

export function NewEntryForm({
    title,
    setTitle,
    description,
    setDescription,
    mood,
    setMood,
    productivity,
    setProductivity,
    onSave,
    updateMode,
    editingJournalId
}) {
    return (
        <div
            className="rounded-2xl p-6 md:p-8 backdrop-blur-lg"
            style={{
                background: 'rgba(13, 31, 28, 0.6)',
                border: '1px solid rgba(34,197,94,0.2)',
                boxShadow: '0 0 30px rgba(34,197,94,0.15)',
            }}
        >
            {/* Title */}
            <div className="mb-6">
                {editingJournalId && (
                    <p className="text-sm text-amber-400 mb-2">
                        ✏️ Editing existing entry (ID: {editingJournalId})
                    </p>
                )}
                <h2 className="text-white mb-3 text-xl font-semibold">Journal Title</h2>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your entry a title..."
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-sm focus:outline-none transition-all"
                    style={{
                        background: 'rgba(13,31,28,0.8)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        color: '#FFFFFF',
                        caretColor: '#22C55E',
                    }}
                />
            </div>

            {/* Description */}
            <div className="mb-6">
                <h2 className="text-white mb-3 text-xl font-semibold">Description of the Day</h2>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="How was your day? What happened? How do you feel?"
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-sm focus:outline-none resize-none transition-all"
                    style={{
                        background: 'rgba(13,31,28,0.8)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        color: '#FFFFFF',
                        caretColor: '#22C55E',
                    }}
                />
            </div>

            {/* Mood */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-white text-xl font-semibold">Mood Level</h2>
                    <span className="text-green-400 font-bold text-xl">{mood}/10</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={mood}
                    onChange={(e) => setMood(parseInt(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer slider-mood"
                    style={{
                        background: `linear-gradient(to right, #22C55E ${(mood - 1) * 11.11}%, rgba(255,255,255,0.1) ${(mood - 1) * 11.11}%)`,
                    }}
                />
                <div className="flex justify-between mt-2 text-gray-400 text-sm">
                    <span>😔 Low</span>
                    <span>😊 High</span>
                </div>
            </div>

            {/* Productivity */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-white text-xl font-semibold">Productivity Level</h2>
                    <span className="text-teal-400 font-bold text-xl">{productivity}/10</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={productivity}
                    onChange={(e) => setProductivity(parseInt(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer slider-productivity"
                    style={{
                        background: `linear-gradient(to right, #0F766E ${(productivity - 1) * 11.11}%, rgba(255,255,255,0.1) ${(productivity - 1) * 11.11}%)`,
                    }}
                />
                <div className="flex justify-between mt-2 text-gray-400 text-sm">
                    <span>📉 Low</span>
                    <span>📈 High</span>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onSave}
                    disabled={!title.trim() || !description.trim()}
                    className="py-3 px-8 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: '#fff',
                        boxShadow: '0 0 25px rgba(249,115,22,0.4)',
                        fontWeight: '600',
                    }}
                >
                    {updateMode ? 'Update Entry' : 'Save Entry'}
                </button>
            </div>
        </div>
    );
}