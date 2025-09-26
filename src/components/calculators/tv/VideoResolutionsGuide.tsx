import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VideoResolutionsGuide() {
  const resolutions = [
    {
      name: "720p HD",
      width: 1280,
      height: 720,
      pixels: "0.9M",
      aspectRatio: "16:9",
      common: "Budget TVs, streaming",
      quality: "Basic"
    },
    {
      name: "1080p Full HD",
      width: 1920,
      height: 1080,
      pixels: "2.1M",
      aspectRatio: "16:9",
      common: "Standard TVs, Blu-ray",
      quality: "Good"
    },
    {
      name: "1440p QHD",
      width: 2560,
      height: 1440,
      pixels: "3.7M",
      aspectRatio: "16:9",
      common: "Gaming monitors",
      quality: "High"
    },
    {
      name: "4K UHD",
      width: 3840,
      height: 2160,
      pixels: "8.3M",
      aspectRatio: "16:9",
      common: "Modern TVs, streaming",
      quality: "Very High"
    },
    {
      name: "5K",
      width: 5120,
      height: 2880,
      pixels: "14.7M",
      aspectRatio: "16:9",
      common: "Pro monitors",
      quality: "Ultra High"
    },
    {
      name: "8K UHD",
      width: 7680,
      height: 4320,
      pixels: "33.2M",
      aspectRatio: "16:9",
      common: "Premium TVs",
      quality: "Extreme"
    }
  ];

  const aspectRatios = [
    {
      ratio: "4:3",
      decimal: "1.33:1",
      description: "Traditional TV/Monitor",
      example: "1024×768, 1600×1200"
    },
    {
      ratio: "16:10",
      decimal: "1.6:1",
      description: "Computer Monitors",
      example: "1920×1200, 2560×1600"
    },
    {
      ratio: "16:9",
      decimal: "1.78:1",
      description: "Modern TV/Monitor",
      example: "1920×1080, 3840×2160"
    },
    {
      ratio: "21:9",
      decimal: "2.33:1",
      description: "Ultrawide Monitors",
      example: "2560×1080, 3440×1440"
    },
    {
      ratio: "32:9",
      decimal: "3.56:1",
      description: "Super Ultrawide",
      example: "3840×1080, 5120×1440"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Common Video Display Resolutions and Aspect Ratios
        </h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive guide to standard video formats and resolutions
        </p>
      </div>

      {/* Resolution Comparison */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Display Resolutions</CardTitle>
          <CardDescription>
            Common video and display resolutions with pixel counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Resolution</th>
                  <th className="text-left p-4 font-semibold">Dimensions</th>
                  <th className="text-left p-4 font-semibold">Total Pixels</th>
                  <th className="text-left p-4 font-semibold">Aspect Ratio</th>
                  <th className="text-left p-4 font-semibold">Common Use</th>
                  <th className="text-left p-4 font-semibold">Quality</th>
                </tr>
              </thead>
              <tbody>
                {resolutions.map((res, index) => (
                  <tr key={res.name} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="p-4">
                      <div className="font-semibold text-primary">{res.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm">{res.width} × {res.height}</div>
                    </td>
                    <td className="p-4">
                      <div>{res.pixels} pixels</div>
                      <div className="text-xs text-muted-foreground">
                        {(res.width * res.height).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">{res.aspectRatio}</td>
                    <td className="p-4 text-sm">{res.common}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        res.quality === "Basic" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                        res.quality === "Good" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                        res.quality === "High" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                        res.quality === "Very High" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      }`}>
                        {res.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visual Resolution Comparison */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Visual Resolution Comparison</CardTitle>
          <CardDescription>
            Relative sizes of different resolutions (16:9 aspect ratio)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resolutions.filter(res => res.aspectRatio === "16:9").map((res) => (
              <div key={res.name} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-semibold">{res.name}</div>
                <div className="flex-1">
                  <div 
                    className="bg-gradient-primary rounded border border-primary/20 flex items-center justify-center text-white text-xs font-medium"
                    style={{
                      width: `${(res.width / 7680) * 100}%`,
                      height: `${Math.max((res.height / 7680) * 100 * 0.8, 0.8)}rem`,
                      minWidth: '80px'
                    }}
                  >
                    {res.width}×{res.height}
                  </div>
                </div>
                <div className="w-16 text-xs text-muted-foreground text-right">
                  {res.pixels}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aspect Ratios */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Common Aspect Ratios</CardTitle>
          <CardDescription>
            Different screen proportions and their uses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Aspect Ratio</th>
                  <th className="text-left p-4 font-semibold">Decimal</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-left p-4 font-semibold">Example Resolutions</th>
                  <th className="text-left p-4 font-semibold">Visual</th>
                </tr>
              </thead>
              <tbody>
                {aspectRatios.map((ar, index) => (
                  <tr key={ar.ratio} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="p-4">
                      <div className="font-semibold text-primary">{ar.ratio}</div>
                    </td>
                    <td className="p-4 font-mono text-sm">{ar.decimal}</td>
                    <td className="p-4">{ar.description}</td>
                    <td className="p-4 text-sm font-mono">{ar.example}</td>
                    <td className="p-4">
                      <div 
                        className="bg-gradient-primary rounded border border-primary/20"
                        style={{
                          width: '80px',
                          height: `${80 / parseFloat(ar.decimal.split(':')[0])}px`
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Resolution Benefits</CardTitle>
            <CardDescription>
              Advantages of higher resolutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold text-primary">4K vs 1080p</div>
                <div className="text-sm text-muted-foreground">4× more pixels, sharper detail, closer viewing</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold text-primary">8K vs 4K</div>
                <div className="text-sm text-muted-foreground">4× more pixels than 4K, future-proofing</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold text-primary">Higher PPI</div>
                <div className="text-sm text-muted-foreground">Better text clarity, reduced aliasing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Considerations</CardTitle>
            <CardDescription>
              Factors when choosing resolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold text-primary">Content Availability</div>
                <div className="text-sm text-muted-foreground">Limited 8K content, abundant 4K content</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold text-primary">Viewing Distance</div>
                <div className="text-sm text-muted-foreground">Higher resolution benefits closer viewing</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-semibold text-primary">Performance</div>
                <div className="text-sm text-muted-foreground">Higher resolution requires more processing power</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}