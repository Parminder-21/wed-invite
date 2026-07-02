'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash, ArrowLeft, ArrowRight, Save, Image as ImageIcon } from 'lucide-react';
import { WeddingConfig, GalleryItem } from '@/lib/types';

export default function GalleryEditor() {
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Add State
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

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
        setMessage({ text: 'Gallery saved successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to save gallery changes.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Connection failed.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !newUrl.trim()) return;

    const newPhoto: GalleryItem = {
      id: String(Date.now()),
      url: newUrl.trim(),
      caption: newCaption.trim(),
    };

    const updatedGallery = [...config.gallery, newPhoto];
    saveConfig({ ...config, gallery: updatedGallery });

    // reset fields
    setNewUrl('');
    setNewCaption('');
  };

  const handleDelete = (id: string) => {
    if (!config) return;
    if (!confirm('Are you sure you want to remove this image from the gallery?')) return;

    const updatedGallery = config.gallery.filter((item) => item.id !== id);
    saveConfig({ ...config, gallery: updatedGallery });
  };

  const moveItem = (index: number, direction: 'left' | 'right') => {
    if (!config) return;
    const list = [...config.gallery];
    const target = direction === 'left' ? index - 1 : index + 1;

    if (target < 0 || target >= list.length) return;

    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    saveConfig({ ...config, gallery: list });
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
      <div>
        <h2 className="text-2xl md:text-3xl font-sans text-gray-900 font-bold">
          Gallery Photo Manager
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Add new images, edit descriptions, remove photos, and reorder the layout.
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

      {/* Add Image Form */}
      <form onSubmit={handleAddImage} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <ImageIcon size={18} className="text-[#800020]" />
          Add Photo to Gallery
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1.5 uppercase">Image Source URL</label>
            <input
              type="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-3 py-2 text-sm outline-none bg-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1.5 uppercase">Caption / Label</label>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="e.g. Sangeet Celebration"
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-3 py-2 text-sm outline-none bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#A30029] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow"
          >
            <Plus size={14} /> Add Image
          </button>
        </div>
      </form>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {config?.gallery.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between group">
            {/* Image display */}
            <div className="relative h-48 md:h-56 bg-gray-50">
              <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
            </div>

            {/* Caption & Controls */}
            <div className="p-4 border-t border-gray-100 space-y-3">
              <p className="text-sm font-semibold text-gray-900 truncate select-text">{item.caption || 'No Caption'}</p>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-55">
                {/* Order */}
                <div className="flex gap-1">
                  <button
                    onClick={() => moveItem(idx, 'left')}
                    disabled={idx === 0 || saving}
                    className="p-1.5 border border-gray-200 rounded text-gray-400 hover:text-gray-600 disabled:opacity-20"
                    title="Move Left"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'right')}
                    disabled={idx === (config?.gallery.length || 0) - 1 || saving}
                    className="p-1.5 border border-gray-200 rounded text-gray-400 hover:text-gray-600 disabled:opacity-20"
                    title="Move Right"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={saving}
                  className="p-1.5 border border-red-100 hover:bg-red-50 text-red-600 rounded transition-colors"
                  title="Remove Photo"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!config || config.gallery.length === 0) && (
          <div className="col-span-full border border-gray-200 border-dashed rounded-xl py-16 text-center text-gray-400 italic">
            No gallery images configured.
          </div>
        )}
      </div>
    </div>
  );
}
