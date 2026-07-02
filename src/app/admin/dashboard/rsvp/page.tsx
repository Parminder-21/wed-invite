'use client';

import { useEffect, useState } from 'react';
import { Search, Download, Trash, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { RSVP } from '@/lib/types';

export default function RSVPViewer() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAttending, setFilterAttending] = useState<'all' | 'true' | 'false'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRSVPs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (filterAttending !== 'all') params.append('attending', filterAttending);

      const res = await fetch(`/api/rsvps?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRsvps(data);
      }
    } catch (err) {
      console.error('Error fetching RSVPs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSVPs();
  }, [search, filterAttending]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this RSVP response?')) return;
    setDeletingId(id);
    try {
      const response = await fetch('/api/rsvps', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setRsvps(rsvps.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete RSVP', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (filterAttending !== 'all') params.append('attending', filterAttending);
    params.append('export', 'csv');

    // Simple location redirect triggers the download attachment
    window.location.href = `/api/rsvps?${params.toString()}`;
  };

  return (
    <div className="space-y-8 select-text">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-sans text-gray-900 font-bold">
            Guest RSVPs
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse, search, filter, and export the responses collected from your guests.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#A30029] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow transition-colors shrink-0"
        >
          <Download size={16} /> Export to CSV
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg text-sm outline-none bg-white transition-colors"
          />
        </div>

        {/* Filter & Refresh */}
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={filterAttending}
            onChange={(e) => setFilterAttending(e.target.value as any)}
            className="border border-gray-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-lg px-4 py-2 text-sm outline-none bg-white"
          >
            <option value="all">All RSVP States</option>
            <option value="true">Attending (Yes)</option>
            <option value="false">Declined (No)</option>
          </select>

          <button
            onClick={fetchRSVPs}
            className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-700"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400 flex flex-col items-center justify-center select-none animate-pulse">
            <svg className="animate-spin h-6 w-6 text-[#800020] mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs font-semibold">Loading RSVPs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-semibold select-none">
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Guest Details</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Attending</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Party Size</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Preferences / Events</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Wishes / Advice</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {rsvps.map((rsvp) => {
                  let eventsList: string[] = [];
                  try {
                    eventsList = JSON.parse(rsvp.eventsAttending);
                  } catch (e) {}

                  return (
                    <tr key={rsvp.id} className="hover:bg-gray-50">
                      {/* Name, Phone, Email */}
                      <td className="px-6 py-4 space-y-1">
                        <p className="font-bold text-gray-900">{rsvp.name}</p>
                        <p className="text-xs text-gray-500 font-medium">📞 {rsvp.phone}</p>
                        {rsvp.email && <p className="text-[10px] text-gray-400">{rsvp.email}</p>}
                      </td>

                      {/* Attending Status */}
                      <td className="px-6 py-4">
                        {rsvp.attending ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <CheckCircle2 size={12} /> Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <XCircle size={12} /> No
                          </span>
                        )}
                      </td>

                      {/* Party size */}
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {rsvp.attending ? rsvp.guestsCount : '-'}
                      </td>

                      {/* Events & Meal Preferences */}
                      <td className="px-6 py-4 space-y-2 max-w-[250px]">
                        {rsvp.attending ? (
                          <>
                            {rsvp.mealPreference && (
                              <p className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded border border-amber-100 inline-block">
                                🍽️ {rsvp.mealPreference}
                              </p>
                            )}
                            {eventsList.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {eventsList.map((evt) => (
                                  <span
                                    key={evt}
                                    className="bg-gray-100 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-medium"
                                  >
                                    {evt}
                                  </span>
                                ))}
                              </div>
                            )}
                            {rsvp.songRequest && (
                              <p className="text-[10px] text-[#800020] italic font-medium">
                                🎵 Song: {rsvp.songRequest}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Declined RSVP</span>
                        )}
                      </td>

                      {/* Message / advice */}
                      <td className="px-6 py-4 text-xs text-gray-600 italic max-w-[200px] whitespace-pre-line truncate" title={rsvp.advice || ''}>
                        {rsvp.advice || '-'}
                      </td>

                      {/* Delete Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(rsvp.id)}
                          disabled={deletingId === rsvp.id}
                          className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                          title="Delete Response"
                        >
                          <Trash size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {rsvps.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400 italic select-none">
                      No matching RSVP responses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
