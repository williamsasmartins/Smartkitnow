import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Globe2, Search, MapPin } from 'lucide-react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import useFaqJsonLd from '@/hooks/useFaqJsonLd';

const faqs = [
  {
    question: "How does this world clock stay accurate?",
    answer:
      "The clock reads your device's system time and applies each city's IANA time zone rules (including daylight saving transitions) using the browser's built-in Intl API. It updates every second locally, so accuracy depends on your device clock being correct — if your computer's time is synced to the internet, the world clock is accurate to the second.",
  },
  {
    question: "Does it handle daylight saving time automatically?",
    answer:
      "Yes. Each city is mapped to its IANA time zone (e.g. America/New_York), which carries the full historical and future DST rules. When a region enters or leaves daylight saving, the displayed time shifts automatically on the correct date — you never need to add or subtract an hour manually.",
  },
  {
    question: "Why does another city show a different date, not just a different time?",
    answer:
      "Time zones span more than 24 hours across the globe, so when it is late evening in the Americas it can already be the next calendar day in Asia or Oceania. The clock accounts for this day-wrapping across the International Date Line, showing both the correct local time and the correct local date for every city.",
  },
  {
    question: "What is UTC and why does it matter for scheduling?",
    answer:
      "UTC (Coordinated Universal Time) is the global reference from which every time zone is offset (UTC+9 for Tokyo, UTC-5 for New York in winter). Because UTC never observes daylight saving, converting all meeting times to UTC first — then back to each participant's local time — is the most reliable way to avoid cross-zone scheduling errors.",
  },
  {
    question: "Is my location or time data sent to a server?",
    answer:
      "No. All time calculations run entirely in your browser using local system time and the built-in time zone database. No location or clock data is transmitted or stored, so the tool works the same whether you are online or offline once loaded.",
  },
];

import type { CityData } from 'city-timezones';

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
  const [cityMappingData, setCityMappingData] = useState<CityData[]>([]);
  const faqJsonLd = useFaqJsonLd(faqs);

  useEffect(() => {
    import('city-timezones').then(m => setCityMappingData(m.cityMapping));
  }, []);

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
    for (const c of cityMappingData) {
      if (resultsMap.size >= 30) break; // Performance limit
      if (
        normalizeString(c.city).includes(lowerQ) ||
        ((c as any).admin_name && normalizeString((c as any).admin_name).includes(lowerQ)) ||
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
  }, [searchQuery, cityMappingData]);

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

      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Why World Clock Tools Matter for Modern Teams
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Remote and distributed work has made time zone awareness a daily requirement. When a team spans New York, London, and Singapore, every meeting request requires mental arithmetic: adding five hours here, subtracting eight there, and then remembering which cities are currently observing daylight saving time. A world clock removes this friction entirely, showing the correct local time in any city the moment you look.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Business travelers, international traders, and customer support teams are the heaviest users. A financial analyst timing a trade execution needs exact market hours — the New York Stock Exchange opens at 9:30 AM EST, while the London Stock Exchange opens at 8:00 AM GMT. Knowing the live time difference prevents costly errors. Similarly, a support team handling tickets from three continents needs to know which regional office is currently staffed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          UTC (Coordinated Universal Time) is the global reference standard. Every time zone is expressed as UTC+N or UTC-N. New York is UTC-5 (UTC-4 during EDT), London is UTC+0 (UTC+1 during BST), Tokyo is UTC+9 year-round. When scheduling across zones, convert all times to UTC first, then back to each local time — this eliminates daylight saving confusion because UTC never changes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Daylight saving time (DST) is the most common source of world clock errors. The United States and Europe transition on different dates: the US shifts in early March and November, while most of Europe transitions in late March and October. This creates a two-week window each spring and fall when the US-Europe time difference is off by one hour from its usual value. Always verify DST status rather than relying on a fixed offset.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.answer}</p>
            </li>
          ))}
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
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "features", label: "Features" },
        { id: "use-cases", label: "Why It Matters" },
        { id: "faq", label: "FAQ" },
      ]}
      contentMaxWidth="max-w-4xl"
      showSidebar={false}
    />
  );
}
