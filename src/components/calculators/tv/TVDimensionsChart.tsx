import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TVDimensionsChart() {
  const tvSizes = [
    { diagonal: 32, width: 27.9, height: 15.7 },
    { diagonal: 40, width: 34.9, height: 19.6 },
    { diagonal: 43, width: 37.5, height: 21.1 },
    { diagonal: 50, width: 43.6, height: 24.5 },
    { diagonal: 55, width: 48.0, height: 27.0 },
    { diagonal: 65, width: 56.7, height: 31.9 },
    { diagonal: 75, width: 65.4, height: 36.8 },
    { diagonal: 85, width: 74.1, height: 41.7 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          16:9 TV Dimensions – Screen Size Chart
        </h1>
        <p className="text-xl text-muted-foreground">
          Reference chart for standard TV dimensions in 16:9 aspect ratio
        </p>
      </div>

      {/* Main Chart */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>TV Size Chart (16:9 Aspect Ratio)</CardTitle>
          <CardDescription>
            Width and height dimensions for common TV sizes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Diagonal Size</th>
                  <th className="text-left p-4 font-semibold">Width</th>
                  <th className="text-left p-4 font-semibold">Height</th>
                  <th className="text-left p-4 font-semibold">Area</th>
                  <th className="text-left p-4 font-semibold">Recommended Distance</th>
                </tr>
              </thead>
              <tbody>
                {tvSizes.map((tv, index) => (
                  <tr key={tv.diagonal} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="p-4">
                      <div className="font-semibold text-primary">{tv.diagonal}"</div>
                      <div className="text-sm text-muted-foreground">{(tv.diagonal * 2.54).toFixed(0)} cm</div>
                    </td>
                    <td className="p-4">
                      <div>{tv.width.toFixed(1)}"</div>
                      <div className="text-sm text-muted-foreground">{(tv.width * 2.54).toFixed(0)} cm</div>
                    </td>
                    <td className="p-4">
                      <div>{tv.height.toFixed(1)}"</div>
                      <div className="text-sm text-muted-foreground">{(tv.height * 2.54).toFixed(0)} cm</div>
                    </td>
                    <td className="p-4">
                      <div>{(tv.width * tv.height).toFixed(0)} sq in</div>
                      <div className="text-sm text-muted-foreground">{((tv.width * tv.height) * 6.452).toFixed(0)} sq cm</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>4K: {(tv.diagonal * 1.2 / 12).toFixed(1)} ft</div>
                        <div>1080p: {(tv.diagonal * 2.0 / 12).toFixed(1)} ft</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visual Size Comparison */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Visual Size Comparison</CardTitle>
          <CardDescription>
            Relative sizes of different TV screens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tvSizes.map((tv) => (
              <div key={tv.diagonal} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-semibold">{tv.diagonal}"</div>
                <div className="flex-1">
                  <div 
                    className="bg-gradient-primary rounded border border-primary/20 flex items-center justify-center text-white text-xs font-medium"
                    style={{
                      width: `${(tv.width / 75) * 100}%`,
                      height: `${(tv.height / 75) * 100 * 0.6}rem`,
                      minHeight: '20px'
                    }}
                  >
                    {tv.width.toFixed(1)}" × {tv.height.toFixed(1)}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Size Recommendations */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Room Size Recommendations</CardTitle>
          <CardDescription>
            Which TV size works best for your room
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">Small Rooms</div>
              <div className="text-sm text-muted-foreground mb-2">8-10 feet viewing distance</div>
              <div className="text-sm">32"-43" TVs</div>
              <div className="text-xs text-muted-foreground">Bedrooms, small apartments</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">Medium Rooms</div>
              <div className="text-sm text-muted-foreground mb-2">10-14 feet viewing distance</div>
              <div className="text-sm">50"-65" TVs</div>
              <div className="text-xs text-muted-foreground">Living rooms, family rooms</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="font-semibold text-primary">Large Rooms</div>
              <div className="text-sm text-muted-foreground mb-2">14+ feet viewing distance</div>
              <div className="text-sm">75"-85" TVs</div>
              <div className="text-xs text-muted-foreground">Large living rooms, home theaters</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Notes */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
          <CardDescription>
            Key information about TV dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Measurement Standards</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Diagonal size is measured corner to corner</li>
                <li>• Dimensions are for screen only (not including bezel)</li>
                <li>• All measurements assume 16:9 aspect ratio</li>
                <li>• Actual dimensions may vary slightly by manufacturer</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Planning Considerations</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Add 2-4 inches to each dimension for the bezel</li>
                <li>• Consider stand depth for table mounting</li>
                <li>• Account for wall mount bracket dimensions</li>
                <li>• Check clearance for cable connections</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
