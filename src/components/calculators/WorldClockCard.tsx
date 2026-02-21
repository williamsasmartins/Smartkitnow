import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Globe2 } from 'lucide-react';

const CITIES = [
    { name: 'Local', tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'São Paulo', tz: 'America/Sao_Paulo' },
];

export function WorldClockCard() {
    const [now, setNow] = useState(new Date());
    const [selectedCity, setSelectedCity] = useState(CITIES[0]);

    // Clean interval unmount prevents memory leaks.
    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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

    return (
        <Card className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md rounded-2xl overflow-hidden transition-all duration-300">
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

                {/* Timezone Switcher */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-2xl">
                    {CITIES.map((city) => (
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
            </CardContent>
        </Card>
    );
}
