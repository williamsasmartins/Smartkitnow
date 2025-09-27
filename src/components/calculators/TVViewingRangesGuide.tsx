import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TVViewingRangesGuide() {
  const viewingData = [
    { size: 32, minFeet: 4.0, maxFeet: 6.7, optimal4K: 2.7, optimal1080p: 5.3 },
    { size: 40, minFeet: 5.0, maxFeet: 8.3, optimal4K: 3.3, optimal1080p: 6.7 },
    { size: 43, minFeet: 5.4, maxFeet: 9.0, optimal4K: 3.6, optimal1080p: 7.2 },
    { size: 50, minFeet: 6.3, maxFeet: 10.4, optimal4K: 4.2, optimal1080p: 8.3 },
    { size: 55, minFeet: 6.9, maxFeet: 11.5, optimal4K: 4.6, optimal1080p: 9.2 },
    { size: 65, minFeet: 8.1, maxFeet: 13.5, optimal4K: 5.4, optimal1080p: 10.8 },
    { size: 75, minFeet: 9.4, maxFeet: 15.6, optimal4K: 6.3, optimal1080p: 12.5 },
    { size: 85, minFeet: 10.6, maxFeet: 17.7, optimal4K: 7.1, optimal1080p: 14.2 }
  ];

  const roomTypes = [
    {
      type: "Bedroom",
      distance: "6-8 feet",
      recommended: "32\"-43\"",
      notes: "Close viewing, smaller space"
    },
    {
      type: "Living Room",
      distance: "8-12 feet",
      recommended: "50\"-65\"",
      notes: "Family viewing, medium space"
    },
    {
      type: "Family Room",
      distance: "10-15 feet",
      recommended: "65\"-75\"",
      notes: "Multiple viewers, larger space"
    },
    {
      type: "Home Theater",
      distance: "12+ feet",
      recommended: "75\"-85\"",
      notes: "Cinematic experience"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          TV Size and Viewing Distance Ranges
        </h1>
        <p className="text-xl text-muted-foreground">
          Recommended viewing distances for different TV sizes and optimal room setup
        </p>
      </div>

      {/* Main Viewing Distance Chart */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Viewing Distance Recommendations</CardTitle>
          <CardDescription>
            Optimal viewing distances by TV size and resolution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">TV Size</th>
                  <th className="text-left p-4 font-semibold">Min Distance</th>
                  <th className="text-left p-4 font-semibold">Max Distance</th>
                  <th className="text-left p-4 font-semibold">4K Optimal</th>
                  <th className="text-left p-4 font-semibold">1080p Optimal</th>
                  <th className="text-left p-4 font-semibold">Room Type</th>
                </tr>
              </thead>
              <tbody>
                {viewingData.map((tv, index) => (
                  <tr key={tv.size} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="p-4">
                      <div className="font-semibold text-primary">{tv.size}"</div>
                    </td>
                    <td className="p-4">{tv.minFeet} ft</td>
                    <td className="p-4">{tv.maxFeet} ft</td>
                    <td className="p-4">
                      <div className="font-semibold text-green-600">{tv.optimal4K} ft</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-blue-600">{tv.optimal1080p} ft</div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {tv.size <= 43 ? "Bedroom" : 
                       tv.size <= 55 ? "Living Room" : 
                       tv.size <= 75 ? "Family Room" : "Home Theater"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visual Viewing Distance Guide */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Visual Viewing Distance Guide</CardTitle>
          <CardDescription>
            Compare optimal distances for different TV sizes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {viewingData.slice(0, 6).map((tv) => (
              <div key={tv.size} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{tv.size}" TV</span>
                  <span className="text-sm text-muted-foreground">
                    4K: {tv.optimal4K} ft | 1080p: {tv.optimal1080p} ft
                  </span>
                </div>
                <div className="relative h-8 bg-muted/30 rounded overflow-hidden">
                  {/* Minimum to Maximum range */}
                  <div 
                    className="absolute top-0 h-full bg-gradient-to-r from-red-200 to-yellow-200 dark:from-red-900 dark:to-yellow-900"
                    style={{
                      left: 0,
                      width: `${(tv.maxFeet / 18) * 100}%`
                    }}
                  />
                  {/* 4K Optimal */}
                  <div 
                    className="absolute top-1 h-6 bg-green-500 rounded"
                    style={{
                      left: `${(tv.optimal4K / 18) * 100}%`,
                      width: '4px'
                    }}
                  />
                  {/* 1080p Optimal */}
                  <div 
                    className="absolute top-1 h-6 bg-blue-500 rounded"
                    style={{
                      left: `${(tv.optimal1080p / 18) * 100}%`,
                      width: '4px'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Too Close</span>
                  <span>Good Range</span>
                  <span>Too Far</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>4K Optimal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>1080p Optimal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Type Recommendations */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Room Type Recommendations</CardTitle>
          <CardDescription>
            TV size suggestions based on room type and typical viewing distance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {roomTypes.map((room, index) => (
              <div key={room.type} className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold text-primary text-lg mb-2">{room.type}</div>
                <div className="space-y-1 text-sm">
                  <div><strong>Typical Distance:</strong> {room.distance}</div>
                  <div><strong>Recommended Size:</strong> {room.recommended}</div>
                  <div className="text-muted-foreground">{room.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guidelines and Tips */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Viewing Guidelines</CardTitle>
            <CardDescription>
              Best practices for optimal viewing experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded">
                <div className="font-semibold text-sm">Field of View</div>
                <div className="text-xs text-muted-foreground">
                  TV should fill 30-40% of your field of view for immersive experience
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded">
                <div className="font-semibold text-sm">Eye Level</div>
                <div className="text-xs text-muted-foreground">
                  Center of TV should be at seated eye level (typically 42" from floor)
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded">
                <div className="font-semibold text-sm">Lighting</div>
                <div className="text-xs text-muted-foreground">
                  Avoid direct light on screen; use ambient lighting for comfort
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded">
                <div className="font-semibold text-sm">Resolution Matters</div>
                <div className="text-xs text-muted-foreground">
                  4K allows closer viewing than 1080p without seeing pixels
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Common Mistakes</CardTitle>
            <CardDescription>
              What to avoid when choosing TV size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border-l-4 border-red-500">
                <div className="font-semibold text-sm text-red-800 dark:text-red-200">Too Big for Room</div>
                <div className="text-xs text-red-700 dark:text-red-300">
                  Causes eye strain and neck movement to see entire screen
                </div>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border-l-4 border-yellow-500">
                <div className="font-semibold text-sm text-yellow-800 dark:text-yellow-200">Too Small for Distance</div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300">
                  Reduces immersion and makes details hard to see
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
                <div className="font-semibold text-sm text-blue-800 dark:text-blue-200">Ignoring Furniture</div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Not accounting for TV stand or furniture depth
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded border-l-4 border-purple-500">
                <div className="font-semibold text-sm text-purple-800 dark:text-purple-200">Wrong Height</div>
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  Mounting too high causes neck strain during viewing
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}