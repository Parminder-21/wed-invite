'use client';

import { useEffect, useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { WeddingConfig, SectionsVisibility } from '@/lib/types';

export default function ThemeSettings() {
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
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(resData.error || 'Failed to save settings.');
      }
    } catch (err) {
      console.error('Save theme error:', err);
      setError('Connection failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof SectionsVisibility) => {
    if (!config) return;
    const newVisibility = {
      ...config.sectionsVisibility,
      [key]: !config.sectionsVisibility[key],
    };
    setConfig({ ...config, sectionsVisibility: newVisibility });
  };

  const handleThemeChange = (themeName: string) => {
    if (!config) return;
    let primary = '#800020'; // Maroon
    let secondary = '#D4AF37'; // Gold
    let accent = '#FAF9F6'; // Ivory

    if (themeName === 'emerald') {
      primary = '#097969'; // Emerald Green
      secondary = '#C5A059'; // Soft Gold
      accent = '#F4F6F0'; // Pale Ivory/Sage
    } else if (themeName === 'rose') {
      primary = '#B76E79'; // Rose Gold
      secondary = '#AA7C11'; // Classic Gold
      accent = '#FFFDF9'; // Clean warm white
    }

    setConfig({
      ...config,
      branding: {
        ...config.branding,
        theme: themeName,
        primaryColor: primary,
        secondaryColor: secondary,
        accentColor: accent,
      },
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!config) return <p className="text-gray-400">Failed to load theme settings.</p>;

  // List of section definitions
  const sections: { key: keyof SectionsVisibility; label: string; desc: string }[] = [
    { key: 'devotionalOpening', label: 'Devotional Opening', desc: 'Renders the initial Ganesh Shlok overlay and entrance button.' },
    { key: 'saveTheDate', label: 'Save the Date Reveal', desc: 'Shows the scratch-card interactive date reveal panels.' },
    { key: 'countdown', label: 'Mahurtham Countdown', desc: 'Shows the live ticking count-down panels until the marriage date.' },
    { key: 'story', label: 'Couple Love Story', desc: 'Displays the photo milestones timeline of the bride & groom.' },
    { key: 'festivities', label: 'Festivities (Ceremonies)', desc: 'Renders the details for Haldi, Sangeet, Phere, and Reception.' },
    { key: 'gallery', label: 'Photo Gallery Grid', desc: 'Displays the clickable interlocking grid layout of photos.' },
    { key: 'rsvp', label: 'RSVP Form Submission', desc: 'Allows guests to check attendance, dietary needs, and leave advice.' },
  ];

  return (
    <div className="space-y-8 select-text">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-sans text-gray-900 font-bold">
          Settings & Theme Customizer
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Adjust the invitation aesthetic style, color palette, and toggle section visibilities.
        </p>
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">Settings saved successfully!</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2">
          <AlertCircle size={18} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Color Palette Theme Select */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Wedding Theme Styling
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Maroon Theme */}
            <div
              onClick={() => handleThemeChange('maroon')}
              className={`p-5 rounded-xl border-2 cursor-pointer flex flex-col justify-between h-32 transition-all ${
                config.branding.theme === 'maroon'
                  ? 'border-[#800020] bg-red-50/10'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="font-bold text-gray-800 text-sm">Royal Maroon</span>
              <div className="flex gap-2 mt-4 select-none">
                <div className="w-6 h-6 rounded-full bg-[#800020] border border-black/10" title="Maroon" />
                <div className="w-6 h-6 rounded-full bg-[#D4AF37] border border-black/10" title="Gold" />
                <div className="w-6 h-6 rounded-full bg-[#FAF9F6] border border-black/10" title="Ivory" />
              </div>
            </div>

            {/* Emerald Theme */}
            <div
              onClick={() => handleThemeChange('emerald')}
              className={`p-5 rounded-xl border-2 cursor-pointer flex flex-col justify-between h-32 transition-all ${
                config.branding.theme === 'emerald'
                  ? 'border-[#097969] bg-green-50/10'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="font-bold text-gray-800 text-sm">Festive Emerald</span>
              <div className="flex gap-2 mt-4 select-none">
                <div className="w-6 h-6 rounded-full bg-[#097969] border border-black/10" title="Emerald" />
                <div className="w-6 h-6 rounded-full bg-[#C5A059] border border-black/10" title="Soft Gold" />
                <div className="w-6 h-6 rounded-full bg-[#F4F6F0] border border-black/10" title="Sage/Pale" />
              </div>
            </div>

            {/* Rose Theme */}
            <div
              onClick={() => handleThemeChange('rose')}
              className={`p-5 rounded-xl border-2 cursor-pointer flex flex-col justify-between h-32 transition-all ${
                config.branding.theme === 'rose'
                  ? 'border-[#B76E79] bg-rose-50/10'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="font-bold text-gray-800 text-sm">Elegant Rose Gold</span>
              <div className="flex gap-2 mt-4 select-none">
                <div className="w-6 h-6 rounded-full bg-[#B76E79] border border-black/10" title="Rose Gold" />
                <div className="w-6 h-6 rounded-full bg-[#AA7C11] border border-black/10" title="Classic Gold" />
                <div className="w-6 h-6 rounded-full bg-[#FFFDF9] border border-black/10" title="Warm White" />
              </div>
            </div>
          </div>
        </div>

        {/* Section visibility Toggles */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Website Section Visibility
          </h3>

          <div className="divide-y divide-gray-100">
            {sections.map((sec) => {
              const visible = config.sectionsVisibility[sec.key];
              return (
                <div key={sec.key} className="py-4 flex items-center justify-between gap-6 select-none">
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2 select-text">
                      {visible ? (
                        <Eye size={16} className="text-[#800020]" />
                      ) : (
                        <EyeOff size={16} className="text-gray-400" />
                      )}
                      {sec.label}
                    </h4>
                    <p className="text-xs text-gray-500 max-w-xl select-text">{sec.desc}</p>
                  </div>

                  {/* Switch toggle control */}
                  <button
                    type="button"
                    onClick={() => handleToggle(sec.key)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                      visible ? 'bg-[#800020]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                        visible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#800020] hover:bg-[#A30029] disabled:bg-[#80002070] text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider shadow hover:shadow-lg transition-all duration-200"
          >
            <Save size={16} />
            {saving ? 'Saving layout settings...' : 'Save Theme & Section Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
