import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import SEOHead from "@/components/SEOHead";

// Mirror structure of FinancialCategory

type Item = { name: string; slug: string };

// Bitrate, File Size & Storage (12)
const bitrateStorage: Item[] = [
  { name: "Video Bitrate ↔ File Size Calculator", slug: "video-bitrate-file-size" },
  { name: "Recording Time vs Card/SSD Capacity", slug: "recording-time-card-ssd-capacity" },
  { name: "Audio Bitrate + Channels Impact (File Size)", slug: "audio-bitrate-channels-impact-file-size" },
  { name: "VBR vs CBR Size Estimator", slug: "vbr-cbr-size-estimator" },
  { name: "Uncompressed Video Size (Resolution × Bit Depth)", slug: "uncompressed-video-size-resolution-bit-depth" },
  { name: "H.264/H.265 Target Bitrate Helper (by resolution/FPS)", slug: "h264-h265-target-bitrate-helper-resolution-fps" },
  { name: "YouTube/Twitch Recommended Bitrate (Upload/Stream) Checker", slug: "youtube-twitch-recommended-bitrate-checker" },
  { name: "Surveillance/NVR Video Storage Planner", slug: "surveillance-nvr-video-storage-planner" },
  { name: "Live Streaming Bitrate Calculator", slug: "live-streaming-bitrate-calculator" },
  { name: "Video Data Rate Calculator (Mbps ↔ MB/s)", slug: "video-data-rate-calculator" },
  { name: "Video Compression Size Estimator (H.264/etc.)", slug: "video-compression-size-estimator" },
  { name: "Camera Bitrate to Record Time Converter", slug: "camera-bitrate-record-time-converter" },
];

// Resolution, Aspect Ratio & Pixels (9)
const resolutionAspectPixels: Item[] = [
  { name: "Aspect Ratio Calculator (Letterbox/Pillarbox)", slug: "aspect-ratio-letterbox-pillarbox" },
  { name: "Resolution Presets & Pixel Count (720p/1080p/4K/8K)", slug: "resolution-presets-pixel-count-720p-1080p-4k-8k" },
  { name: "16:9 → 9:16/1:1 Crop & Safe Area Helper", slug: "16-9-to-9-16-1-1-crop-safe-area-helper" },
  { name: "DPI/PPI ↔ Pixels (Print/Display)", slug: "dpi-ppi-pixels-print-display" },
  { name: "Screen Size from Diagonal & AR", slug: "screen-size-from-diagonal-ar" },
  { name: "TV Size & Viewing Distance Planner", slug: "tv-size-viewing-distance-planner" },
  { name: "Pixel Aspect Ratio (PAR) Converter", slug: "pixel-aspect-ratio-par-converter" },
  { name: "Anamorphic Lens Calculator", slug: "anamorphic-lens-calculator" },
  { name: "Video Crop Dimension Calculator", slug: "video-crop-dimension-calculator" },
];

// Time, FPS & Timecode (9)
const timeFpsTimecode: Item[] = [
  { name: "Timecode ↔ Duration (HH:MM:SS:FF) Converter", slug: "timecode-duration-hh-mm-ss-ff-converter" },
  { name: "FPS Converter (23.976↔24↔25↔29.97↔30↔50↔59.94)", slug: "fps-converter-23-976-24-25-29-97-30-50-59-94" },
  { name: "Shutter Angle/Speed Helper (180° Rule)", slug: "shutter-angle-speed-helper-180-degree-rule" },
  { name: "Slow-Mo & Speed-Ramp Time Calculator", slug: "slow-mo-speed-ramp-time-calculator" },
  { name: "Frame Count ↔ Duration Converter", slug: "frame-count-duration-converter" },
  { name: "Frames to Timecode Calculator", slug: "frames-to-timecode-calculator" },
  { name: "Timecode Addition/Subtraction Calculator", slug: "timecode-addition-subtraction-calculator" },
  { name: "Drop Frame Timecode Converter", slug: "drop-frame-timecode-converter" },
  { name: "Timecode to Frames Calculator", slug: "timecode-to-frames-calculator" },
];

// Video Rendering & Export (10)
const renderingExport: Item[] = [
  { name: "3D Render Time Calculator", slug: "3d-render-time-calculator" },
  { name: "Render Farm Cost Estimator", slug: "render-farm-cost-estimator" },
  { name: "Video Export Time Estimator", slug: "video-export-time-estimator" },
  { name: "GPU Render Performance Calculator", slug: "gpu-render-performance-calculator" },
  { name: "Render Time Per Frame Calculator", slug: "render-time-per-frame-calculator" },
  { name: "Cloud Render Queue Planner", slug: "cloud-render-queue-planner" },
  { name: "Video Rendering Hardware Requirement Calculator", slug: "video-rendering-hardware-requirement-calculator" },
  { name: "3D Render Farm Time Calculator", slug: "3d-render-farm-time-calculator" },
  { name: "Animation Render Duration Estimator", slug: "animation-render-duration-estimator" },
  { name: "Multi-Workstation Render Time Calculator", slug: "multi-workstation-render-time-calculator" },
];

// Audio Processing & Engineering (11)
const audioEngineering: Item[] = [
  { name: "Amplifier Power Required Calculator", slug: "amplifier-power-required-calculator" },
  { name: "dBu to dBV Conversion Calculator", slug: "dbu-dbv-conversion-calculator" },
  { name: "Sound Pressure Level (SPL) Calculator", slug: "sound-pressure-level-spl-calculator" },
  { name: "Speaker Placement Calculator", slug: "speaker-placement-calculator" },
  { name: "Cable Length Impact Calculator", slug: "cable-length-impact-calculator" },
  { name: "Inverse Square Law Calculator", slug: "inverse-square-law-calculator" },
  { name: "Ohm's Law for Audio Calculator", slug: "ohms-law-for-audio-calculator" },
  { name: "Speaker Crossover Calculator", slug: "speaker-crossover-calculator" },
  { name: "Decibel Power Ratio Calculator", slug: "decibel-power-ratio-calculator" },
  { name: "Audio File Size Estimator", slug: "audio-file-size-estimator" },
  { name: "Wavelength and Frequency Calculator", slug: "wavelength-frequency-calculator" },
];

const TOTAL =
  bitrateStorage.length +
  resolutionAspectPixels.length +
  timeFpsTimecode.length +
  renderingExport.length +
  audioEngineering.length; // 51

export default function VideoCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Video Calculators"
        description="Explore 51 video calculators spanning bitrate & file size, resolution & pixels, timecode & FPS, rendering & export, and audio engineering. Fast tools for editing, streaming, and production."
        canonical="https://www.smartkitnow.com/video"
        robots="index,follow"
        og={{ type: "website", url: "https://www.smartkitnow.com/video", siteName: "Smart Kit Now" }}
        twitter={{ card: "summary_large_image" }}
        extra={[{ name: "keywords", content: "video calculators, bitrate calculator, file size, storage planner, surveillance NVR, live streaming bitrate, data rate Mbps MB/s, compression H.264 H.265, camera bitrate recording time, aspect ratio calculator, pixel count, crop safe area, DPI PPI, screen size diagonal, viewing distance, pixel aspect ratio PAR, anamorphic lens calculator, video crop dimensions, timecode converter, FPS converter, shutter angle 180 degree rule, slow motion speed ramp, frames to timecode, drop frame NTSC, 3D render time, render farm cost, export time estimator, GPU render performance, render per frame, cloud render queue, hardware requirements, amplifier power, dBu dBV, SPL calculator, speaker placement, inverse square law, ohm's law audio, speaker crossover, decibel power ratio, audio file size, wavelength frequency" }]}
      />
      {/* offset below fixed header */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* left column: header + content */}
          <div className="lg:col-span-9 pr-[15px]">
            {/* HERO */}
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="📺" size={38} className="text-primary" label="Video" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Video Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Professional-grade helpers for {TOTAL} topics: bitrate ↔ file size & storage, resolution & aspect ratios, timecode & FPS tools, video rendering & export planning, and audio engineering essentials.
                    </p>
                    <p>
                      Bitrate & storage: convert bitrate to file size, estimate recording time vs card/SSD capacity, account for audio bitrate/channels, compare VBR vs CBR, uncompressed size by resolution and bit depth, target bitrates for H.264/H.265 by resolution/FPS, platform recommendations (YouTube/Twitch), surveillance/NVR storage, live streaming bitrate, video data rate (Mbps↔MB/s) and compression size, plus camera bitrate to record time.
                    </p>
                    <p>
                      Resolution & pixels: aspect ratio calculator with letterbox/pillarbox guidance, resolution presets & pixel counts (720p/1080p/4K/8K), crop helpers (16:9↔9:16/1:1 safe areas), DPI/PPI↔pixels for print/display, screen size from diagonal & AR, TV viewing distance, PAR (pixel aspect ratio) converter, anamorphic lens calculator, and crop dimension calculator.
                    </p>
                    <p>
                      Time/FPS/timecode: timecode↔duration, FPS conversions (23.976/24/25/29.97/30/50/59.94), shutter angle/speed (180° rule), slow-mo & speed ramps, frame count↔duration, frames↔timecode, timecode addition/subtraction, drop-frame conversions, and broadcast-friendly NTSC handling.
                    </p>
                    <p>
                      Rendering & export: 3D render time, render farm cost, export time estimation, GPU performance, per-frame render time, cloud render queue, hardware requirement planning (CPU/GPU/RAM), render farm duration, animation total render time, and multi-workstation scheduling.
                    </p>
                    <p>
                      Audio engineering: amplifier power requirements, dBu↔dBV conversion, SPL at listening positions, speaker placement, cable length impact, inverse square law, ohm's law for audio, speaker crossover design, decibel↔power ratios, audio file size by bitrate/duration, and wavelength↔frequency calculators.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    {TOTAL} calculators for editing, streaming and production: bitrate↔file size & storage, resolution & pixels, timecode & FPS, rendering & export, and audio engineering. Includes surveillance/NVR planning, live streaming bitrate, PAR/anamorphic tools, drop-frame timecode, cloud render queue, and amplifier/SPL calculators.
                  </p>
                )}
                {!descExpanded && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                    onClick={() => setDescExpanded(true)}
                    aria-expanded={descExpanded}
                  >
                    Read More
                  </button>
                )}
              </div>
            </header>

            <Section
              emoji="💾"
              title={`Bitrate, File Size & Storage (${bitrateStorage.length})`}
              description="Bitrate↔file size, recording time vs capacity, audio channels impact, VBR vs CBR, uncompressed size, target bitrates (H.264/H.265), platform recommendations, surveillance/NVR planning, live streaming bitrate, data rate (Mbps↔MB/s), compression size, camera bitrate to record time."
              items={bitrateStorage}
              base="/video"
            />

            <Section
              emoji="🖼️"
              title={`Resolution, Aspect Ratio & Pixels (${resolutionAspectPixels.length})`}
              description="Aspect ratios with letterbox/pillarbox, resolution presets & pixel counts, crop & safe areas (16:9↔9:16/1:1), DPI/PPI↔pixels, screen size from diagonal & AR, TV viewing distance, PAR converter, anamorphic lens, crop dimensions."
              items={resolutionAspectPixels}
              base="/video"
            />

            <Section
              emoji="⏱️"
              title={`Time, FPS & Timecode (${timeFpsTimecode.length})`}
              description="Timecode↔duration, FPS conversions, shutter angle/speed (180°), slow motion & speed ramps, frame count↔duration, frames↔timecode, timecode math, drop-frame NTSC, timecode↔frames conversions."
              items={timeFpsTimecode}
              base="/video"
            />

            <Section
              emoji="🎬"
              title={`Video Rendering & Export (${renderingExport.length})`}
              description="3D render time, render farm cost, video export time, GPU performance, per-frame render, cloud render queue, hardware requirements, farm duration, animation render totals, multi-workstation time."
              items={renderingExport}
              base="/video"
            />

            <Section
              emoji="🔊"
              title={`Audio Processing & Engineering (${audioEngineering.length})`}
              description="Amplifier power, dBu↔dBV conversion, SPL at positions, speaker placement, cable length impact, inverse square law, ohm's law (audio), speaker crossover design, dB↔power ratios, audio file size, wavelength↔frequency."
              items={audioEngineering}
              base="/video"
            />

            {/* bottom boxes: Share + Suggest */}
            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

          {/* right rail */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky pr-[65px]" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ---------- helpers ---------- */

function splitTwoColumns<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function Section({
  emoji,
  title,
  description,
  items,
  base,
}: {
  emoji: string;
  title: string;
  description: string;
  items: Item[];
  base: string;
}) {
  const [left, right] = splitTwoColumns(items);

  return (
    <section className="mb-12">
      {/* section heading with emoji */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>

      <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">{description}</p>

      {/* two-column list */}
      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <ul className="list-disc ml-6 space-y-2.5">
          {left.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="list-disc ml-6 space-y-2.5">
          {right.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
