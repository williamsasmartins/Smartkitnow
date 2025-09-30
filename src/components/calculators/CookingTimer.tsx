import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, Square, RotateCcw } from "lucide-react";

const CookingTimer = () => {
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('15');
  const [seconds, setSeconds] = useState<string>('0');
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for timer sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmASBTm7z+Pt2n7+IjmMz+LqwmM0CQYDjjqzqQ==');
    audioRef.current.volume = 0.5;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, remainingSeconds]);

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log('Audio play failed:', e));
    }
    // Also show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Cooking Timer', {
        body: 'Time\'s up! Your cooking timer has finished.',
        icon: '/favicon.ico'
      });
    }
  };

  const startTimer = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const total = h * 3600 + m * 60 + s;

    if (total > 0) {
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setIsRunning(true);
      setIsPaused(false);

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    setTotalSeconds(0);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(totalSeconds);
  };

  const formatTime = (totalSecs: number): string => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  const presetTimes = [
    { label: '1 min', h: 0, m: 1, s: 0 },
    { label: '5 min', h: 0, m: 5, s: 0 },
    { label: '10 min', h: 0, m: 10, s: 0 },
    { label: '15 min', h: 0, m: 15, s: 0 },
    { label: '30 min', h: 0, m: 30, s: 0 },
    { label: '1 hour', h: 1, m: 0, s: 0 }
  ];

  const setPresetTime = (h: number, m: number, s: number) => {
    if (!isRunning) {
      setHours(h.toString());
      setMinutes(m.toString());
      setSeconds(s.toString());
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Cooking Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning && !isPaused ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seconds">Seconds</Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quick Presets</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {presetTimes.map((preset, index) => (
                    <Button 
                      key={index}
                      variant="calculate"
                      size="sm"
                      onClick={() => setPresetTime(preset.h, preset.m, preset.s)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={startTimer} className="w-full" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start Timer
              </Button>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="text-6xl font-mono font-bold text-primary">
                  {formatTime(remainingSeconds)}
                </div>
                
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>

                {remainingSeconds === 0 && (
                  <Badge variant="destructive" className="text-lg p-3 animate-pulse">
                    Time's Up!
                  </Badge>
                )}

                {isPaused && remainingSeconds > 0 && (
                  <Badge variant="secondary" className="text-lg p-3">
                    Paused
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 justify-center">
                {remainingSeconds > 0 && (
                  <>
                    {!isPaused ? (
                      <Button onClick={pauseTimer} variant="outline">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button onClick={resumeTimer}>
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button onClick={resetTimer} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </>
                )}
                <Button onClick={stopTimer} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            </div>
          )}

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Timer Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Set multiple timers for different cooking stages</li>
              <li>• Use quick presets for common cooking times</li>
              <li>• Browser notifications will alert you when time's up</li>
              <li>• Timer continues running even if you switch tabs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookingTimer;