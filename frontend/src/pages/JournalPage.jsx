import React, { useEffect, useState } from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { serverUrl } from '@/lib/utils.js';
import { SuccessModal } from '@/components/SuccessModal.jsx';
import { AnalyticsModal } from '@/components/AnalyticsModal.jsx';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal.jsx';
import { PastEntryModal } from '@/components/PastEntryModal.jsx';
import { NewEntryForm } from '@/components/NewEntryForm.jsx';
import { PastEntriesList } from '@/components/PastEntriesList.jsx';
import { set } from 'date-fns';

export function JournalPage() {
  const [activeTab, setActiveTab] = useState('new');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState(5);
  const [productivity, setProductivity] = useState(5);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showPastEntryModal, setShowPastEntryModal] = useState(false);
  const [showPastEntryAnalyticsModal, setShowPastEntryAnalyticsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [entries, setEntries] = useState([]);
  const [editingJournalId, setEditingJournalId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [updateMode, setUpdateMode] = useState(false);

  const { user } = useAuth();


  const sortEntries = (entries) => {
    // Firestore timestamps might come as string or Firestore Timestamp object
    return entries.sort((a, b) => {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);
      return dateB - dateA; // descending order → latest first
    });
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = serverUrl.BASE_URL + 'api/journals/' + encodeURIComponent(user.uid);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch journal entries');
        }
        const data = await response.json();
        setEntries(data);
        let newData = sortEntries(data);
        setEntries(newData);
        console.log(data);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };


    fetchData();
  }, [user, refresh]);



  const handleViewPastEntry = (entry) => {
    setSelectedEntry(entry);
    setShowPastEntryModal(true);
  };

  const handleSave = async () => {
    try {
      if (!title.trim() || !description.trim()) {
        alert("Please fill in all fields before saving.");
        return;
      }

      // 🧠 Decide URL and method
      const url = editingJournalId
        ? `${serverUrl.BASE_URL}api/journals/${editingJournalId}`
        : `${serverUrl.BASE_URL}api/journals/`;

      const method = editingJournalId ? "PUT" : "POST";

      // 🧮 Generate sentiment + polarity from your helper
      const { sentiment, polarity_score } = generateAnalysis(mood, productivity);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_uid: user.uid,
          title,
          description,
          mood,
          productivity,
          sentiment,
          polarity_score,
        }),
      });

      if (!response.ok) throw new Error("Failed to save or update journal");

      const data = await response.json();
      console.log(editingJournalId ? "Journal updated:" : "Journal saved:", data);

      // 🔁 Refresh entries
      setRefresh(refresh + 1);

      // 🧹 Reset fields
      setTitle("");
      setDescription("");
      setMood(5);
      setProductivity(5);
      setEditingJournalId(null);
      setUpdateMode(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error saving/updating journal:", error);
      alert("Something went wrong while saving/updating your journal.");
    }
  };

  const handleContinueWriting = () => {
    setTitle('');
    setDescription('');
    setMood(5);
    setProductivity(5);
    setShowSuccessModal(false);
  };

  const handleEditEntry = (entry) => {
    setUpdateMode(true);
    console.log(entry.journal_id);
    setTitle(entry.title);
    setDescription(entry.description);
    setMood(entry.mood);
    setProductivity(entry.productivity);
    setEditingJournalId(entry.journal_id);
    setActiveTab('new');
    setShowPastEntryModal(false);
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!entryToDelete) {
        alert("No journal selected for deletion.");
        return;
      }

      // 🧠 Backend endpoint for deleting
      const url = `${serverUrl.BASE_URL}api/journals/${entryToDelete.id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete journal entry");

      const data = await response.json();
      console.log("Journal deleted:", data);

      // 🔁 Refresh the journal list
      setRefresh(refresh + 1);

      // 🧹 Cleanup
      setShowDeleteModal(false);
      setEntryToDelete(null);

    } catch (error) {
      console.error("Error deleting journal:", error);
      alert("Something went wrong while deleting your journal.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  const generateAnalysis = (mood, productivity) => {
    const sentiment = mood >= 7 ? 'positive' : mood >= 4 ? 'neutral' : 'negative';
    const polarityScore = (mood - 5) / 5;

    return {
      sentiment,
      polarity_score: polarityScore.toFixed(2),
      emotional_summary: `You seem to be experiencing ${sentiment} emotions with a general sense of ${productivity >= 7 ? 'accomplishment' : productivity >= 4 ? 'balance' : 'low energy'}.`,
      reflection: `Your mood of ${mood}/10 and productivity of ${productivity}/10 show you're reflecting consciously. Each day teaches something new—keep journaling your growth.`,
      suggestions: [
        'Write three things you are grateful for daily.',
        'Set one small goal for tomorrow to stay consistent.',
        'Take mindful breaks to reflect during the day.',
      ],
    };
  };

  const handleViewAnalytics = () => {
    const data = generateAnalysis(mood, productivity);
    setAnalyticsData(data);
    setShowSuccessModal(false);
    setShowAnalyticsModal(true);
  };

  const handleViewPastEntryAnalytics = () => {
    const data = generateAnalysis(selectedEntry.mood, selectedEntry.productivity);
    setAnalyticsData(data);
    setShowPastEntryAnalyticsModal(true);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setMood(5);
    setProductivity(5);
    setShowSuccessModal(false);
    setShowAnalyticsModal(false);
    setShowPastEntryModal(false);
    setShowPastEntryAnalyticsModal(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: 'linear-gradient(135deg, #0B1210 0%, #101C18 100%)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white mb-2 text-3xl font-bold">My Journal</h1>
          <p className="text-gray-400">Track your thoughts, moods, and productivity</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {['new', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 px-6 rounded-2xl transition-all backdrop-blur-sm"
              style={{
                background: activeTab === tab ? 'linear-gradient(135deg, #22C55E, #0F766E)' : 'rgba(13,31,28,0.4)',
                color: activeTab === tab ? '#0D1F1C' : '#E5E7EB',
                border: activeTab === tab ? 'none' : '1px solid rgba(34,197,94,0.3)',
                boxShadow: activeTab === tab ? '0 0 20px rgba(34,197,94,0.4)' : 'none',
                fontWeight: '600',
              }}
            >
              {tab === 'new' ? (
                <>
                  <BookOpen className="inline mr-2" size={20} /> New Entry
                </>
              ) : (
                <>
                  <TrendingUp className="inline mr-2" size={20} /> Past Entries
                </>
              )}
            </button>
          ))}
        </div>

        {/* New Entry */}
        {activeTab === 'new' && (
          <NewEntryForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            mood={mood}
            setMood={setMood}
            productivity={productivity}
            setProductivity={setProductivity}
            onSave={handleSave}
            updateMode={updateMode}
          />
        )}

        {/* Past Entries */}
        {activeTab === 'past' && (
          <PastEntriesList
            entries={entries}
            onView={handleViewPastEntry}
            onEdit={handleEditEntry}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            onContinue={handleContinueWriting}
            onViewAnalytics={handleViewAnalytics}
          />
        )}

        {/* Analytics Modal */}
        {showAnalyticsModal && analyticsData && (
          <AnalyticsModal
            analyticsData={analyticsData}
            onClose={handleReset}
          />
        )}

        {/* Past Entry Modal */}
        {showPastEntryModal && selectedEntry && (
          <PastEntryModal
            entry={selectedEntry}
            onClose={() => setShowPastEntryModal(false)}
            onEdit={handleEditEntry}
            onDelete={handleDeleteClick}
            onViewAnalytics={handleViewPastEntryAnalytics}
          />
        )}

        {/* Past Entry Analytics Modal - Always on Top */}
        {showPastEntryAnalyticsModal && analyticsData && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center">
            <AnalyticsModal
              analyticsData={analyticsData}
              onClose={handleReset}
            />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && entryToDelete && (
          <DeleteConfirmationModal
            entry={entryToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>

      {/* Slider Styling */}
      <style>{`
        .slider-mood::-webkit-slider-thumb,
        .slider-productivity::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #fff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slider-mood::-webkit-slider-thumb {
          background: linear-gradient(135deg, #22C55E, #0F766E);
          box-shadow: 0 0 12px rgba(34,197,94,0.6);
        }

        .slider-productivity::-webkit-slider-thumb {
          background: linear-gradient(135deg, #0F766E, #22C55E);
          box-shadow: 0 0 12px rgba(15,118,110,0.6);
        }

        .slider-mood::-webkit-slider-thumb:hover,
        .slider-productivity::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}