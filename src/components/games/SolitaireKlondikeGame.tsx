import React, { useState, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

type Suit = "♠"|"♥"|"♦"|"♣";
type Rank = "A"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"10"|"J"|"Q"|"K";
interface Card { suit: Suit; rank: Rank; faceUp: boolean; id: string }

const SUITS: Suit[] = ["♠","♥","♦","♣"];
const RANKS: Rank[] = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const RED_SUITS = new Set(["♥","♦"]);

function isRed(s: Suit) { return RED_SUITS.has(s); }
function rankVal(r: Rank) { return RANKS.indexOf(r); }

function makeDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS)
    for (const rank of RANKS)
      deck.push({ suit, rank, faceUp: false, id: `${rank}${suit}` });
  return deck.sort(() => Math.random() - 0.5);
}

interface State {
  tableau: Card[][];
  foundation: Card[][];
  stock: Card[];
  waste: Card[];
  moves: number;
}

function deal(): State {
  const deck = makeDeck();
  const tableau: Card[][] = Array.from({ length: 7 }, () => []);
  for (let col = 0; col < 7; col++)
    for (let row = 0; row <= col; row++) {
      const card = { ...deck.shift()!, faceUp: row === col };
      tableau[col].push(card);
    }
  return { tableau, foundation: [[],[],[],[]], stock: deck.map(c => ({...c, faceUp:false})), waste: [], moves: 0 };
}

function CardView({ card, style, onClick, selected, ghost }: {
  card: Card; style?: React.CSSProperties; onClick?: () => void; selected?: boolean; ghost?: boolean;
}) {
  const color = isRed(card.suit) ? "#dc2626" : "#1e293b";
  return (
    <div onClick={onClick} style={{
      width:56, height:80, borderRadius:6, border:`2px solid ${selected?"#fbbf24":"#94a3b8"}`,
      background: card.faceUp ? "white" : "#3b82f6",
      cursor: onClick ? "pointer" : "default",
      position:"absolute", userSelect:"none",
      boxShadow: selected ? "0 0 0 2px #fbbf24, 0 4px 8px rgba(0,0,0,.5)" : "0 2px 4px rgba(0,0,0,.4)",
      opacity: ghost ? 0.5 : 1,
      ...style,
    }}>
      {card.faceUp ? (
        <div style={{ color, padding:"2px 4px", fontSize:13, fontWeight:"bold", lineHeight:1.2 }}>
          <div>{card.rank}</div>
          <div>{card.suit}</div>
          <div style={{position:"absolute",bottom:2,right:4,transform:"rotate(180deg)",fontSize:11}}>
            {card.rank}{card.suit}
          </div>
        </div>
      ) : (
        <div style={{width:"100%",height:"100%",background:"repeating-linear-gradient(45deg,#1d4ed8,#1d4ed8 4px,#2563eb 4px,#2563eb 8px)",borderRadius:4}}/>
      )}
    </div>
  );
}

function canStackTableau(card: Card, onto: Card | null): boolean {
  if (!onto) return card.rank === "K";
  if (!card.faceUp || !onto.faceUp) return false;
  return isRed(card.suit) !== isRed(onto.suit) && rankVal(card.rank) === rankVal(onto.rank) - 1;
}

function canStackFoundation(card: Card, pile: Card[]): boolean {
  if (pile.length === 0) return card.rank === "A";
  const top = pile[pile.length - 1];
  return card.suit === top.suit && rankVal(card.rank) === rankVal(top.rank) + 1;
}

function KlondikeGame() {
  const [state, setState] = useState<State>(deal);
  const [selected, setSelected] = useState<{from:"tableau"|"waste"; col?:number; cardIdx?:number}|null>(null);
  const [won, setWon] = useState(false);
  const history = useRef<State[]>([]);

  const checkWin = (s: State) => s.foundation.every(f => f.length === 13);

  const doAction = useCallback((newState: State) => {
    history.current.push(state);
    if (history.current.length > 10) history.current.shift();
    newState.moves++;
    setState(newState);
    if (checkWin(newState)) setWon(true);
  }, [state]);

  const undo = useCallback(() => {
    if (history.current.length === 0) return;
    setState(history.current.pop()!);
  }, []);

  const handleStockClick = useCallback(() => {
    const s = { ...state, tableau: state.tableau.map(c=>[...c]), foundation: state.foundation.map(c=>[...c]), stock:[...state.stock], waste:[...state.waste] };
    if (s.stock.length === 0) {
      s.stock = s.waste.reverse().map(c => ({...c, faceUp:false}));
      s.waste = [];
    } else {
      const card = { ...s.stock.pop()!, faceUp: true };
      s.waste.push(card);
    }
    doAction(s);
  }, [state, doAction]);

  const handleSelect = useCallback((from: "tableau"|"waste", col?: number, cardIdx?: number) => {
    if (selected) {
      // Try to move selected to clicked
      const s = { ...state, tableau: state.tableau.map(c=>[...c]), foundation: state.foundation.map(c=>[...c]), stock:[...state.stock], waste:[...state.waste] };

      let movingCards: Card[] = [];
      if (selected.from === "waste") {
        movingCards = [s.waste[s.waste.length-1]];
      } else if (selected.from === "tableau" && selected.col !== undefined && selected.cardIdx !== undefined) {
        movingCards = s.tableau[selected.col!].slice(selected.cardIdx!);
      }

      if (movingCards.length === 0) { setSelected(null); return; }

      if (from === "tableau" && col !== undefined) {
        const topCard = s.tableau[col].length > 0 ? s.tableau[col][s.tableau[col].length - 1] : null;
        if (canStackTableau(movingCards[0], topCard)) {
          if (selected.from === "waste") s.waste.pop();
          else { s.tableau[selected.col!] = s.tableau[selected.col!].slice(0, selected.cardIdx!); }
          // Flip new top
          if (selected.from === "tableau" && s.tableau[selected.col!].length > 0) {
            const newTop = s.tableau[selected.col!][s.tableau[selected.col!].length-1];
            s.tableau[selected.col!][s.tableau[selected.col!].length-1] = {...newTop, faceUp:true};
          }
          s.tableau[col] = [...s.tableau[col], ...movingCards];
          setSelected(null);
          doAction(s);
          return;
        }
      }
      setSelected(null);
      // Re-select new card
      if (from === "tableau" && col !== undefined && cardIdx !== undefined && s.tableau[col][cardIdx]?.faceUp) {
        setSelected({ from:"tableau", col, cardIdx });
      } else if (from === "waste" && s.waste.length > 0) {
        setSelected({ from:"waste" });
      }
      return;
    }
    // Select
    if (from === "waste" && state.waste.length > 0) setSelected({ from:"waste" });
    else if (from === "tableau" && col !== undefined && cardIdx !== undefined && state.tableau[col][cardIdx]?.faceUp)
      setSelected({ from:"tableau", col, cardIdx });
  }, [selected, state, doAction]);

  const handleFoundationClick = useCallback((fIdx: number) => {
    if (!selected) return;
    const s = { ...state, tableau: state.tableau.map(c=>[...c]), foundation: state.foundation.map(c=>[...c]), stock:[...state.stock], waste:[...state.waste] };
    let card: Card | null = null;
    if (selected.from === "waste") card = s.waste[s.waste.length-1];
    else if (selected.from === "tableau" && selected.col !== undefined) {
      const col = s.tableau[selected.col];
      if (selected.cardIdx === col.length - 1) card = col[col.length-1];
    }
    if (!card || !canStackFoundation(card, s.foundation[fIdx])) { setSelected(null); return; }
    s.foundation[fIdx] = [...s.foundation[fIdx], card];
    if (selected.from === "waste") s.waste.pop();
    else {
      s.tableau[selected.col!] = s.tableau[selected.col!].slice(0,-1);
      if (s.tableau[selected.col!].length > 0) {
        const t = s.tableau[selected.col!];
        t[t.length-1] = {...t[t.length-1], faceUp:true};
      }
    }
    setSelected(null);
    doAction(s);
  }, [selected, state, doAction]);

  const TOP_PAD = 18;

  return (
    <div className="flex flex-col items-center gap-4 p-2 overflow-x-auto">
      {/* Top row */}
      <div className="flex gap-2 items-start">
        {/* Stock */}
        <div onClick={handleStockClick} style={{width:56,height:80,borderRadius:6,border:"2px solid #475569",
          background:state.stock.length?"#3b82f6":"transparent", cursor:"pointer", position:"relative",
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          {state.stock.length ? <div style={{width:"100%",height:"100%",background:"repeating-linear-gradient(45deg,#1d4ed8,#1d4ed8 4px,#2563eb 4px,#2563eb 8px)",borderRadius:4}}/> : <span style={{color:"#64748b",fontSize:24}}>↺</span>}
        </div>
        {/* Waste */}
        <div style={{width:56,height:80,position:"relative"}} onClick={() => handleSelect("waste")}>
          {state.waste.length > 0 ? (
            <CardView card={state.waste[state.waste.length-1]} style={{top:0,left:0}} selected={selected?.from==="waste"} onClick={()=>handleSelect("waste")} />
          ) : <div style={{width:56,height:80,borderRadius:6,border:"2px dashed #475569"}}/>}
        </div>
        <div className="w-4"/>
        {/* Foundations */}
        {state.foundation.map((pile, i) => (
          <div key={i} style={{width:56,height:80,position:"relative"}} onClick={() => handleFoundationClick(i)}>
            {pile.length > 0 ? (
              <CardView card={pile[pile.length-1]} style={{top:0,left:0}} onClick={() => handleFoundationClick(i)}/>
            ) : (
              <div style={{width:56,height:80,borderRadius:6,border:"2px dashed #475569",display:"flex",alignItems:"center",justifyContent:"center",color:"#475569",fontSize:20}}>
                {SUITS[i]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="flex gap-2 items-start">
        {state.tableau.map((col, ci) => (
          <div key={ci} style={{width:60, position:"relative", height: Math.max(90, 80 + (col.length-1)*TOP_PAD + 10)}}
            onClick={() => !selected && col.length===0 && handleSelect("tableau",ci,0)}>
            {col.length === 0 ? (
              <div style={{width:56,height:80,borderRadius:6,border:"2px dashed #475569"}} onClick={()=>handleSelect("tableau",ci,undefined)}/>
            ) : col.map((card, ri) => (
              <CardView key={card.id} card={card}
                style={{top: ri*TOP_PAD, left:0}}
                selected={selected?.from==="tableau" && selected.col===ci && selected.cardIdx!==undefined && ri>=selected.cardIdx}
                onClick={() => card.faceUp ? handleSelect("tableau",ci,ri) : undefined} />
            ))}
          </div>
        ))}
      </div>

      {won && <div className="text-2xl font-bold text-green-400 animate-bounce">🏆 You Win! Moves: {state.moves}</div>}
      <div className="flex gap-4 text-sm text-slate-400">
        <span>Moves: {state.moves}</span>
        <button onClick={undo} className="text-blue-400 hover:text-blue-300 underline">Undo</button>
        <button onClick={() => { setState(deal()); setWon(false); history.current=[]; setSelected(null); }} className="text-red-400 hover:text-red-300 underline">New Game</button>
      </div>
    </div>
  );
}

export default function SolitaireKlondikeGame() {
  return (
    <CalculatorVerticalLayout
      title="Solitaire Klondike"
      description="Play the classic Klondike Solitaire card game. Sort all 52 cards into the four foundation piles by suit, from Ace to King."
      canonical="https://www.smartkitnow.com/games/solitaire-klondike"
      widget={<KlondikeGame />}
      editorial={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="text-xl font-bold">How to Play Solitaire Klondike</h2>
          <p>Move cards in alternating colors (red/black) descending order on the tableau. Build the 4 foundation piles by suit from Ace to King.</p>
          <p>Click the stock pile to draw cards. Click a card to select it, then click the destination to move.</p>
          <p>Only Kings can be placed on empty columns. Use Undo to reverse mistakes.</p>
        </div>
      }
      contentMaxWidth="max-w-3xl"
    />
  );
}
