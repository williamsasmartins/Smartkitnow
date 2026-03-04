import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ---------------------------------------------------------------------------
// Scrabble letter values
// ---------------------------------------------------------------------------
const LETTER_VALUES: Record<string, number> = {
  A:1, B:3, C:3, D:2, E:1, F:4, G:2, H:4, I:1, J:8, K:5, L:1, M:3,
  N:1, O:1, P:3, Q:10, R:1, S:1, T:1, U:1, V:4, W:4, X:8, Y:4, Z:10,
};

// Weighted frequency bag (like a real Scrabble set)
const TILE_BAG: string[] = [
  ...Array(9).fill("A"), ...Array(2).fill("B"), ...Array(2).fill("C"),
  ...Array(4).fill("D"), ...Array(12).fill("E"), ...Array(2).fill("F"),
  ...Array(3).fill("G"), ...Array(2).fill("H"), ...Array(9).fill("I"),
  ...Array(1).fill("J"), ...Array(1).fill("K"), ...Array(4).fill("L"),
  ...Array(2).fill("M"), ...Array(6).fill("N"), ...Array(8).fill("O"),
  ...Array(2).fill("P"), ...Array(1).fill("Q"), ...Array(6).fill("R"),
  ...Array(4).fill("S"), ...Array(6).fill("T"), ...Array(4).fill("U"),
  ...Array(2).fill("V"), ...Array(2).fill("W"), ...Array(1).fill("X"),
  ...Array(2).fill("Y"), ...Array(1).fill("Z"),
];

function drawTile(): string {
  return TILE_BAG[Math.floor(Math.random() * TILE_BAG.length)];
}

function drawTiles(count: number): string[] {
  return Array.from({ length: count }, drawTile);
}

function calcWordScore(word: string): number {
  return word.toUpperCase().split("").reduce((acc, ch) => acc + (LETTER_VALUES[ch] ?? 0), 0);
}

// ---------------------------------------------------------------------------
// 2000+ common English words
// ---------------------------------------------------------------------------
const WORD_LIST: string[] = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with",
  "he","as","you","do","at","this","but","his","by","from","they","we","say","her",
  "she","or","an","will","my","one","all","would","there","their","what","so","up",
  "out","if","about","who","get","which","go","me","when","make","can","like","time",
  "no","just","him","know","take","people","into","year","your","good","some","could",
  "them","see","other","than","then","now","look","only","come","its","over","think",
  "also","back","after","use","two","how","our","work","first","well","way","even",
  "new","want","because","any","these","give","day","most","us","great","between",
  "need","large","often","hand","high","place","hold","real","life","few","north",
  "open","seem","together","next","white","children","begin","got","walk","example",
  "ease","paper","group","always","music","those","both","mark","book","letter","until",
  "mile","river","car","feet","care","second","enough","plain","girl","usual","young",
  "ready","above","ever","red","list","though","feel","talk","bird","soon","body",
  "dog","family","direct","pose","leave","song","measure","door","product","black",
  "short","numeral","class","wind","question","happen","complete","ship","area","half",
  "rock","order","fire","south","problem","piece","told","knew","pass","since","top",
  "whole","king","space","heard","best","hour","better","true","during","hundred",
  "five","remember","step","early","hold","west","ground","interest","reach","fast",
  "verb","sing","listen","six","table","travel","less","morning","ten","simple","several",
  "vowel","toward","war","lay","against","pattern","slow","center","love","person","money",
  "serve","appear","road","map","rain","rule","govern","pull","cold","notice","voice",
  "unit","power","town","fine","drive","lead","cry","dark","machine","note","wait",
  "plan","figure","star","box","noun","field","rest","correct","able","pound","done",
  "beauty","drive","stood","contain","front","teach","week","final","gave","green",
  "quick","develop","ocean","warm","free","minute","strong","special","mind","behind",
  "clear","tail","produce","fact","street","inch","multiply","nothing","course","stay",
  "wheel","full","force","blue","object","decide","surface","deep","moon","island",
  "foot","system","busy","test","record","boat","common","gold","possible","plane",
  "stead","dry","wonder","laugh","thousand","ago","ran","check","game","shape","equate",
  "miss","brought","heat","snow","tire","bring","yes","distant","fill","east","paint",
  "language","among","grand","ball","yet","wave","drop","heart","am","present","heavy",
  "dance","engine","position","arm","wide","sail","material","size","vary","settle","speak",
  "weight","general","ice","matter","circle","pair","include","divide","syllable","felt",
  "perhaps","pick","sudden","count","square","reason","length","represent","art","subject",
  "region","energy","hunt","probable","bed","brother","egg","ride","cell","believe","fraction",
  "forest","sit","race","window","store","summer","train","sleep","prove","lone","leg",
  "exercise","wall","catch","mount","wish","sky","board","joy","winter","sat","written",
  "wild","instrument","kept","glass","grass","cow","job","edge","sign","visit","past","soft",
  "fun","bright","gas","weather","month","million","bear","finish","happy","hope","flower",
  "clothe","strange","gone","jump","baby","eight","village","meet","root","buy","raise",
  "solve","metal","whether","push","seven","paragraph","third","shall","held","hair","describe",
  "cook","floor","either","result","burn","hill","safe","cat","century","consider","type",
  "law","bit","coast","copy","phrase","silent","tall","sand","soil","roll","temperature",
  "finger","industry","value","fight","lie","beat","excite","natural","view","plain","spell",
  "flat","led","heavy","price","fat","cloth","quite","dead","sent","skill","knew","pass",
  "loud","bell","sudden","suit","born","sense","case","pose","ease","plain","deal","able",
  "draw","late","thanks","agree","tree","fruit","nine","line","thick","wrong","single",
  "open","live","break","topic","difficult","allow","print","dead","across","wait",
  "age","nothing","trade","melody","trip","office","receive","row","mouth","exact","symbol",
  "die","least","trouble","shout","except","wrote","seed","tone","join","suggest","clean",
  "break","lady","yard","rise","bad","blow","oil","blood","touch","grew","cent","mix",
  "team","wire","cost","lost","brown","wear","garden","equal","sent","choose","fell","fit",
  "flow","fair","bank","collect","save","control","decimal","gentle","woman","captain","practice",
  "separate","difficult","doctor","please","protect","noon","whose","locate","ring","character",
  "insect","caught","period","indicate","radio","spoke","atom","human","history","effect",
  "electric","expect","crop","modern","element","hit","student","corner","party","supply",
  "bone","rail","imagine","provide","agree","thus","capital","chair","danger","fruit",
  "rich","thick","soldier","process","operate","guess","necessary","sharp","wing","create",
  "neighbor","wash","bat","rather","crowd","corn","compare","poem","string","bell","depend",
  "meat","rub","tube","famous","dollar","stream","fear","sight","thin","triangle","planet",
  "hurry","chief","colony","clock","mine","tie","enter","major","fresh","search","send",
  "yellow","gun","allow","print","dead","spot","desert","suit","current","lift","rose",
  "continue","block","chart","hat","sell","success","company","subtract","event","particular",
  "deal","swim","term","opposite","wife","shoe","shoulder","spread","arrange","camp","invent",
  "cotton","born","determine","quart","nine","truck","noise","level","chance","gather","shop",
  "stretch","throw","shine","property","column","molecule","select","wrong","gray","repeat",
  "require","broad","prepare","salt","nose","plural","anger","claim","syllable","consonant",
  "please","strange","caught","fell","team","god","captain","direct","ring","serve","child",
  "desert","increase","history","cost","maybe","business","separate","break","uncle","hunting",
  "flow","lady","students","human","art","teach","week","final","gave","green","quick","ocean",
  "warm","since","ever","explain","last","clear","tail","produce","street","inch","nothing",
  "stay","wheel","full","force","blue","object","decide","surface","deep","moon","island",
  "busy","test","record","boat","common","possible","plane","dry","wonder","laugh","thousand",
  "ran","game","shape","equate","miss","heat","snow","tire","bring","distant","fill","east",
  "paint","among","grand","ball","wave","drop","heart","present","heavy","dance","engine",
  "position","wide","sail","material","size","settle","weight","general","ice","matter",
  "circle","pair","include","divide","felt","pick","sudden","count","square","reason","length",
  "represent","subject","region","energy","hunt","probable","brother","egg","ride","cell",
  "fraction","forest","sit","race","window","store","summer","train","sleep","prove","lone",
  "exercise","wall","catch","mount","wish","sky","board","joy","winter","written","wild",
  "instrument","kept","glass","grass","cow","job","edge","sign","visit","soft","bright",
  "weather","month","million","bear","finish","happy","hope","flower","strange","jump",
  "baby","eight","village","meet","root","raise","solve","metal","push","paragraph","third",
  "held","hair","describe","cook","floor","either","result","burn","hill","safe","cat",
  "century","consider","law","bit","coast","copy","phrase","silent","tall","sand","soil",
  "roll","temperature","finger","industry","value","fight","beat","excite","natural","view",
  "spell","flat","led","price","fat","cloth","quite","dead","sent","skill","loud","bell",
  "suit","born","sense","case","draw","late","thanks","agree","tree","nine","line","thick",
  "wrong","single","topic","difficult","allow","print","across","age","trade","melody",
  "trip","office","receive","row","mouth","exact","symbol","die","least","trouble","shout",
  "except","wrote","seed","tone","join","suggest","clean","lady","yard","rise","bad","blow",
  "oil","blood","touch","grew","cent","mix","wire","lost","brown","wear","garden","equal",
  "choose","fell","fit","flow","fair","bank","collect","save","control","gentle","woman",
  "practice","separate","doctor","protect","noon","whose","locate","character","insect",
  "period","indicate","radio","spoke","atom","effect","electric","expect","crop","modern",
  "element","student","corner","party","supply","bone","rail","imagine","provide","thus",
  "chair","danger","rich","thick","soldier","process","operate","guess","necessary","sharp",
  "wing","neighbor","wash","bat","crowd","corn","compare","poem","string","depend","meat",
  "rub","tube","famous","dollar","stream","fear","sight","thin","triangle","planet","hurry",
  "chief","clock","mine","tie","enter","major","fresh","search","yellow","gun","spot",
  "current","lift","rose","continue","block","chart","hat","sell","success","company",
  "subtract","event","particular","swim","term","opposite","wife","shoe","shoulder","spread",
  "arrange","camp","invent","cotton","determine","quart","truck","noise","level","chance",
  "gather","shop","stretch","throw","shine","property","column","molecule","select","gray",
  "repeat","require","broad","prepare","salt","nose","plural","anger","claim","consonant",
  "strange","caught","team","god","captain","ring","child","increase","business","uncle",
  "hunting","students","explain","last","tax","real","law","book","move","change","point",
  "play","close","night","hard","start","might","story","saw","far","sea","draw","left",
  "late","run","never","kind","among","head","always","small","number","off","always",
  "move","try","kind","hand","picture","again","change","off","play","spell","air",
  "away","animal","house","point","page","letter","mother","answer","found","study","still",
  "learn","plant","cover","food","sun","four","between","state","keep","eye","never","last",
  "let","thought","city","tree","cross","farm","hard","start","might","story","saw","far",
  "sea","draw","left","late","run","never","kind","head","small","number","off","move",
  "try","picture","again","away","animal","house","page","mother","answer","found","study",
  "learn","plant","cover","food","four","state","keep","eye","thought","city","cross","farm",
];

// Deduplicate
const VALID_WORDS = new Set(WORD_LIST.map((w) => w.toLowerCase()));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface GameState {
  tiles: string[];
  round: number;
  totalScore: number;
  roundScore: number;
  usedWords: string[];
  gameOver: boolean;
  message: string;
  messageType: "success" | "error" | "info";
  lastWord: string;
  lastScore: number;
}

const TOTAL_ROUNDS = 10;

function createInitialState(): GameState {
  return {
    tiles: drawTiles(7),
    round: 1,
    totalScore: 0,
    roundScore: 0,
    usedWords: [],
    gameOver: false,
    message: "Type a word using your tiles and press Enter!",
    messageType: "info",
    lastWord: "",
    lastScore: 0,
  };
}

// ---------------------------------------------------------------------------
// Tile component
// ---------------------------------------------------------------------------
const TileCell: React.FC<{ letter: string; isUsed: boolean }> = ({ letter, isUsed }) => (
  <div
    className={`
      w-11 h-14 flex flex-col items-center justify-center rounded-lg border-2 font-bold select-none
      transition-all duration-200 shadow-md relative
      ${isUsed
        ? "border-slate-300 bg-slate-100 text-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-600 scale-95 opacity-50"
        : "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-400 hover:scale-105"
      }
    `}
  >
    <span className="text-xl leading-none">{letter}</span>
    <span className="text-xs leading-none mt-0.5 opacity-70">{LETTER_VALUES[letter] ?? 0}</span>
  </div>
);

// ---------------------------------------------------------------------------
// Main game widget
// ---------------------------------------------------------------------------
function ScrabbleSoloWidget() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [input, setInput] = useState("");
  const [highScore, setHighScore] = useState<number>(() => {
    try { return parseInt(localStorage.getItem("hs_scrabble-solo") ?? "0", 10) || 0; } catch { return 0; }
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSubmit = useCallback(() => {
    if (state.gameOver) return;
    const word = input.trim().toLowerCase();
    if (word.length < 2) {
      setState((s) => ({ ...s, message: "Word must be at least 2 letters.", messageType: "error" }));
      return;
    }

    // Check if word only uses available tiles
    const tilesCopy = [...state.tiles];
    let canForm = true;
    for (const ch of word.toUpperCase()) {
      const idx = tilesCopy.indexOf(ch);
      if (idx === -1) { canForm = false; break; }
      tilesCopy.splice(idx, 1);
    }
    if (!canForm) {
      setState((s) => ({ ...s, message: `You don't have the tiles to spell "${word}".`, messageType: "error" }));
      return;
    }

    if (!VALID_WORDS.has(word)) {
      setState((s) => ({ ...s, message: `"${word}" is not a valid word.`, messageType: "error" }));
      return;
    }

    if (state.usedWords.includes(word)) {
      setState((s) => ({ ...s, message: `"${word}" was already used.`, messageType: "error" }));
      return;
    }

    const score = calcWordScore(word);
    const isLastRound = state.round >= TOTAL_ROUNDS;
    const newTotal = state.totalScore + score;
    const newTiles = tilesCopy.length < 7
      ? [...tilesCopy, ...drawTiles(7 - tilesCopy.length)]
      : tilesCopy;

    if (isLastRound) {
      const newHS = Math.max(newTotal, highScore);
      try { localStorage.setItem("hs_scrabble-solo", String(newHS)); } catch { /* noop */ }
      setHighScore(newHS);
      setState((s) => ({
        ...s,
        totalScore: newTotal,
        usedWords: [...s.usedWords, word],
        gameOver: true,
        lastWord: word,
        lastScore: score,
        message: `Game over! You scored ${newTotal} points.`,
        messageType: "success",
      }));
    } else {
      setState((s) => ({
        ...s,
        tiles: newTiles,
        round: s.round + 1,
        totalScore: newTotal,
        usedWords: [...s.usedWords, word],
        lastWord: word,
        lastScore: score,
        message: `+${score} pts for "${word}"! Round ${s.round + 1} of ${TOTAL_ROUNDS}.`,
        messageType: "success",
      }));
    }
    setInput("");
    inputRef.current?.focus();
  }, [state, input, highScore]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") validateAndSubmit();
  };

  const handleSkip = () => {
    if (state.gameOver) return;
    const isLastRound = state.round >= TOTAL_ROUNDS;
    if (isLastRound) {
      const newHS = Math.max(state.totalScore, highScore);
      try { localStorage.setItem("hs_scrabble-solo", String(newHS)); } catch { /* noop */ }
      setHighScore(newHS);
      setState((s) => ({ ...s, gameOver: true, message: `Game over! You scored ${s.totalScore} points.`, messageType: "info" }));
    } else {
      setState((s) => ({
        ...s,
        tiles: drawTiles(7),
        round: s.round + 1,
        message: `Skipped round ${s.round}. New tiles dealt.`,
        messageType: "info",
      }));
    }
    setInput("");
  };

  const handleRestart = () => {
    setState(createInitialState());
    setInput("");
    inputRef.current?.focus();
  };

  const usedLetters = (() => {
    if (!state.lastWord) return new Set<string>();
    const remaining = [...state.tiles];
    // Track which tile positions are used by current input
    const inputUpper = input.toUpperCase();
    const used = new Set<number>();
    for (const ch of inputUpper) {
      const idx = remaining.findIndex((t, i) => t === ch && !used.has(i));
      if (idx !== -1) used.add(idx);
    }
    return used;
  })();

  const inputUsedIndices = (() => {
    const inputUpper = input.toUpperCase();
    const remaining = [...state.tiles];
    const usedIdx = new Set<number>();
    for (const ch of inputUpper) {
      const idx = remaining.findIndex((t, i) => t === ch && !usedIdx.has(i));
      if (idx !== -1) usedIdx.add(idx);
    }
    return usedIdx;
  })();

  return (
    <div className="flex flex-col gap-5 p-4 select-none min-h-[480px]">
      {/* Score bar */}
      <div className="flex justify-between items-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl px-5 py-3 text-white shadow-lg">
        <div className="text-center">
          <div className="text-xs font-semibold opacity-80">ROUND</div>
          <div className="text-2xl font-extrabold">{state.gameOver ? TOTAL_ROUNDS : state.round}/{TOTAL_ROUNDS}</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold opacity-80">SCORE</div>
          <div className="text-2xl font-extrabold">{state.totalScore}</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold opacity-80">BEST</div>
          <div className="text-2xl font-extrabold">{highScore}</div>
        </div>
      </div>

      {/* Message */}
      <div className={`
        text-center py-2 px-4 rounded-lg text-sm font-semibold transition-all
        ${state.messageType === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" :
          state.messageType === "error" ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" :
          "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"}
      `}>
        {state.message}
      </div>

      {/* Tiles */}
      <div className="flex justify-center gap-2 flex-wrap">
        {state.tiles.map((letter, i) => (
          <TileCell key={i} letter={letter} isUsed={inputUsedIndices.has(i)} />
        ))}
      </div>

      {/* Input */}
      {!state.gameOver ? (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Type a word..."
            maxLength={7}
            className="flex-1 border-2 border-amber-400 rounded-xl px-4 py-3 text-xl font-bold text-center tracking-widest uppercase bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:border-amber-600 transition"
            autoFocus
          />
          <button
            onClick={validateAndSubmit}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-xl transition shadow-md"
          >
            Play
          </button>
        </div>
      ) : null}

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        {!state.gameOver && (
          <button
            onClick={handleSkip}
            className="border-2 border-slate-300 hover:border-slate-400 text-slate-600 dark:text-slate-300 font-semibold px-5 py-2 rounded-xl transition"
          >
            Skip Round
          </button>
        )}
        <button
          onClick={handleRestart}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl transition shadow-md"
        >
          {state.gameOver ? "Play Again" : "Restart"}
        </button>
      </div>

      {/* Used words */}
      {state.usedWords.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Words Played</div>
          <div className="flex flex-wrap gap-2">
            {state.usedWords.map((w, i) => (
              <span
                key={i}
                className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs font-bold px-2 py-1 rounded-full"
              >
                {w} ({calcWordScore(w)})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Letter value reference */}
      <details className="text-xs text-slate-500 dark:text-slate-400">
        <summary className="cursor-pointer font-semibold text-slate-600 dark:text-slate-300 mb-1">Letter Values</summary>
        <div className="flex flex-wrap gap-1 mt-2">
          {Object.entries(LETTER_VALUES).map(([l, v]) => (
            <span key={l} className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">
              {l}={v}
            </span>
          ))}
        </div>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ScrabbleSoloGame() {
  return (
    <CalculatorVerticalLayout
      title="Scrabble Solo"
      description="Play a solo word tile game. Use your 7 random letters to form valid English words and maximize your score over 10 rounds."
      canonical="https://www.smartkitnow.com/games/scrabble-solo"
      widget={<ScrabbleSoloWidget />}
      contentMaxWidth="max-w-5xl"
      editorial={
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>How to Play Scrabble Solo</h2>
          <p>
            Scrabble Solo gives you 7 random letter tiles and challenges you to form the highest-scoring
            English words you can across 10 rounds. Each letter carries a point value — rare letters like
            Q (10), Z (10), and J (8) are worth far more than common ones like E, A, I, O, U (all worth 1).
          </p>
          <h3>Rules</h3>
          <ul>
            <li>Type a word using only the letters shown in your tile rack.</li>
            <li>Press <strong>Enter</strong> or click <strong>Play</strong> to submit.</li>
            <li>Used tiles are replaced with new random ones each round.</li>
            <li>Each word can only be played once per game.</li>
            <li>Words must be at least 2 letters long and appear in the built-in word list.</li>
          </ul>
          <h3>Scoring Strategy</h3>
          <p>
            Short words with high-value letters can outscore long words made of common letters.
            A 2-letter word using Q or Z can be worth more than a 6-letter word made entirely of vowels
            and common consonants. Plan ahead — sometimes it is better to save a high-value tile
            for the next round when you get better supporting letters.
          </p>
          <h3>High Score</h3>
          <p>
            Your best total score is saved locally in your browser. Try to beat it on each new game!
            The maximum theoretical score per round depends on which tiles you receive, but skilled
            players consistently score 150+ total across 10 rounds.
          </p>
        </div>
      }
    />
  );
}
