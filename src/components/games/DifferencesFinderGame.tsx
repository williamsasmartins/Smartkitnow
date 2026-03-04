import React, { useCallback, useEffect, useRef, useState } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────
const HS_KEY = "hs_differences-finder";

interface Difference {
  id: number;
  label: string;
  // The clickable zone in the SVG coordinate space (0-400 x 0-300)
  cx: number;
  cy: number;
  r: number;
}

interface Scene {
  id: number;
  name: string;
  background: string;
  differences: Difference[];
  renderBase: () => React.ReactElement;
  renderAlt: () => React.ReactElement;
}

// ─── SVG Scene Definitions ────────────────────────────────────────────────────

// SCENE 1: City
function CityBase() {
  return (
    <g>
      {/* Sky */}
      <rect width="400" height="180" fill="#87CEEB" />
      {/* Sun */}
      <circle cx="340" cy="50" r="30" fill="#FFD700" />
      {/* Clouds */}
      <ellipse cx="80" cy="40" rx="45" ry="20" fill="white" />
      <ellipse cx="110" cy="35" rx="30" ry="18" fill="white" />
      <ellipse cx="200" cy="55" rx="40" ry="16" fill="white" />
      {/* Ground */}
      <rect y="180" width="400" height="120" fill="#808080" />
      {/* Road */}
      <rect x="150" y="180" width="100" height="120" fill="#555" />
      {/* Road dashes */}
      <rect x="195" y="195" width="10" height="20" fill="white" />
      <rect x="195" y="225" width="10" height="20" fill="white" />
      <rect x="195" y="255" width="10" height="20" fill="white" />
      {/* Building 1 */}
      <rect x="10" y="80" width="80" height="200" fill="#4A90D9" />
      <rect x="20" y="90" width="20" height="25" fill="#87CEEB" />
      <rect x="50" y="90" width="20" height="25" fill="#87CEEB" />
      <rect x="20" y="125" width="20" height="25" fill="#87CEEB" />
      <rect x="50" y="125" width="20" height="25" fill="#87CEEB" />
      <rect x="20" y="160" width="20" height="25" fill="#87CEEB" />
      <rect x="50" y="160" width="20" height="25" fill="#87CEEB" />
      {/* Building 2 */}
      <rect x="110" y="100" width="60" height="180" fill="#E07B39" />
      <rect x="120" y="110" width="15" height="20" fill="#FFE082" />
      <rect x="145" y="110" width="15" height="20" fill="#FFE082" />
      <rect x="120" y="140" width="15" height="20" fill="#FFE082" />
      <rect x="145" y="140" width="15" height="20" fill="#FFE082" />
      {/* Building 3 */}
      <rect x="270" y="60" width="90" height="220" fill="#6A5ACD" />
      <rect x="280" y="75" width="20" height="25" fill="#ADD8E6" />
      <rect x="310" y="75" width="20" height="25" fill="#ADD8E6" />
      <rect x="280" y="110" width="20" height="25" fill="#ADD8E6" />
      <rect x="310" y="110" width="20" height="25" fill="#ADD8E6" />
      <rect x="280" y="145" width="20" height="25" fill="#ADD8E6" />
      <rect x="310" y="145" width="20" height="25" fill="#ADD8E6" />
      {/* Antenna on building 3 */}
      <line x1="315" y1="60" x2="315" y2="30" stroke="#333" strokeWidth="3" />
      <circle cx="315" cy="28" r="4" fill="red" />
      {/* Building 4 small */}
      <rect x="370" y="120" width="30" height="160" fill="#5F9EA0" />
      <rect x="375" y="130" width="10" height="12" fill="#B0E0E6" />
      <rect x="375" y="150" width="10" height="12" fill="#B0E0E6" />
      {/* Car */}
      <rect x="160" y="230" width="60" height="30" rx="5" fill="#CC0000" />
      <rect x="170" y="220" width="40" height="18" rx="4" fill="#CC0000" />
      <circle cx="175" cy="265" r="8" fill="#333" />
      <circle cx="215" cy="265" r="8" fill="#333" />
      {/* Streetlight */}
      <rect x="245" y="160" width="5" height="120" fill="#555" />
      <rect x="240" y="160" width="20" height="5" fill="#555" />
      <circle cx="250" cy="157" r="7" fill="#FFD700" />
      {/* Tree */}
      <rect x="55" y="220" width="8" height="60" fill="#8B4513" />
      <ellipse cx="59" cy="210" rx="22" ry="25" fill="#228B22" />
    </g>
  );
}

function CityAlt() {
  return (
    <g>
      {/* Sky - slightly different shade */}
      <rect width="400" height="180" fill="#87CEEB" />
      {/* Sun - DIFFERENCE 1: moved position */}
      <circle cx="340" cy="50" r="30" fill="#FF8C00" />
      {/* Clouds same */}
      <ellipse cx="80" cy="40" rx="45" ry="20" fill="white" />
      <ellipse cx="110" cy="35" rx="30" ry="18" fill="white" />
      <ellipse cx="200" cy="55" rx="40" ry="16" fill="white" />
      {/* Ground */}
      <rect y="180" width="400" height="120" fill="#808080" />
      {/* Road */}
      <rect x="150" y="180" width="100" height="120" fill="#555" />
      {/* Road dashes */}
      <rect x="195" y="195" width="10" height="20" fill="white" />
      <rect x="195" y="225" width="10" height="20" fill="white" />
      <rect x="195" y="255" width="10" height="20" fill="white" />
      {/* Building 1 - DIFFERENCE 2: different color */}
      <rect x="10" y="80" width="80" height="200" fill="#228B22" />
      <rect x="20" y="90" width="20" height="25" fill="#87CEEB" />
      <rect x="50" y="90" width="20" height="25" fill="#87CEEB" />
      <rect x="20" y="125" width="20" height="25" fill="#87CEEB" />
      <rect x="50" y="125" width="20" height="25" fill="#87CEEB" />
      <rect x="20" y="160" width="20" height="25" fill="#87CEEB" />
      <rect x="50" y="160" width="20" height="25" fill="#87CEEB" />
      {/* Building 2 */}
      <rect x="110" y="100" width="60" height="180" fill="#E07B39" />
      <rect x="120" y="110" width="15" height="20" fill="#FFE082" />
      <rect x="145" y="110" width="15" height="20" fill="#FFE082" />
      {/* DIFFERENCE 3: missing window row */}
      <rect x="120" y="160" width="15" height="20" fill="#FFE082" />
      <rect x="145" y="160" width="15" height="20" fill="#FFE082" />
      {/* Building 3 */}
      <rect x="270" y="60" width="90" height="220" fill="#6A5ACD" />
      <rect x="280" y="75" width="20" height="25" fill="#ADD8E6" />
      <rect x="310" y="75" width="20" height="25" fill="#ADD8E6" />
      <rect x="280" y="110" width="20" height="25" fill="#ADD8E6" />
      <rect x="310" y="110" width="20" height="25" fill="#ADD8E6" />
      <rect x="280" y="145" width="20" height="25" fill="#ADD8E6" />
      <rect x="310" y="145" width="20" height="25" fill="#ADD8E6" />
      {/* DIFFERENCE 4: No antenna */}
      {/* Building 4 small */}
      <rect x="370" y="120" width="30" height="160" fill="#5F9EA0" />
      <rect x="375" y="130" width="10" height="12" fill="#B0E0E6" />
      <rect x="375" y="150" width="10" height="12" fill="#B0E0E6" />
      {/* Car - DIFFERENCE 5: different color */}
      <rect x="160" y="230" width="60" height="30" rx="5" fill="#0000CC" />
      <rect x="170" y="220" width="40" height="18" rx="4" fill="#0000CC" />
      <circle cx="175" cy="265" r="8" fill="#333" />
      <circle cx="215" cy="265" r="8" fill="#333" />
      {/* Streetlight */}
      <rect x="245" y="160" width="5" height="120" fill="#555" />
      <rect x="240" y="160" width="20" height="5" fill="#555" />
      <circle cx="250" cy="157" r="7" fill="#FFD700" />
      {/* Tree */}
      <rect x="55" y="220" width="8" height="60" fill="#8B4513" />
      <ellipse cx="59" cy="210" rx="22" ry="25" fill="#228B22" />
    </g>
  );
}

// SCENE 2: Jungle
function JungleBase() {
  return (
    <g>
      <rect width="400" height="300" fill="#1a4a1a" />
      <rect y="240" width="400" height="60" fill="#2d5a1b" />
      {/* Large trees */}
      <rect x="30" y="60" width="20" height="240" fill="#8B4513" />
      <ellipse cx="40" cy="50" rx="50" ry="70" fill="#228B22" />
      <ellipse cx="20" cy="80" rx="35" ry="50" fill="#2E8B57" />
      <ellipse cx="60" cy="70" rx="40" ry="55" fill="#006400" />

      <rect x="340" y="80" width="18" height="220" fill="#8B4513" />
      <ellipse cx="349" cy="65" rx="48" ry="65" fill="#228B22" />
      <ellipse cx="330" cy="95" rx="32" ry="45" fill="#2E8B57" />

      {/* Medium trees */}
      <rect x="160" y="100" width="14" height="200" fill="#6B3A2A" />
      <ellipse cx="167" cy="85" rx="38" ry="55" fill="#3CB371" />

      {/* Bushes */}
      <ellipse cx="90" cy="250" rx="40" ry="30" fill="#2E8B57" />
      <ellipse cx="200" cy="260" rx="50" ry="25" fill="#228B22" />
      <ellipse cx="320" cy="255" rx="45" ry="28" fill="#006400" />

      {/* Flowers */}
      <circle cx="130" cy="245" r="8" fill="#FF69B4" />
      <circle cx="250" cy="250" r="7" fill="#FFD700" />
      <circle cx="300" cy="248" r="6" fill="#FF4500" />

      {/* Vines */}
      <path d="M100 0 Q90 50 110 100 Q95 150 105 200" stroke="#4a7c3f" strokeWidth="4" fill="none" />
      <path d="M280 0 Q295 60 275 120 Q290 170 270 220" stroke="#4a7c3f" strokeWidth="4" fill="none" />

      {/* Animals */}
      {/* Parrot */}
      <ellipse cx="80" cy="130" rx="12" ry="16" fill="#FF0000" />
      <circle cx="80" cy="118" r="8" fill="#FF0000" />
      <polygon points="80,114 85,110 75,110" fill="#FFD700" />
      <ellipse cx="90" cy="130" rx="8" ry="5" fill="#00FF00" />

      {/* Monkey */}
      <circle cx="290" cy="120" r="18" fill="#8B6914" />
      <circle cx="290" cy="108" r="12" fill="#C8A97E" />
      <ellipse cx="297" cy="120" rx="6" ry="8" fill="#C8A97E" />

      {/* River */}
      <path d="M0 280 Q100 260 200 275 Q300 290 400 270" stroke="#1E90FF" strokeWidth="20" fill="none" opacity="0.7" />

      {/* Sun through leaves */}
      <circle cx="200" cy="30" r="25" fill="#FFD700" opacity="0.6" />
    </g>
  );
}

function JungleAlt() {
  return (
    <g>
      <rect width="400" height="300" fill="#1a4a1a" />
      <rect y="240" width="400" height="60" fill="#2d5a1b" />
      {/* Large trees */}
      <rect x="30" y="60" width="20" height="240" fill="#8B4513" />
      <ellipse cx="40" cy="50" rx="50" ry="70" fill="#228B22" />
      <ellipse cx="20" cy="80" rx="35" ry="50" fill="#2E8B57" />
      <ellipse cx="60" cy="70" rx="40" ry="55" fill="#006400" />

      <rect x="340" y="80" width="18" height="220" fill="#8B4513" />
      <ellipse cx="349" cy="65" rx="48" ry="65" fill="#228B22" />
      <ellipse cx="330" cy="95" rx="32" ry="45" fill="#2E8B57" />

      {/* Medium trees */}
      <rect x="160" y="100" width="14" height="200" fill="#6B3A2A" />
      <ellipse cx="167" cy="85" rx="38" ry="55" fill="#3CB371" />

      {/* Bushes */}
      <ellipse cx="90" cy="250" rx="40" ry="30" fill="#2E8B57" />
      <ellipse cx="200" cy="260" rx="50" ry="25" fill="#228B22" />
      <ellipse cx="320" cy="255" rx="45" ry="28" fill="#006400" />

      {/* DIFFERENCE 1: flowers changed color */}
      <circle cx="130" cy="245" r="8" fill="#9B59B6" />
      <circle cx="250" cy="250" r="7" fill="#FFD700" />
      <circle cx="300" cy="248" r="6" fill="#FF4500" />

      {/* Vines */}
      <path d="M100 0 Q90 50 110 100 Q95 150 105 200" stroke="#4a7c3f" strokeWidth="4" fill="none" />
      <path d="M280 0 Q295 60 275 120 Q290 170 270 220" stroke="#4a7c3f" strokeWidth="4" fill="none" />

      {/* DIFFERENCE 2: Parrot is green instead of red */}
      <ellipse cx="80" cy="130" rx="12" ry="16" fill="#00AA00" />
      <circle cx="80" cy="118" r="8" fill="#00AA00" />
      <polygon points="80,114 85,110 75,110" fill="#FFD700" />
      <ellipse cx="90" cy="130" rx="8" ry="5" fill="#FF0000" />

      {/* DIFFERENCE 3: Monkey has different face color */}
      <circle cx="290" cy="120" r="18" fill="#8B6914" />
      <circle cx="290" cy="108" r="12" fill="#FF8C69" />
      <ellipse cx="297" cy="120" rx="6" ry="8" fill="#FF8C69" />

      {/* River - DIFFERENCE 4: different color */}
      <path d="M0 280 Q100 260 200 275 Q300 290 400 270" stroke="#00CED1" strokeWidth="20" fill="none" opacity="0.7" />

      {/* Sun - DIFFERENCE 5: no sun */}
    </g>
  );
}

// SCENE 3: Beach
function BeachBase() {
  return (
    <g>
      {/* Sky */}
      <rect width="400" height="180" fill="#87CEEB" />
      {/* Sun */}
      <circle cx="60" cy="55" r="35" fill="#FFD700" />
      {/* Clouds */}
      <ellipse cx="200" cy="40" rx="50" ry="20" fill="white" />
      <ellipse cx="230" cy="33" rx="35" ry="18" fill="white" />
      <ellipse cx="310" cy="50" rx="40" ry="16" fill="white" />
      {/* Ocean */}
      <rect y="140" width="400" height="80" fill="#1E90FF" />
      {/* Waves */}
      <path d="M0 160 Q50 150 100 160 Q150 170 200 160 Q250 150 300 160 Q350 170 400 160" stroke="white" strokeWidth="3" fill="none" />
      <path d="M0 175 Q50 165 100 175 Q150 185 200 175 Q250 165 300 175 Q350 185 400 175" stroke="white" strokeWidth="2" fill="none" />
      {/* Sand */}
      <rect y="220" width="400" height="80" fill="#F4D03F" />
      {/* Sand texture */}
      <ellipse cx="100" cy="240" rx="30" ry="8" fill="#E8C82A" />
      <ellipse cx="280" cy="260" rx="25" ry="7" fill="#E8C82A" />
      {/* Palm trees */}
      <rect x="30" y="160" width="12" height="80" fill="#8B4513" />
      <ellipse cx="36" cy="153" rx="30" ry="15" fill="#228B22" transform="rotate(-20 36 153)" />
      <ellipse cx="36" cy="153" rx="30" ry="12" fill="#2E8B57" transform="rotate(10 36 153)" />
      <ellipse cx="36" cy="153" rx="28" ry="12" fill="#006400" transform="rotate(40 36 153)" />
      {/* Coconuts */}
      <circle cx="25" cy="165" r="5" fill="#8B4513" />
      <circle cx="40" cy="160" r="5" fill="#8B4513" />

      <rect x="340" y="170" width="12" height="70" fill="#8B4513" />
      <ellipse cx="346" cy="163" rx="28" ry="13" fill="#228B22" transform="rotate(-15 346 163)" />
      <ellipse cx="346" cy="163" rx="27" ry="11" fill="#2E8B57" transform="rotate(15 346 163)" />

      {/* Umbrella */}
      <rect x="198" y="200" width="4" height="60" fill="#888" />
      <path d="M160 210 Q200 185 240 210 Z" fill="#FF4500" />
      <path d="M160 210 Q200 195 240 210 Z" fill="#FFD700" />

      {/* Beach towel */}
      <rect x="140" y="238" width="80" height="30" rx="3" fill="#FF69B4" />
      <rect x="148" y="242" width="64" height="4" fill="#FF1493" />
      <rect x="148" y="252" width="64" height="4" fill="#FF1493" />

      {/* Bucket */}
      <rect x="265" y="245" width="20" height="22" rx="3" fill="#FF4500" />
      <path d="M265 245 Q275 238 285 245" stroke="#FF4500" strokeWidth="2" fill="none" />

      {/* Seagulls */}
      <path d="M100 90 Q108 83 116 90" stroke="#333" strokeWidth="2" fill="none" />
      <path d="M130 75 Q138 68 146 75" stroke="#333" strokeWidth="2" fill="none" />

      {/* Boat */}
      <path d="M300 165 L360 165 L350 155 L310 155 Z" fill="#8B4513" />
      <rect x="328" y="130" width="3" height="25" fill="#888" />
      <polygon points="331,130 355,145 331,145" fill="white" />
    </g>
  );
}

function BeachAlt() {
  return (
    <g>
      {/* Sky */}
      <rect width="400" height="180" fill="#87CEEB" />
      {/* Sun */}
      <circle cx="60" cy="55" r="35" fill="#FFD700" />
      {/* Clouds */}
      <ellipse cx="200" cy="40" rx="50" ry="20" fill="white" />
      <ellipse cx="230" cy="33" rx="35" ry="18" fill="white" />
      <ellipse cx="310" cy="50" rx="40" ry="16" fill="white" />
      {/* DIFFERENCE 1: Ocean different shade */}
      <rect y="140" width="400" height="80" fill="#006994" />
      <path d="M0 160 Q50 150 100 160 Q150 170 200 160 Q250 150 300 160 Q350 170 400 160" stroke="white" strokeWidth="3" fill="none" />
      <path d="M0 175 Q50 165 100 175 Q150 185 200 175 Q250 165 300 175 Q350 185 400 175" stroke="white" strokeWidth="2" fill="none" />
      {/* Sand */}
      <rect y="220" width="400" height="80" fill="#F4D03F" />
      <ellipse cx="100" cy="240" rx="30" ry="8" fill="#E8C82A" />
      <ellipse cx="280" cy="260" rx="25" ry="7" fill="#E8C82A" />
      {/* Palm trees */}
      <rect x="30" y="160" width="12" height="80" fill="#8B4513" />
      <ellipse cx="36" cy="153" rx="30" ry="15" fill="#228B22" transform="rotate(-20 36 153)" />
      <ellipse cx="36" cy="153" rx="30" ry="12" fill="#2E8B57" transform="rotate(10 36 153)" />
      <ellipse cx="36" cy="153" rx="28" ry="12" fill="#006400" transform="rotate(40 36 153)" />
      {/* DIFFERENCE 2: No coconuts */}
      <rect x="340" y="170" width="12" height="70" fill="#8B4513" />
      <ellipse cx="346" cy="163" rx="28" ry="13" fill="#228B22" transform="rotate(-15 346 163)" />
      <ellipse cx="346" cy="163" rx="27" ry="11" fill="#2E8B57" transform="rotate(15 346 163)" />

      {/* Umbrella */}
      <rect x="198" y="200" width="4" height="60" fill="#888" />
      {/* DIFFERENCE 3: Umbrella color changed */}
      <path d="M160 210 Q200 185 240 210 Z" fill="#9B59B6" />
      <path d="M160 210 Q200 195 240 210 Z" fill="#2980B9" />

      {/* Beach towel - DIFFERENCE 4: different color */}
      <rect x="140" y="238" width="80" height="30" rx="3" fill="#00CED1" />
      <rect x="148" y="242" width="64" height="4" fill="#008B8B" />
      <rect x="148" y="252" width="64" height="4" fill="#008B8B" />

      {/* Bucket */}
      <rect x="265" y="245" width="20" height="22" rx="3" fill="#FF4500" />
      <path d="M265 245 Q275 238 285 245" stroke="#FF4500" strokeWidth="2" fill="none" />

      {/* Seagulls */}
      <path d="M100 90 Q108 83 116 90" stroke="#333" strokeWidth="2" fill="none" />
      <path d="M130 75 Q138 68 146 75" stroke="#333" strokeWidth="2" fill="none" />

      {/* DIFFERENCE 5: Boat sail different color */}
      <path d="M300 165 L360 165 L350 155 L310 155 Z" fill="#8B4513" />
      <rect x="328" y="130" width="3" height="25" fill="#888" />
      <polygon points="331,130 355,145 331,145" fill="#FF0000" />
    </g>
  );
}

// SCENE 4: Space
function SpaceBase() {
  return (
    <g>
      <rect width="400" height="300" fill="#0a0a1a" />
      {/* Stars */}
      {[
        [20, 15], [50, 40], [80, 10], [120, 30], [160, 20], [200, 45], [240, 12],
        [280, 35], [320, 18], [360, 42], [390, 8], [15, 70], [45, 90], [85, 65],
        [140, 80], [180, 60], [230, 85], [270, 55], [310, 75], [350, 65], [385, 80],
        [30, 110], [75, 120], [130, 105], [190, 115], [250, 108], [300, 118], [370, 112],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={Math.random() > 0.7 ? 2 : 1} fill="white" opacity={0.5 + Math.random() * 0.5} />
      ))}
      {/* Planet 1 - large blue */}
      <circle cx="300" cy="80" r="55" fill="#4169E1" />
      <ellipse cx="300" cy="80" rx="70" ry="15" fill="#9370DB" opacity="0.6" />
      <ellipse cx="285" cy="65" rx="20" ry="12" fill="#6495ED" opacity="0.5" />
      {/* Planet 2 - orange */}
      <circle cx="80" cy="200" r="35" fill="#FF8C00" />
      <ellipse cx="75" cy="193" rx="12" ry="7" fill="#FF6347" opacity="0.5" />
      {/* Moon */}
      <circle cx="180" cy="50" r="25" fill="#C8C8C8" />
      <circle cx="170" cy="45" r="6" fill="#A9A9A9" />
      <circle cx="185" cy="55" r="4" fill="#A9A9A9" />
      {/* Spaceship */}
      <ellipse cx="200" cy="180" rx="40" ry="18" fill="#C0C0C0" />
      <ellipse cx="200" cy="168" rx="20" ry="14" fill="#87CEEB" />
      <rect x="160" y="193" width="20" height="8" rx="4" fill="#FF4500" />
      <rect x="220" y="193" width="20" height="8" rx="4" fill="#FF4500" />
      {/* Flame */}
      <path d="M180 200 Q200 220 220 200" stroke="#FF4500" strokeWidth="4" fill="none" />
      <path d="M185 200 Q200 215 215 200" stroke="#FFD700" strokeWidth="2" fill="none" />
      {/* Astronaut */}
      <circle cx="340" cy="220" r="20" fill="white" />
      <rect x="325" y="235" width="30" height="35" rx="5" fill="white" />
      <rect x="310" y="238" width="15" height="25" rx="5" fill="white" />
      <rect x="355" y="238" width="15" height="25" rx="5" fill="white" />
      <rect x="325" y="265" width="12" height="20" rx="5" fill="white" />
      <rect x="343" y="265" width="12" height="20" rx="5" fill="white" />
      <circle cx="340" cy="220" r="14" fill="#87CEEB" />
      <circle cx="340" cy="220" r="10" fill="#1a1a2e" />
      {/* Tether */}
      <path d="M340 230 Q350 210 355 195" stroke="white" strokeWidth="2" fill="none" />
      {/* Satellite */}
      <rect x="50" y="130" width="30" height="20" rx="3" fill="#C0C0C0" />
      <rect x="20" y="138" width="30" height="5" fill="#4169E1" />
      <rect x="80" y="138" width="30" height="5" fill="#4169E1" />
      {/* Nebula */}
      <ellipse cx="350" cy="250" rx="40" ry="25" fill="#9B59B6" opacity="0.3" />
    </g>
  );
}

function SpaceAlt() {
  return (
    <g>
      <rect width="400" height="300" fill="#0a0a1a" />
      {/* Stars */}
      {[
        [20, 15], [50, 40], [80, 10], [120, 30], [160, 20], [200, 45], [240, 12],
        [280, 35], [320, 18], [360, 42], [390, 8], [15, 70], [45, 90], [85, 65],
        [140, 80], [180, 60], [230, 85], [270, 55], [310, 75], [350, 65], [385, 80],
        [30, 110], [75, 120], [130, 105], [190, 115], [250, 108], [300, 118], [370, 112],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={Math.random() > 0.7 ? 2 : 1} fill="white" opacity={0.5 + Math.random() * 0.5} />
      ))}
      {/* DIFFERENCE 1: Planet color changed to green */}
      <circle cx="300" cy="80" r="55" fill="#228B22" />
      <ellipse cx="300" cy="80" rx="70" ry="15" fill="#9370DB" opacity="0.6" />
      <ellipse cx="285" cy="65" rx="20" ry="12" fill="#90EE90" opacity="0.5" />
      {/* Planet 2 - orange */}
      <circle cx="80" cy="200" r="35" fill="#FF8C00" />
      <ellipse cx="75" cy="193" rx="12" ry="7" fill="#FF6347" opacity="0.5" />
      {/* DIFFERENCE 2: Moon is bigger */}
      <circle cx="180" cy="50" r="35" fill="#C8C8C8" />
      <circle cx="170" cy="45" r="6" fill="#A9A9A9" />
      <circle cx="185" cy="55" r="4" fill="#A9A9A9" />
      {/* Spaceship */}
      <ellipse cx="200" cy="180" rx="40" ry="18" fill="#C0C0C0" />
      <ellipse cx="200" cy="168" rx="20" ry="14" fill="#87CEEB" />
      {/* DIFFERENCE 3: Thruster color changed */}
      <rect x="160" y="193" width="20" height="8" rx="4" fill="#9B59B6" />
      <rect x="220" y="193" width="20" height="8" rx="4" fill="#9B59B6" />
      {/* Flame */}
      <path d="M180 200 Q200 220 220 200" stroke="#FF4500" strokeWidth="4" fill="none" />
      <path d="M185 200 Q200 215 215 200" stroke="#FFD700" strokeWidth="2" fill="none" />
      {/* Astronaut */}
      <circle cx="340" cy="220" r="20" fill="white" />
      <rect x="325" y="235" width="30" height="35" rx="5" fill="white" />
      <rect x="310" y="238" width="15" height="25" rx="5" fill="white" />
      <rect x="355" y="238" width="15" height="25" rx="5" fill="white" />
      <rect x="325" y="265" width="12" height="20" rx="5" fill="white" />
      <rect x="343" y="265" width="12" height="20" rx="5" fill="white" />
      <circle cx="340" cy="220" r="14" fill="#87CEEB" />
      <circle cx="340" cy="220" r="10" fill="#1a1a2e" />
      <path d="M340 230 Q350 210 355 195" stroke="white" strokeWidth="2" fill="none" />
      {/* DIFFERENCE 4: Satellite has different panel color */}
      <rect x="50" y="130" width="30" height="20" rx="3" fill="#C0C0C0" />
      <rect x="20" y="138" width="30" height="5" fill="#FF4500" />
      <rect x="80" y="138" width="30" height="5" fill="#FF4500" />
      {/* DIFFERENCE 5: No nebula */}
    </g>
  );
}

// SCENE 5: Kitchen
function KitchenBase() {
  return (
    <g>
      {/* Floor and walls */}
      <rect width="400" height="300" fill="#FFF8E7" />
      <rect y="240" width="400" height="60" fill="#D2B48C" />
      {/* Tile pattern on wall */}
      {Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 5 }, (_, j) => (
          <rect key={`${i}-${j}`} x={i * 50} y={j * 50} width="48" height="48" fill="none" stroke="#E8DCC8" strokeWidth="1" />
        ))
      )}
      {/* Counter */}
      <rect x="0" y="190" width="250" height="55" fill="#8B4513" />
      <rect x="0" y="185" width="260" height="12" fill="#A0522D" />
      {/* Sink */}
      <rect x="30" y="192" width="80" height="40" rx="4" fill="#C0C0C0" />
      <rect x="60" y="188" width="20" height="10" rx="3" fill="#888" />
      <circle cx="70" cy="212" r="8" fill="#888" />
      {/* Faucet */}
      <rect x="68" y="175" width="4" height="18" fill="#999" />
      <path d="M72 178 Q85 175 85 185" stroke="#999" strokeWidth="4" fill="none" />
      {/* Stove */}
      <rect x="270" y="185" width="130" height="60" rx="4" fill="#555" />
      <circle cx="300" cy="205" r="18" fill="#333" />
      <circle cx="300" cy="205" r="12" fill="#222" />
      <circle cx="350" cy="205" r="18" fill="#333" />
      <circle cx="350" cy="205" r="12" fill="#222" />
      <circle cx="300" cy="235" r="15" fill="#333" />
      <circle cx="300" cy="235" r="10" fill="#222" />
      <circle cx="350" cy="235" r="15" fill="#333" />
      <circle cx="350" cy="235" r="10" fill="#222" />
      {/* Pot on stove */}
      <ellipse cx="350" cy="183" rx="22" ry="8" fill="#888" />
      <rect x="328" y="170" width="44" height="18" rx="4" fill="#888" />
      <rect x="318" y="176" width="15" height="6" rx="3" fill="#555" />
      <rect x="367" y="176" width="15" height="6" rx="3" fill="#555" />
      {/* Steam */}
      <path d="M340 165 Q338 155 342 145" stroke="#ccc" strokeWidth="3" fill="none" opacity="0.7" />
      <path d="M350 163 Q348 153 352 143" stroke="#ccc" strokeWidth="3" fill="none" opacity="0.7" />
      {/* Refrigerator */}
      <rect x="20" y="20" width="70" height="160" rx="6" fill="#E0E0E0" />
      <rect x="20" y="20" width="70" height="5" fill="#ccc" />
      <rect x="20" y="100" width="70" height="5" fill="#ccc" />
      <rect x="80" y="45" width="5" height="40" rx="2" fill="#888" />
      <rect x="80" y="115" width="5" height="40" rx="2" fill="#888" />
      {/* Items on counter */}
      <rect x="150" y="175" width="25" height="30" rx="3" fill="#FF6347" />
      <circle cx="162" cy="172" r="5" fill="#228B22" />
      {/* Bowl */}
      <ellipse cx="210" cy="202" rx="22" ry="10" fill="#F5DEB3" />
      <path d="M188 202 Q210 220 232 202" fill="#F5DEB3" stroke="#DEB887" strokeWidth="1" />
      {/* Banana in bowl */}
      <path d="M195 200 Q210 192 225 200" stroke="#FFD700" strokeWidth="5" fill="none" />
      {/* Window */}
      <rect x="280" y="20" width="100" height="80" rx="4" fill="#87CEEB" />
      <rect x="278" y="18" width="104" height="84" rx="5" fill="none" stroke="#8B4513" strokeWidth="4" />
      <rect x="327" y="18" width="4" height="84" fill="#8B4513" />
      <rect x="278" y="57" width="104" height="4" fill="#8B4513" />
      {/* Curtains */}
      <path d="M278 18 Q295 60 278 102" fill="#FF69B4" opacity="0.7" />
      <path d="M382 18 Q365 60 382 102" fill="#FF69B4" opacity="0.7" />
      {/* Clock */}
      <circle cx="130" cy="55" r="28" fill="white" stroke="#333" strokeWidth="3" />
      <line x1="130" y1="55" x2="130" y2="35" stroke="#333" strokeWidth="2" />
      <line x1="130" y1="55" x2="148" y2="63" stroke="#333" strokeWidth="2" />
      <circle cx="130" cy="55" r="3" fill="#333" />
    </g>
  );
}

function KitchenAlt() {
  return (
    <g>
      {/* Floor and walls */}
      <rect width="400" height="300" fill="#FFF8E7" />
      <rect y="240" width="400" height="60" fill="#D2B48C" />
      {/* Tile pattern */}
      {Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 5 }, (_, j) => (
          <rect key={`${i}-${j}`} x={i * 50} y={j * 50} width="48" height="48" fill="none" stroke="#E8DCC8" strokeWidth="1" />
        ))
      )}
      {/* Counter */}
      <rect x="0" y="190" width="250" height="55" fill="#8B4513" />
      <rect x="0" y="185" width="260" height="12" fill="#A0522D" />
      {/* Sink */}
      <rect x="30" y="192" width="80" height="40" rx="4" fill="#C0C0C0" />
      <rect x="60" y="188" width="20" height="10" rx="3" fill="#888" />
      <circle cx="70" cy="212" r="8" fill="#888" />
      <rect x="68" y="175" width="4" height="18" fill="#999" />
      <path d="M72 178 Q85 175 85 185" stroke="#999" strokeWidth="4" fill="none" />
      {/* DIFFERENCE 1: Stove color changed */}
      <rect x="270" y="185" width="130" height="60" rx="4" fill="#8B0000" />
      <circle cx="300" cy="205" r="18" fill="#333" />
      <circle cx="300" cy="205" r="12" fill="#222" />
      <circle cx="350" cy="205" r="18" fill="#333" />
      <circle cx="350" cy="205" r="12" fill="#222" />
      <circle cx="300" cy="235" r="15" fill="#333" />
      <circle cx="300" cy="235" r="10" fill="#222" />
      <circle cx="350" cy="235" r="15" fill="#333" />
      <circle cx="350" cy="235" r="10" fill="#222" />
      {/* Pot on stove */}
      <ellipse cx="350" cy="183" rx="22" ry="8" fill="#888" />
      <rect x="328" y="170" width="44" height="18" rx="4" fill="#888" />
      <rect x="318" y="176" width="15" height="6" rx="3" fill="#555" />
      <rect x="367" y="176" width="15" height="6" rx="3" fill="#555" />
      {/* No steam - DIFFERENCE 2 */}
      {/* Refrigerator - DIFFERENCE 3: different handle position */}
      <rect x="20" y="20" width="70" height="160" rx="6" fill="#E0E0E0" />
      <rect x="20" y="20" width="70" height="5" fill="#ccc" />
      <rect x="20" y="100" width="70" height="5" fill="#ccc" />
      <rect x="25" y="45" width="5" height="40" rx="2" fill="#888" />
      <rect x="25" y="115" width="5" height="40" rx="2" fill="#888" />
      {/* Items on counter */}
      <rect x="150" y="175" width="25" height="30" rx="3" fill="#FF6347" />
      <circle cx="162" cy="172" r="5" fill="#228B22" />
      {/* Bowl */}
      <ellipse cx="210" cy="202" rx="22" ry="10" fill="#F5DEB3" />
      <path d="M188 202 Q210 220 232 202" fill="#F5DEB3" stroke="#DEB887" strokeWidth="1" />
      {/* DIFFERENCE 4: Apple instead of banana */}
      <circle cx="210" cy="196" r="10" fill="#CC0000" />
      <rect x="209" y="187" width="3" height="7" rx="1" fill="#228B22" />
      {/* Window */}
      <rect x="280" y="20" width="100" height="80" rx="4" fill="#87CEEB" />
      <rect x="278" y="18" width="104" height="84" rx="5" fill="none" stroke="#8B4513" strokeWidth="4" />
      <rect x="327" y="18" width="4" height="84" fill="#8B4513" />
      <rect x="278" y="57" width="104" height="4" fill="#8B4513" />
      {/* DIFFERENCE 5: Curtains color different */}
      <path d="M278 18 Q295 60 278 102" fill="#4169E1" opacity="0.7" />
      <path d="M382 18 Q365 60 382 102" fill="#4169E1" opacity="0.7" />
      {/* Clock */}
      <circle cx="130" cy="55" r="28" fill="white" stroke="#333" strokeWidth="3" />
      <line x1="130" y1="55" x2="130" y2="35" stroke="#333" strokeWidth="2" />
      <line x1="130" y1="55" x2="148" y2="63" stroke="#333" strokeWidth="2" />
      <circle cx="130" cy="55" r="3" fill="#333" />
    </g>
  );
}

// ─── Scene Data ────────────────────────────────────────────────────────────────
const SCENES: Scene[] = [
  {
    id: 1,
    name: "City",
    background: "#87CEEB",
    differences: [
      { id: 1, label: "Sun color changed", cx: 340, cy: 50, r: 35 },
      { id: 2, label: "Building color changed", cx: 50, cy: 160, r: 45 },
      { id: 3, label: "Missing window row", cx: 140, cy: 140, r: 28 },
      { id: 4, label: "Antenna removed", cx: 315, cy: 45, r: 25 },
      { id: 5, label: "Car color changed", cx: 190, cy: 245, r: 35 },
    ],
    renderBase: () => <CityBase />,
    renderAlt: () => <CityAlt />,
  },
  {
    id: 2,
    name: "Jungle",
    background: "#1a4a1a",
    differences: [
      { id: 1, label: "Flower color changed", cx: 130, cy: 245, r: 18 },
      { id: 2, label: "Parrot color changed", cx: 80, cy: 130, r: 22 },
      { id: 3, label: "Monkey face color changed", cx: 290, cy: 112, r: 20 },
      { id: 4, label: "River color changed", cx: 200, cy: 278, r: 30 },
      { id: 5, label: "Sun removed", cx: 200, cy: 30, r: 30 },
    ],
    renderBase: () => <JungleBase />,
    renderAlt: () => <JungleAlt />,
  },
  {
    id: 3,
    name: "Beach",
    background: "#87CEEB",
    differences: [
      { id: 1, label: "Ocean color changed", cx: 200, cy: 180, r: 40 },
      { id: 2, label: "Coconuts removed", cx: 30, cy: 165, r: 22 },
      { id: 3, label: "Umbrella color changed", cx: 200, cy: 200, r: 45 },
      { id: 4, label: "Towel color changed", cx: 180, cy: 252, r: 45 },
      { id: 5, label: "Sail color changed", cx: 340, cy: 143, r: 25 },
    ],
    renderBase: () => <BeachBase />,
    renderAlt: () => <BeachAlt />,
  },
  {
    id: 4,
    name: "Space",
    background: "#0a0a1a",
    differences: [
      { id: 1, label: "Planet color changed", cx: 300, cy: 80, r: 58 },
      { id: 2, label: "Moon size changed", cx: 180, cy: 50, r: 38 },
      { id: 3, label: "Thruster color changed", cx: 200, cy: 193, r: 40 },
      { id: 4, label: "Solar panel color changed", cx: 55, cy: 138, r: 25 },
      { id: 5, label: "Nebula removed", cx: 350, cy: 250, r: 42 },
    ],
    renderBase: () => <SpaceBase />,
    renderAlt: () => <SpaceAlt />,
  },
  {
    id: 5,
    name: "Kitchen",
    background: "#FFF8E7",
    differences: [
      { id: 1, label: "Stove color changed", cx: 335, cy: 215, r: 65 },
      { id: 2, label: "Steam removed", cx: 348, cy: 153, r: 22 },
      { id: 3, label: "Fridge handle moved", cx: 55, cy: 90, r: 28 },
      { id: 4, label: "Banana replaced with apple", cx: 210, cy: 200, r: 22 },
      { id: 5, label: "Curtain color changed", cx: 330, cy: 60, r: 52 },
    ],
    renderBase: () => <KitchenBase />,
    renderAlt: () => <KitchenAlt />,
  },
];

// ─── Main Game Component ───────────────────────────────────────────────────────
function DifferencesFinderUI() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [clickFeedback, setClickFeedback] = useState<{ x: number; y: number; ok: boolean } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const scene = SCENES[currentSceneIdx];

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem(HS_KEY);
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Timer
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTimeSeconds(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  // Start on mount
  useEffect(() => {
    setRunning(true);
  }, []);

  const handleSvgClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>, isAlt: boolean) => {
      if (levelComplete) return;
      if (!running) setRunning(true);

      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = 400 / rect.width;
      const scaleY = 300 / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      let foundDiff: Difference | null = null;
      for (const diff of scene.differences) {
        if (found.has(diff.id)) continue;
        const dist = Math.sqrt((x - diff.cx) ** 2 + (y - diff.cy) ** 2);
        if (dist <= diff.r) {
          foundDiff = diff;
          break;
        }
      }

      if (foundDiff) {
        const newFound = new Set(found);
        newFound.add(foundDiff.id);
        setFound(newFound);
        setClickFeedback({ x: e.clientX - rect.left, y: e.clientY - rect.top, ok: true });
        setTimeout(() => setClickFeedback(null), 800);

        if (newFound.size === scene.differences.length) {
          setRunning(false);
          setLevelComplete(true);
          const timeBonus = Math.max(0, 500 - timeSeconds * 3);
          const hintPenalty = hintsUsed * 50;
          const wrongPenalty = wrongClicks * 10;
          const levelScore = Math.max(0, 1000 + timeBonus - hintPenalty - wrongPenalty);
          const newTotal = totalScore + levelScore;
          setTotalScore(newTotal);
          const current = parseInt(localStorage.getItem(HS_KEY) || "0", 10);
          if (newTotal > current) {
            localStorage.setItem(HS_KEY, String(newTotal));
            setHighScore(newTotal);
          }
        }
      } else {
        setWrongClicks(w => w + 1);
        setClickFeedback({ x: e.clientX - rect.left, y: e.clientY - rect.top, ok: false });
        setTimeout(() => setClickFeedback(null), 500);
      }
    },
    [found, scene, levelComplete, running, timeSeconds, hintsUsed, wrongClicks, totalScore]
  );

  const handleHint = useCallback(() => {
    const unfound = scene.differences.filter(d => !found.has(d.id));
    if (unfound.length === 0) return;
    const hint = unfound[Math.floor(Math.random() * unfound.length)];
    setFound(prev => new Set([...prev, hint.id]));
    setHintsUsed(h => h + 1);
  }, [found, scene]);

  const nextLevel = useCallback(() => {
    if (currentSceneIdx < SCENES.length - 1) {
      setCurrentSceneIdx(i => i + 1);
      setFound(new Set());
      setTimeSeconds(0);
      setRunning(true);
      setLevelComplete(false);
      setHintsUsed(0);
      setWrongClicks(0);
    }
  }, [currentSceneIdx]);

  const resetGame = useCallback(() => {
    setCurrentSceneIdx(0);
    setFound(new Set());
    setTimeSeconds(0);
    setRunning(true);
    setLevelComplete(false);
    setHintsUsed(0);
    setTotalScore(0);
    setWrongClicks(0);
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="w-full select-none">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-4 flex-wrap">
          <div>
            <div className="text-xs font-bold uppercase text-slate-500">Level</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{currentSceneIdx + 1}/{SCENES.length} · {scene.name}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-500">Found</div>
            <div className="text-xl font-bold text-green-500">{found.size}/{scene.differences.length}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-500">Time</div>
            <div className="text-xl font-mono font-bold text-indigo-500">{formatTime(timeSeconds)}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-500">Score</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{totalScore}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-500">Best</div>
            <div className="text-xl font-bold text-yellow-500">{highScore}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleHint}
            disabled={levelComplete || found.size === scene.differences.length}
            className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            Hint ({hintsUsed})
          </button>
          <button
            onClick={resetGame}
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Level complete banner */}
      {levelComplete && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center">
          <div className="text-xl font-bold text-green-500 mb-1">Level Complete!</div>
          <div className="text-slate-600 dark:text-slate-300 text-sm mb-3">
            Time: {formatTime(timeSeconds)} · Hints used: {hintsUsed} · Wrong clicks: {wrongClicks}
          </div>
          {currentSceneIdx < SCENES.length - 1 ? (
            <button onClick={nextLevel} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
              Next Level: {SCENES[currentSceneIdx + 1].name}
            </button>
          ) : (
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mb-2">You completed all levels! Total: {totalScore}</div>
              <button onClick={resetGame} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">Play Again</button>
            </div>
          )}
        </div>
      )}

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-4">
        {scene.differences.map(d => (
          <div
            key={d.id}
            className={`w-4 h-4 rounded-full border-2 transition-all ${found.has(d.id) ? "bg-green-500 border-green-500 scale-110" : "bg-transparent border-slate-400"}`}
            title={found.has(d.id) ? d.label : "?"}
          />
        ))}
      </div>

      {/* Two images side by side */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-start">
        {[
          { label: "Original", isAlt: false, render: scene.renderBase },
          { label: "Find differences →", isAlt: true, render: scene.renderAlt },
        ].map(({ label, isAlt, render }) => (
          <div key={label} className="flex-1 min-w-0">
            <div className="text-xs font-bold text-center text-slate-500 uppercase mb-1">{label}</div>
            <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-lg cursor-crosshair">
              <svg
                ref={isAlt ? svgRef : undefined}
                viewBox="0 0 400 300"
                width="100%"
                onClick={e => isAlt && handleSvgClick(e, isAlt)}
                style={{ display: "block" }}
              >
                {render()}
                {/* Highlight found differences on both images */}
                {scene.differences.map(d =>
                  found.has(d.id) ? (
                    <g key={d.id}>
                      <circle
                        cx={d.cx} cy={d.cy} r={d.r + 4}
                        fill="none"
                        stroke="#00FF00"
                        strokeWidth="3"
                        strokeDasharray="6 3"
                        opacity="0.85"
                      />
                      <circle cx={d.cx} cy={d.cy} r={d.r + 4} fill="rgba(0,255,0,0.08)" />
                    </g>
                  ) : null
                )}
              </svg>
              {/* Click feedback on alt image */}
              {isAlt && clickFeedback && (
                <div
                  style={{
                    position: "absolute",
                    left: clickFeedback.x,
                    top: clickFeedback.y,
                    transform: "translate(-50%,-50%)",
                    pointerEvents: "none",
                    fontSize: 28,
                    fontWeight: "bold",
                    color: clickFeedback.ok ? "#00FF00" : "#FF4444",
                    textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                    transition: "opacity 0.5s",
                  }}
                >
                  {clickFeedback.ok ? "✓" : "✗"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Found labels */}
      {found.size > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {scene.differences.filter(d => found.has(d.id)).map(d => (
            <span key={d.id} className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-700 dark:text-green-400 text-xs font-semibold">
              {d.label}
            </span>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-slate-500 mt-3">
        Click on the RIGHT image where you spot a difference. Click on the correct spot to highlight it.
      </p>
    </div>
  );
}

// ─── Editorial ─────────────────────────────────────────────────────────────────
function HowToPlayDifferences() {
  return (
    <div className="space-y-10">
      <section id="how-to-play">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How to Play Differences Finder</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Two nearly-identical images are displayed side by side. Your mission is to find all 5 hidden differences between them. Each level features a unique hand-crafted scene.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Study both images carefully — differences can be subtle</li>
          <li>Click on the <strong>right image</strong> where you see a difference</li>
          <li>A green circle confirms a correct find; red X means try again</li>
          <li>Find all 5 differences to complete the level and advance</li>
          <li>Use the Hint button if you are stuck (costs 50 points each)</li>
        </ul>
      </section>

      <section id="levels">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The 5 Levels</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {["City", "Jungle", "Beach", "Space", "Kitchen"].map((name, i) => (
            <div key={name} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Level {i + 1}</div>
              <div className="text-slate-700 dark:text-slate-300">{name}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="scoring">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Scoring</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Base per level", value: "1,000 pts" },
            { label: "Speed bonus (under 3 min)", value: "Up to +500 pts" },
            { label: "Each hint used", value: "-50 pts" },
            { label: "Each wrong click", value: "-10 pts" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Tips for Finding Differences</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Scan systematically", tip: "Start from the top-left and scan across each row, rather than jumping around randomly." },
            { title: "Look for color changes", tip: "Many differences involve a color change. Look for objects that look the same shape but different hue." },
            { title: "Look for missing elements", tip: "Sometimes an entire object is removed. Pay attention to what is present in one image but absent in the other." },
            { title: "Focus on boundaries", tip: "Differences near edges of objects (size, position changes) can be hard to spot. Pay close attention to outlines." },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{item.tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function DifferencesFinderGame() {
  return (
    <CalculatorVerticalLayout
      title="Differences Finder"
      description="Spot all 5 differences between two nearly-identical images across 5 unique scenes — city, jungle, beach, space, and kitchen. Test your observation skills!"
      canonical="https://www.smartkitnow.com/games/differences-finder"
      widget={<DifferencesFinderUI />}
      editorial={<HowToPlayDifferences />}
      onThisPage={[
        { id: "how-to-play", label: "How to Play" },
        { id: "levels", label: "The 5 Levels" },
        { id: "scoring", label: "Scoring" },
        { id: "tips", label: "Tips" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      contentMaxWidth="max-w-5xl"
    />
  );
}
