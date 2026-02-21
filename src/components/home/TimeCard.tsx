import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

export default function TimeCard() {
    const [time, setTime] = useState(new Date());

    // Hydration safety: use effect to start the clock only after mount
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full max-w-5xl mx-auto mb-14 flex flex-col items-center justify-center py-12 px-4 min-h-[300px]">
                {/* Placeholder while loading to prevent layout shift */}
            </div>
        );
    }

    // Format the time as HH:MM:SS
    const timeString = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    // Format the date (e.g., Friday, 20 February, 2026)
    const dateString = time.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Calculate week number (ISO standard)
    const getWeekNumber = (d: Date) => {
        const date = new Date(d.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        const week1 = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    };

    const weekNum = getWeekNumber(time);

    return (
        <div className="w-full max-w-5xl mx-auto mb-16 flex flex-col items-center justify-center py-10 px-4">
            {/* Time Display */}
            <h1
                className="text-[6rem] sm:text-[9rem] md:text-[12rem] lg:text-[14rem] font-black tracking-tighter text-slate-800 dark:text-slate-100 leading-none select-none"
                style={{ fontVariantNumeric: 'tabular-nums' }}
            >
                {timeString}
            </h1>

            {/* Date and Week Info */}
            <div className="text-xl sm:text-3xl md:text-4xl text-slate-500 dark:text-slate-400 mt-2 sm:mt-4 font-light text-center select-none">
                {dateString}, week {weekNum}
            </div>
        </div>
    );
}
