'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, ArrowUp, ArrowDown, Save, Heart, HelpCircle } from 'lucide-react';
import { WeddingConfig, StoryTimelineItem, FAQItem } from '@/lib/types';

export default function StoryFaqEditor() {
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Story Form States
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryTimelineItem | null>(null);
  const [formStory, setFormStory] = useState<Partial<StoryTimelineItem>>({
    title: '',
    date: '',
    description: '',
    image: '',
  });

  // FAQ Form States
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [formFaq, setFormFaq] = useState<Partial<FAQItem>>({
    question: '',
    answer: '',
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
        setMessage({ text: 'Changes saved successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to save changes.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Connection failed.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // STORY CRUD HANDLERS
  const openStoryAdd = () => {
    setEditingStory(null);
    setFormStory({ title: '', date: '', description: '', image: '' });
    setStoryModalOpen(true);
  };

  const openStoryEdit = (item: StoryTimelineItem) => {
    setEditingStory(item);
    setFormStory({ ...item });
    setStoryModalOpen(true);
  };

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    let list = [...config.story];
    if (editingStory) {
      list = list.map((item) => (item.id === editingStory.id ? (formStory as StoryTimelineItem) : item));
    } else {
      list.push({ ...(formStory as StoryTimelineItem), id: String(Date.now()) });
    }

    saveConfig({ ...config, story: list });
    setStoryModalOpen(false);
  };

  const handleStoryDelete = (id: string) => {
    if (!config || !confirm('Delete this story event?')) return;
    saveConfig({ ...config, story: config.story.filter((s) => s.id !== id) });
  };

  const moveStory = (index: number, direction: 'up' | 'down') => {
    if (!config) return;
    const list = [...config.story];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;

    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    saveConfig({ ...config, story: list });
  };

  // FAQ CRUD HANDLERS
  const openFaqAdd = () => {
    setEditingFaq(null);
    setFormFaq({ question: '', answer: '' });
    setFaqModalOpen(true);
  };

  const openFaqEdit = (item: FAQItem) => {
    setEditingFaq(item);
    setFormFaq({ ...item });
    setFaqModalOpen(true);
  };

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    let list = [...config.faqs];
    if (editingFaq) {
      list = list.map((item) => (item.id === editingFaq.id ? (formFaq as FAQItem) : item));
    } else {
      list.push({ ...(formFaq as FAQItem), id: String(Date.now()) });
    }

    saveConfig({ ...config, faqs: list });
    setFaqModalOpen(false);
  };

  const handleFaqDelete = (id: string) => {
    if (!config || !confirm('Delete this FAQ?')) return;
    saveConfig({ ...config, faqs: config.faqs.filter((f) => f.id !== id) });
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    if (!config) return;
    const list = [...config.faqs];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;

    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    saveConfig({ ...config, faqs: list });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-xl" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-text">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-sans text-gray-900 font-bold">
          Story & FAQ Manager
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage items in the "Our Story" timeline and the list of guest FAQs.
        </p>
      </div>

      {/* Messages */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Love Story Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Heart size={18} className="text-[#800020]" />
              Love Story
            </h3>
            <button
              onClick={openStoryAdd}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800020] hover:text-[#A30029] bg-red-50 px-3 py-1.5 rounded-full transition-colors"
            >
              <Plus size={14} /> Add Story
            </button>
          </div>

          <div className="space-y-3">
            {config?.story.map((item, idx) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-150 p-4 flex gap-4 shadow-sm">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg shrink-0 border border-gray-100" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#800020] text-sm font-sans truncate">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">{item.date}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 select-text">{item.description}</p>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button onClick={() => moveStory(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ArrowUp size={14} /></button>
                  <button onClick={() => moveStory(idx, 'down')} disabled={idx === config.story.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ArrowDown size={14} /></button>
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => openStoryEdit(item)} className="p-1 text-[#800020] hover:bg-red-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleStoryDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
            {(!config || config.story.length === 0) && (
              <p className="text-xs text-gray-400 italic text-center py-6">No milestones in the timeline.</p>
            )}
          </div>
        </div>

        {/* Right Column: FAQ Accordion items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#800020]" />
              FAQ Accordion
            </h3>
            <button
              onClick={openFaqAdd}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800020] hover:text-[#A30029] bg-red-50 px-3 py-1.5 rounded-full transition-colors"
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {config?.faqs.map((item, idx) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-150 p-4 flex justify-between shadow-sm">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{item.question}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 select-text">{item.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveFaq(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ArrowUp size={14} /></button>
                  <button onClick={() => moveFaq(idx, 'down')} disabled={idx === config.faqs.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ArrowDown size={14} /></button>
                  <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                  <button onClick={() => openFaqEdit(item)} className="p-1 text-[#800020] hover:bg-red-50 rounded"><Edit size={14} /></button>
                  <button onClick={() => handleFaqDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash size={14} /></button>
                </div>
              </div>
            ))}
            {(!config || config.faqs.length === 0) && (
              <p className="text-xs text-gray-400 italic text-center py-6">No FAQs configured.</p>
            )}
          </div>
        </div>

      </div>

      {/* STORY MODAL DIALOG */}
      {storyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div className="fixed inset-0 bg-black/45" onClick={() => setStoryModalOpen(false)} />
          <form onSubmit={handleStorySubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative z-10 space-y-4">
            <h3 className="text-base font-sans font-bold text-gray-900">{editingStory ? 'Edit Story milestone' : 'Add Story milestone'}</h3>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Event Title</label>
              <input type="text" required value={formStory.title} onChange={(e) => setFormStory({ ...formStory, title: e.target.value })} placeholder="e.g. First Meeting" className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Date / Timeframe</label>
              <input type="text" required value={formStory.date} onChange={(e) => setFormStory({ ...formStory, date: e.target.value })} placeholder="e.g. Jan 2024" className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Photo URL</label>
              <input type="url" value={formStory.image} onChange={(e) => setFormStory({ ...formStory, image: e.target.value })} placeholder="https://images.unsplash.com/..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Story Description</label>
              <textarea rows={3} required value={formStory.description} onChange={(e) => setFormStory({ ...formStory, description: e.target.value })} placeholder="Tell the details of this story..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={() => setStoryModalOpen(false)} className="px-4 py-2 border text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#800020] text-white rounded-lg text-xs font-semibold">Save Milestone</button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ MODAL DIALOG */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div className="fixed inset-0 bg-black/45" onClick={() => setFaqModalOpen(false)} />
          <form onSubmit={handleFaqSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative z-10 space-y-4">
            <h3 className="text-base font-sans font-bold text-gray-900">{editingFaq ? 'Edit FAQ Item' : 'Add FAQ Item'}</h3>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Question</label>
              <input type="text" required value={formFaq.question} onChange={(e) => setFormFaq({ ...formFaq, question: e.target.value })} placeholder="e.g. Is there parking available?" className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Answer Text</label>
              <textarea rows={3} required value={formFaq.answer} onChange={(e) => setFormFaq({ ...formFaq, answer: e.target.value })} placeholder="Detail response..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={() => setFaqModalOpen(false)} className="px-4 py-2 border text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#800020] text-white rounded-lg text-xs font-semibold">Save FAQ</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
