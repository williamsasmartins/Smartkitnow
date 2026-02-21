import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Globe2, Search, MapPin } from 'lucide-react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import { cityMapping } from 'city-timezones';

// Generate a robust list of timezones/cities
const getAllTimezones = () => {
  try {
    if (typeof Intl !== 'undefined' && (Intl as any).supportedValuesOf) {
      return (Intl as any).supportedValuesOf('timeZone');
    }
  } catch (e) {
    // Ignore
  }
  return [
    'UTC', 'GMT', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver', 'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Toronto', 'America/Vancouver', 'America/Mexico_City',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid', 'Europe/Moscow',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Seoul', 'Asia/Hong_Kong', 'Asia/Bangkok', 'Asia/Kolkata', 'Asia/Jakarta',
    'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane', 'Australia/Perth',
    'Pacific/Auckland', 'Pacific/Honolulu'
  ];
};

const normalizeString = (str: string) => {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const formatCityName = (tz: string) => {
  const parts = tz.split('/');
  return parts[parts.length - 1].replace(/_/g, ' ');
};

const ALL_TIMEZONES = getAllTimezones();

const INITIAL_QUICK_CITIES = [
  { name: 'Local Time', tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' },
  { name: 'New York', tz: 'America/New_York' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'São Paulo', tz: 'America/Sao_Paulo' },
];

export default function WorldClockCalculator() {
  const [now, setNow] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState(INITIAL_QUICK_CITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Clean interval unmount prevents memory leaks.
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredTimezones = useMemo(() => {
    // Normalize search query for diacritics (e.g., "são" -> "sao")
    const lowerQ = normalizeString(searchQuery);

    const resultsMap = new Map<string, { name: string, tz: string }>();

    // 1. Search Standard IANA Timezones (e.g. America/Los_Angeles)
    ALL_TIMEZONES.forEach(tz => {
      if (normalizeString(tz).includes(lowerQ) || normalizeString(formatCityName(tz)).includes(lowerQ)) {
        // Use ID as key to prevent duplicates
        resultsMap.set(tz, { name: formatCityName(tz), tz });
      }
    });

    // 2. Search City Database for missing locations (e.g., Santos, Vancouver, etc.)
    for (const c of cityMapping) {
      if (resultsMap.size >= 30) break; // Performance limit
      if (
        normalizeString(c.city).includes(lowerQ) ||
        (c.admin_name && normalizeString(c.admin_name).includes(lowerQ)) ||
        (c.country && normalizeString(c.country).includes(lowerQ))
      ) {
        // If we found a city exact match (like "Santos"), overwrite the display name
        // so the user knows their city was directly matched to its parent zone.
        const idKey = `${c.city}-${c.timezone}`;
        if (!resultsMap.has(idKey)) {
          resultsMap.set(idKey, { name: `${c.city}, ${c.country}`, tz: c.timezone });
        }
      }
    }

    return Array.from(resultsMap.values()).slice(0, 30);
  }, [searchQuery]);

  // Format time HH:mm:ss for selected timezone
  const formatterTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: selectedCity.tz,
  });

  // Format date correctly mapping timezone wrapped days
  const formatterDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: selectedCity.tz,
  });

  const widget = (
    <div className="flex flex-col gap-6">
      <Card className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md rounded-2xl transition-all duration-300 relative z-0">
        <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
            <Globe2 className="w-6 h-6" />
            <h2 className="text-xl font-semibold tracking-tight">Real-Time World Clock</h2>
          </div>

          {/* Time Display */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-slate-400 dark:text-slate-500 hidden sm:block" />
            <div className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-slate-900 dark:text-slate-100 tabular-nums">
              {formatterTime.format(now)}
            </div>
          </div>

          {/* Date Display */}
          <div className="flex items-center justify-center gap-2 mt-2 mb-8 text-base sm:text-xl font-medium text-slate-500 dark:text-slate-400">
            <Calendar className="w-5 h-5" />
            <span>{formatterDate.format(now)}</span>
          </div>

          <div className="w-full max-w-sm mb-6 flex items-center justify-center gap-2 px-4 py-2 border rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-medium">
            <MapPin className="w-4 h-4 text-indigo-500/80" />
            Selected: {selectedCity.tz === (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC') ? 'Local System Time' : `${selectedCity.name}`}
          </div>

          {/* Timezone Switcher Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-2xl mb-8">
            {INITIAL_QUICK_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${selectedCity.tz === city.tz
                  ? 'bg-indigo-100 border-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:border-indigo-800 dark:text-indigo-200 shadow-sm scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 hover:scale-105'
                  }`}
                aria-label={`Switch to ${city.name} timezone`}
              >
                {city.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full max-w-md relative text-left">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search city, country, or timezone..."
                className="pl-10 h-12 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery.length > 0 && (
              <div className="w-full mt-3 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl overflow-hidden text-left relative z-10">
                <ScrollArea className="max-h-64">
                  <div className="p-2 flex flex-col">
                    {filteredTimezones.length === 0 ? (
                      <div className="p-3 text-sm text-slate-500 text-center">No timezones found.</div>
                    ) : (
                      filteredTimezones.map((tzItem) => (
                        <button
                          key={tzItem.tz + tzItem.name}
                          className="text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full"
                          onClick={() => {
                            setSelectedCity({ name: tzItem.name, tz: tzItem.tz });
                            setSearchQuery('');
                          }}
                        >
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{tzItem.name}</div>
                          <div className="text-xs text-slate-500">{tzItem.tz}</div>
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );

  const editorial = (
    <div className="space-y-8 skn-editorial-sections">
      <section id="features">
        <h2 className="text-2xl font-semibold">Features of the World Clock</h2>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li><strong>Real-time Tracking:</strong> The digital clock updates securely every second locally.</li>
          <li><strong>Search Global Cities:</strong> Instantly search thousands of global locations using our database of standardized timezones.</li>
          <li><strong>Day Wrapping:</strong> Easily account for the International Date Line. If it is tomorrow in Japan relative to your current time, the timezone calendar will reflect that correctly.</li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Real-Time World Clock"
      description="A dynamic digital clock displaying time and date exactly as it stands worldwide. Choose local, popular cities, or search globally."
      widget={widget}
      editorial={editorial}
      contentMaxWidth="max-w-4xl"
      showSidebar={false}
    />
  );
}
