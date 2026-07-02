'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, ArrowUp, ArrowDown, Save, MapPin, Calendar, Clock, Shirt } from 'lucide-react';
import { WeddingConfig, EventDetail } from '@/lib/types';

export default function EventsEditor() {
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Modal / form states for Add/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDetail | null>(null);
  const [formEvent, setFormEvent] = useState<Partial<EventDetail>>({
    title: '',
    date: '',
    time: '',
    venue: '',
    dressCode: '',
    mapLink: '',
    note: '',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        console.error('Failed to load config', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const saveConfig = async (newConfig: WeddingConfig) => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(newConfig);
        setMessage({ text: 'Events saved successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to save events.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Connection failed.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setFormEvent({
      title: '',
      date: '',
      time: '',
      venue: '',
      dressCode: '',
      mapLink: '',
      note: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (event: EventDetail) => {
    setEditingEvent(event);
    setFormEvent({ ...event });
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    let updatedEvents = [...config.events];

    if (editingEvent) {
      // Edit mode
      updatedEvents = updatedEvents.map((evt) =>
        evt.id === editingEvent.id ? (formEvent as EventDetail) : evt
      );
    } else {
      // Add mode
      const newEvent: EventDetail = {
        ...(formEvent as EventDetail),
        id: String(Date.now()), // unique id
      };
      updatedEvents.push(newEvent);
    }

    const newConfig = { ...config, events: updatedEvents };
    saveConfig(newConfig);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!config) return;
    if (!confirm('Are you sure you want to delete this ceremony?')) return;

    const updatedEvents = config.events.filter((evt) => evt.id !== id);
    const newConfig = { ...config, events: updatedEvents };
    saveConfig(newConfig);
  };

  // Reordering array operations
  const moveEvent = (index: number, direction: 'up' | 'down') => {
    if (!config) return;
    const list = [...config.events];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap elements
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const newConfig = { ...config, events: list };
    saveConfig(newConfig);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 select-text">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-sans text-gray-900 font-bold">
            Festivities Editor
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the wedding ceremony schedule. You can create, edit, delete, and reorder events.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#A30029] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow transition-colors"
        >
          <Plus size={16} /> Add Ceremony
        </button>
      </div>

      {/* Messages */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span>{message.text}</span>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {config?.events.map((event, idx) => (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow transition-shadow"
          >
            {/* Left side details */}
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-bold text-[#800020] font-sans">{event.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400 shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400 shrink-0" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate max-w-[150px]">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shirt size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate max-w-[150px]">{event.dressCode || '-'}</span>
                </div>
              </div>
            </div>

            {/* Right side operations */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              {/* Order swaps */}
              <button
                onClick={() => moveEvent(idx, 'up')}
                disabled={idx === 0 || saving}
                className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:hover:text-gray-400"
                title="Move Up"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => moveEvent(idx, 'down')}
                disabled={idx === (config?.events.length || 0) - 1 || saving}
                className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:hover:text-gray-400"
                title="Move Down"
              >
                <ArrowDown size={16} />
              </button>

              <div className="w-[1px] h-6 bg-gray-200 mx-1" />

              {/* Edit / Delete */}
              <button
                onClick={() => openEditModal(event)}
                className="p-2 border border-gray-200 rounded-lg text-[#800020] hover:bg-red-50"
                title="Edit Event"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="p-2 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50"
                title="Delete Event"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
        {(!config || config.events.length === 0) && (
          <div className="bg-white border border-gray-200 border-dashed rounded-xl py-12 text-center text-gray-400 italic">
            No ceremonies added. Click "Add Ceremony" to get started.
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div className="fixed inset-0 bg-black/45" onClick={() => setModalOpen(false)} />
          
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative z-10 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <h3 className="text-lg font-sans font-bold text-gray-900">
              {editingEvent ? 'Edit Ceremony Details' : 'Add New Ceremony'}
            </h3>
            
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Title / Name</label>
              <input
                type="text"
                required
                value={formEvent.title}
                onChange={(e) => setFormEvent({ ...formEvent, title: e.target.value })}
                placeholder="e.g. Sangeet / Phere"
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-3 py-2 text-sm outline-none bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Date</label>
                <input
                  type="date"
                  required
                  value={formEvent.date}
                  onChange={(e) => setFormEvent({ ...formEvent, date: e.target.value })}
                  className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-3 py-2 text-sm outline-none bg-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Time</label>
                <input
                  type="text"
                  required
                  value={formEvent.time}
                  onChange={(e) => setFormEvent({ ...formEvent, time: e.target.value })}
                  placeholder="e.g. 06:30 PM"
                  className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-3 py-2 text-sm outline-none bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Venue Address</label>
              <input
                type="text"
                required
                value={formEvent.venue}
                onChange={(e) => setFormEvent({ ...formEvent, venue: e.target.value })}
                placeholder="e.g. Hotel Rajvilas lawns, Jaipur"
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-3 py-2 text-sm outline-none bg-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Dress Code Recommendation</label>
              <input
                type="text"
                value={formEvent.dressCode}
                onChange={(e) => setFormEvent({ ...formEvent, dressCode: e.target.value })}
                placeholder="e.g. Traditional Yellow / Indo-Western"
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-3 py-2 text-sm outline-none bg-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Google Maps Link</label>
              <input
                type="url"
                value={formEvent.mapLink}
                onChange={(e) => setFormEvent({ ...formEvent, mapLink: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-3 py-2 text-sm outline-none bg-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Special Notes</label>
              <textarea
                rows={2}
                value={formEvent.note}
                onChange={(e) => setFormEvent({ ...formEvent, note: e.target.value })}
                placeholder="e.g. Bring your dancing shoes!"
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-3 py-2 text-sm outline-none resize-none bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#800020] hover:bg-[#A30029] text-white rounded-lg text-sm font-semibold"
              >
                Save Ceremony
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
