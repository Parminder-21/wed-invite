'use client';

import { useEffect, useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { WeddingConfig } from '@/lib/types';

export default function ContentEditor() {
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // clear banner
      } else {
        setError(resData.error || 'Failed to save configuration settings.');
      }
    } catch (err) {
      console.error('Save content error:', err);
      setError('Connection failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!config) return <p className="text-gray-400">Failed to load editor.</p>;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-sans text-gray-900 font-bold select-text">
            Invitation Content
          </h2>
          <p className="text-sm text-gray-500 mt-1 select-text">
            Manage couple details, shloks, travel accommodations, coordinates, and metadata.
          </p>
        </div>
      </div>

      {/* Feedback Banners */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">Configuration updated successfully!</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2">
          <AlertCircle size={18} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-8 select-text">
        
        {/* Section 1: Couple names & announcement */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Couple & Family Announcement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Bride Name</label>
              <input
                type="text"
                required
                value={config.couple.bride}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    couple: { ...config.couple, bride: e.target.value },
                  })
                }
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Groom Name</label>
              <input
                type="text"
                required
                value={config.couple.groom}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    couple: { ...config.couple, groom: e.target.value },
                  })
                }
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Bride's Parents</label>
              <input
                type="text"
                required
                value={config.couple.brideParents}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    couple: { ...config.couple, brideParents: e.target.value },
                  })
                }
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Groom's Parents</label>
              <input
                type="text"
                required
                value={config.couple.groomParents}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    couple: { ...config.couple, groomParents: e.target.value },
                  })
                }
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Announcement Subtext</label>
            <textarea
              rows={3}
              required
              value={config.couple.announcement}
              onChange={(e) =>
                setConfig({
                  ...config,
                  couple: { ...config.couple, announcement: e.target.value },
                })
              }
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none resize-none transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Devotional Blessing */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Blessing & Shlok Mantra
          </h3>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Sanskrit Mantra (Devanagari)</label>
            <input
              type="text"
              required
              value={config.blessing.mantra}
              onChange={(e) =>
                setConfig({
                  ...config,
                  blessing: { ...config.blessing, mantra: e.target.value },
                })
              }
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Translation / Blessing Subtext</label>
            <textarea
              rows={2}
              required
              value={config.blessing.translation}
              onChange={(e) =>
                setConfig({
                  ...config,
                  blessing: { ...config.blessing, translation: e.target.value },
                })
              }
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none resize-none transition-colors"
            />
          </div>
        </div>

        {/* Section 3: Wedding date */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Wedding date
          </h3>
          <div className="flex flex-col max-w-sm">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Date & Time ISO String</label>
            <input
              type="datetime-local"
              required
              // Convert ISO (2026-12-18T16:00:00.000Z) to datetime-local format (YYYY-MM-DDThh:mm)
              value={
                config.weddingDate
                  ? new Date(config.weddingDate).toISOString().substring(0, 16)
                  : ''
              }
              onChange={(e) => {
                const selectedDate = e.target.value ? new Date(e.target.value).toISOString() : '';
                setConfig({ ...config, weddingDate: selectedDate });
              }}
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
            />
            <span className="text-[10px] text-gray-400 mt-1 select-text">
              Note: This date controls the live countdown clock and the Save the Date reveal card.
            </span>
          </div>
        </div>

        {/* Section 4: Travel information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Travel & Stay details
          </h3>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Lodging & Direction Instructions</label>
            <textarea
              rows={5}
              required
              value={config.travel.details}
              onChange={(e) =>
                setConfig({
                  ...config,
                  travel: { ...config.travel, details: e.target.value },
                })
              }
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none resize-none transition-colors"
            />
          </div>
        </div>

        {/* Section 5: Coordinators */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Coordinators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Bride Coordinator Phone</label>
              <input
                type="text"
                required
                value={config.contact.brideCoordinator}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, brideCoordinator: e.target.value },
                  })
                }
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-2 uppercase">Groom Coordinator Phone</label>
              <input
                type="text"
                required
                value={config.contact.groomCoordinator}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, groomCoordinator: e.target.value },
                  })
                }
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 6: SEO */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            SEO & Social Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-2 uppercase">SEO Title Tag</label>
              <input
                type="text"
                required
                value={config.seo.title}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    seo: { ...config.seo, title: e.target.value },
                  })
                }
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 mb-2 uppercase">SEO Keywords</label>
              <input
                type="text"
                required
                value={config.seo.keywords}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    seo: { ...config.seo, keywords: e.target.value },
                  })
                }
                className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase">SEO Meta Description</label>
            <textarea
              rows={2}
              required
              value={config.seo.description}
              onChange={(e) =>
                setConfig({
                  ...config,
                  seo: { ...config.seo, description: e.target.value },
                })
              }
              className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2.5 text-sm outline-none resize-none transition-colors"
            />
          </div>
        </div>

        {/* Sticky Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#800020] hover:bg-[#A30029] disabled:bg-[#80002070] text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider shadow hover:shadow-lg transition-all duration-200"
          >
            <Save size={16} />
            {saving ? 'Saving changes...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
