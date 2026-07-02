'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, CheckCircle, XCircle, Cake, Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { RSVP, WeddingConfig } from '@/lib/types';

export default function DashboardOverview() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rsvpsRes, configRes] = await Promise.all([
          fetch('/api/rsvps'),
          fetch('/api/config')
        ]);
        
        if (rsvpsRes.ok) {
          const rsvpsData = await rsvpsRes.json();
          setRsvps(rsvpsData);
        }
        if (configRes.ok) {
          const configData = await configRes.json();
          setConfig(configData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  // Calculate statistics
  const totalRSVPs = rsvps.length;
  const yesResponses = rsvps.filter((r) => r.attending).length;
  const noResponses = totalRSVPs - yesResponses;
  const totalGuests = rsvps
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + r.guestsCount, 0);

  // Meal preference breakdown
  const meals: Record<string, number> = {};
  rsvps
    .filter((r) => r.attending && r.mealPreference)
    .forEach((r) => {
      const pref = r.mealPreference || 'Unspecified';
      meals[pref] = (meals[pref] || 0) + r.guestsCount;
    });

  // Event-wise attendance counts
  const eventCounts: Record<string, number> = {};
  rsvps
    .filter((r) => r.attending && r.eventsAttending)
    .forEach((r) => {
      try {
        const attendingList: string[] = JSON.parse(r.eventsAttending);
        attendingList.forEach((eventTitle) => {
          eventCounts[eventTitle] = (eventCounts[eventTitle] || 0) + r.guestsCount;
        });
      } catch (e) {
        console.error('Failed to parse events list', e);
      }
    });

  // Recent 5 RSVPs
  const recentRsvps = rsvps.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-sans text-gray-900 font-bold select-text">
          Dashboard Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1 select-text">
          Live statistics and recent guest responses for {config?.couple.bride} & {config?.couple.groom}'s wedding.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Responses</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalRSVPs}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Attending (Yes)</p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">{yesResponses}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Declined (No)</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">{noResponses}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Headcount</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{totalGuests}</h3>
          </div>
        </div>
      </div>

      {/* Grid: Events & Meal Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events Attendance counts */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2 select-text">
            <Calendar size={18} className="text-[#800020]" />
            Ceremony Attendants Breakdown
          </h3>
          <div className="space-y-4">
            {config?.events.map((event) => {
              const count = eventCounts[event.title] || 0;
              const percent = totalGuests > 0 ? (count / totalGuests) * 100 : 0;
              return (
                <div key={event.id} className="space-y-2 select-text">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-800">{event.title}</span>
                    <span className="font-bold text-gray-900">{count} guests</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#800020] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(!config || config.events.length === 0) && (
              <p className="text-sm text-gray-400 italic">No events configured.</p>
            )}
          </div>
        </div>

        {/* Meal Preferences */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2 select-text">
            <Cake size={18} className="text-[#800020]" />
            Meal Preference Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(meals).map(([meal, count]) => {
              const percent = totalGuests > 0 ? (count / totalGuests) * 100 : 0;
              return (
                <div key={meal} className="space-y-2 select-text">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-800">{meal}</span>
                    <span className="font-bold text-gray-900">{count} portions</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(meals).length === 0 && (
              <p className="text-sm text-gray-400 italic">No meal responses collected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent RSVPs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 select-text">
            <Sparkles size={18} className="text-[#800020]" />
            Recent RSVPs
          </h3>
          <Link
            href="/admin/dashboard/rsvp"
            className="text-xs font-semibold text-[#800020] hover:text-[#A30029] flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            Manage RSVPs <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold">
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Guest Name</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Attending</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Meal</th>
                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 select-text">
              {recentRsvps.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{rsvp.name}</td>
                  <td className="px-6 py-4 text-gray-500">{rsvp.phone}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        rsvp.attending
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {rsvp.attending ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{rsvp.attending ? rsvp.guestsCount : '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{rsvp.mealPreference || '-'}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(rsvp.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentRsvps.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 italic">
                    No RSVPs received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
