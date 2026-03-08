import React, { useState, useCallback, useEffect } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

type UnoColor = "red"|"blue"|"green"|"yellow"|"wild";
type UnoValue = "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"Skip"|"Reverse"|"Draw2"|"Wild"|"WildDraw4";
interface UnoCard { color: UnoColor; value: UnoValue; id: string }

const COLORS: UnoColor[] = ["red","blue","green","yellow"];
const NUMBER_VALUES: UnoValue[] = ["0","1","2","3","4","5","6","7","8","9"];
const ACTION_VALUES: UnoValue[] = ["Skip","Reverse","Draw2"];
const CSS: Record<UnoColor, string> = { red:"#ef4444", blue:"#3b82f6", green:"#22c55e", yellow:"#eab308", wild:"#7c3aed" };

function makeDeck(): UnoCard[] {
  const deck: UnoCard[] = [];
  let id = 0;
  for (const color of COLORS) {
    deck.push({ color, value:"0", id:`${id++}` });
    for (const v of [...NUMBER_VALUES.slice(1),...ACTION_VALUES]) {
      deck.push({ color, value: v as UnoValue, id:`${id++}` });
      deck.push({ color, value: v as UnoValue, id:`${id++}` });
    }
  }
  for (let i=0;i<4;i++) deck.push({ color:"wild", value:"Wild", id:`w${i}` });
  for (let i=0;i<4;i++) deck.push({ color:"wild", value:"WildDraw4", id:`wd${i}` });
  return deck.sort(() => Math.random()-0.5);
}

function isPlayable(card: UnoCard, top: UnoCard, activeColor: UnoColor): boolean {
  if (card.color === "wild") return true;
  return card.color === activeColor || card.value === top.value;
}

function cardScore(c: UnoCard): number {
  if (c.value === "Wild" || c.value === "WildDraw4") return 50;
  if (["Skip","Reverse","Draw2"].includes(c.value)) return 20;
  return parseInt(c.value) || 0;
}

function UnoCardView({ card, onClick, disabled, small, faceDown }: {
  card: UnoCard; onClick?: () => void; disabled?: boolean; small?: boolean; faceDown?: boolean;
}) {
  const bg = faceDown ? "#7c3aed" : CSS[card.color];
  const size = small ? { width:40, height:60, fontSize:10 } : { width:52, height:76, fontSize:13 };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...size, background: bg, borderRadius:6, border:"3px solid white",
        color:"white", fontWeight:"bold", cursor: onClick&&!disabled?"pointer":"default",
        opacity: disabled ? 0.5 : 1,
        boxShadow: onClick&&!disabled ? "0 0 8px rgba(255,255,255,0.5)" : "0 2px 4px rgba(0,0,0,.3)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        flexShrink:0, transition:"transform .15s",
        transform: onClick&&!disabled ? "none" : "none",
      }}
      className={onClick&&!disabled ? "hover:-translate-y-1" : ""}>
      {!faceDown && <>
        <div style={{fontSize: size.fontSize+2}}>{card.value === "Wild" ? "W" : card.value === "WildDraw4" ? "W+4" : card.value}</div>
        {!small && <div style={{fontSize:10,opacity:.8}}>{card.color !== "wild" ? card.color : "WILD"}</div>}
      </>}
      {faceDown && <div style={{fontSize:20}}>🃏</div>}
    </button>
  );
}

type PlayerType = "human"|"ai";
interface Player { id: number; name: string; type: PlayerType; hand: UnoCard[] }

function initGame() {
  const deck = makeDeck();
  const players: Player[] = [
    { id:0, name:"You", type:"human", hand: deck.splice(0,7) },
    { id:1, name:"AI 1", type:"ai", hand: deck.splice(0,7) },
    { id:2, name:"AI 2", type:"ai", hand: deck.splice(0,7) },
  ];
  // First card can't be wild
  let topIdx = 0;
  while (deck[topIdx].color === "wild") topIdx++;
  const [top] = deck.splice(topIdx,1);
  return { players, deck, discard: [top], current:0, direction:1, activeColor: top.color as UnoColor,
    phase:"play" as "play"|"color-pick", unoCalled:false, winner:null as number|null, message:"Your turn!" };
}

function UnoGame() {
  const [game, setGame] = useState(initGame);
  const [colorPick, setColorPick] = useState<UnoCard|null>(null);
  const [unoCalled, setUnoCalled] = useState(false);

  const top = game.discard[game.discard.length-1];

  const applyEffect = useCallback((card: UnoCard, color: UnoColor, state: ReturnType<typeof initGame>): ReturnType<typeof initGame> => {
    const next = { ...state };
    const numPlayers = next.players.length;
    const nextIdx = (next.current + next.direction + numPlayers) % numPlayers;
    if (card.value === "Skip") {
      next.current = (nextIdx + next.direction + numPlayers) % numPlayers;
      next.message = `${next.players[nextIdx].name} was skipped!`;
    } else if (card.value === "Reverse") {
      next.direction *= -1;
      next.current = (next.current + next.direction + numPlayers) % numPlayers;
    } else if (card.value === "Draw2") {
      const draw = next.deck.splice(0,2);
      next.players = next.players.map((p,i) => i===nextIdx ? {...p, hand:[...p.hand,...draw]} : p);
      next.current = (nextIdx + next.direction + numPlayers) % numPlayers;
      next.message = `${next.players[nextIdx].name} draws 2!`;
    } else if (card.value === "WildDraw4") {
      const draw = next.deck.splice(0,4);
      next.players = next.players.map((p,i) => i===nextIdx ? {...p, hand:[...p.hand,...draw]} : p);
      next.current = (nextIdx + next.direction + numPlayers) % numPlayers;
      next.message = `${next.players[nextIdx].name} draws 4!`;
    } else {
      next.current = nextIdx;
    }
    next.activeColor = color;
    return next;
  }, []);

  const playCard = useCallback((card: UnoCard, playerIdx: number, chosenColor?: UnoColor) => {
    if (!isPlayable(card, top, game.activeColor)) return;
    const color = chosenColor || card.color as UnoColor;

    setGame(prev => {
      const next = { ...prev, players: prev.players.map(p => ({...p, hand:[...p.hand]})),
        deck:[...prev.deck], discard:[...prev.discard] };
      // Remove card from player hand
      next.players = next.players.map((p,i) => i===playerIdx ? {...p, hand:p.hand.filter(c=>c.id!==card.id)} : p);
      next.discard.push({...card, color: color==="wild"?card.color:color});

      // Check win
      if (next.players[playerIdx].hand.length === 0) {
        next.winner = playerIdx;
        next.message = `🏆 ${next.players[playerIdx].name} wins!`;
        return next;
      }

      // UNO check
      if (next.players[playerIdx].hand.length === 1 && !unoCalled && playerIdx===0) {
        next.players[0] = {...next.players[0], hand:[...next.players[0].hand, ...next.deck.splice(0,2)]};
        next.message = "You forgot to call UNO! +2 cards";
      }

      return applyEffect({...card, color: color==="wild"?card.color:color}, color, next);
    });
    setUnoCalled(false);
    setColorPick(null);
  }, [top, game.activeColor, applyEffect, unoCalled]);

  const drawCard = useCallback(() => {
    setGame(prev => {
      const next = { ...prev, deck:[...prev.deck], players:prev.players.map(p=>({...p,hand:[...p.hand]})) };
      if (next.deck.length === 0) {
        const top = next.discard.pop()!;
        next.deck = next.discard.sort(()=>Math.random()-.5);
        next.discard = [top];
      }
      const drawn = next.deck.shift()!;
      next.players[0] = {...next.players[0], hand:[...next.players[0].hand, drawn]};
      // If playable, auto-select for player; else pass turn
      if (!isPlayable(drawn, next.discard[next.discard.length-1], next.activeColor)) {
        const numPlayers = next.players.length;
        next.current = (next.current + next.direction + numPlayers) % numPlayers;
        next.message = "Drew a card - no match, turn passed.";
      } else {
        next.message = "Drew a card - you can play it!";
      }
      return next;
    });
  }, []);

  // AI turns
  useEffect(() => {
    if (game.winner) return;
    if (game.current === 0) return;
    const t = setTimeout(() => {
      const ai = game.players[game.current];
      const playable = ai.hand.filter(c => isPlayable(c, top, game.activeColor));
      if (playable.length > 0) {
        const card = playable[Math.floor(Math.random()*playable.length)];
        const color = card.color === "wild" ? COLORS[Math.floor(Math.random()*4)] as UnoColor : card.color;
        playCard(card, game.current, color);
      } else {
        // Draw and pass
        setGame(prev => {
          const next = { ...prev, deck:[...prev.deck], players:prev.players.map(p=>({...p,hand:[...p.hand]})) };
          if (next.deck.length > 0) {
            const drawn = next.deck.shift()!;
            next.players[next.current] = {...next.players[next.current], hand:[...next.players[next.current].hand,drawn]};
          }
          const numPlayers = next.players.length;
          next.current = (next.current + next.direction + numPlayers) % numPlayers;
          next.message = `${ai.name} drew a card.`;
          return next;
        });
      }
    }, 800);
    return () => clearTimeout(t);
  }, [game.current, game.winner, top, game.activeColor, playCard]);

  const human = game.players[0];
  const playableCards = game.current === 0 && !game.winner
    ? new Set(human.hand.filter(c => isPlayable(c, top, game.activeColor)).map(c=>c.id))
    : new Set<string>();

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-lg mx-auto">
      {/* Status */}
      <div className="text-center">
        <div className="text-sm font-bold text-white">{game.message}</div>
        <div style={{color:CSS[game.activeColor]}} className="text-xs">Active color: {game.activeColor}</div>
      </div>

      {game.winner !== null && (
        <button onClick={() => { setGame(initGame()); setUnoCalled(false); setColorPick(null); }}
          className="bg-yellow-500 text-black font-bold px-6 py-2 rounded-xl text-lg">
          🏆 {game.players[game.winner].name} Wins! Play Again
        </button>
      )}

      {/* AI hands */}
      {game.players.slice(1).map(p => (
        <div key={p.id} className="flex flex-col items-center gap-1">
          <div className="text-xs text-slate-400">{p.name} ({p.hand.length} cards){game.current===p.id?" ⟵":"" }</div>
          <div className="flex gap-1 flex-wrap justify-center max-w-xs">
            {p.hand.map(c => <UnoCardView key={c.id} card={c} faceDown small/>)}
          </div>
        </div>
      ))}

      {/* Discard pile */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs text-slate-400">Draw Pile ({game.deck.length})</div>
          <button onClick={game.current===0&&!game.winner?drawCard:undefined}
            style={{width:52,height:76,background:"#7c3aed",borderRadius:6,border:"3px solid white",
              cursor:game.current===0&&!game.winner?"pointer":"default",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🃏</button>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs text-slate-400">Top Card</div>
          <UnoCardView card={{...top, color:game.activeColor==="wild"?top.color:game.activeColor}} />
        </div>
      </div>

      {/* Color picker */}
      {colorPick && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-white font-bold">Choose a color:</div>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button key={c} onClick={() => playCard(colorPick, 0, c)}
                style={{ width:40,height:40,borderRadius:"50%",background:CSS[c],border:"3px solid white" }}/>
            ))}
          </div>
        </div>
      )}

      {/* UNO button */}
      {human.hand.length === 2 && game.current === 0 && !unoCalled && (
        <button onClick={() => setUnoCalled(true)} className="bg-red-600 hover:bg-red-500 text-white font-black text-2xl px-8 py-2 rounded-full animate-pulse">
          UNO!
        </button>
      )}

      {/* Player hand */}
      <div className="flex flex-col items-center gap-1 w-full">
        <div className="text-xs text-slate-400">Your hand ({human.hand.length} cards){game.current===0?" - Your turn":""}</div>
        <div className="flex gap-1 flex-wrap justify-center max-w-md">
          {human.hand.map(c => (
            <UnoCardView key={c.id} card={c}
              onClick={playableCards.has(c.id) && !colorPick ? () => {
                if (c.color === "wild") { setColorPick(c); }
                else playCard(c, 0);
              } : undefined}
              disabled={!playableCards.has(c.id) || game.current!==0 || !!game.winner} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UnoFriendsGame() {
  return (
    <CalculatorVerticalLayout
      title="Uno Friends"
      description="Play the classic UNO card game against AI opponents! Match colors and numbers, use action cards, and be the first to empty your hand."
      canonical="https://www.smartkitnow.com/games/uno-friends"
      widget={<UnoGame />}
      editorial={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="text-xl font-bold">How to Play Uno Friends</h2>
          <p>Match the top card by color or value. Click a card to play it. Draw from the pile if you can't play.</p>
          <p><strong>Action cards:</strong> Skip (next player loses turn), Reverse (change direction), Draw 2 (next player draws), Wild (change color), Wild Draw 4.</p>
          <p>Click <strong>UNO!</strong> when you have 2 cards left before playing your second-to-last card!</p>
        </div>
      }
      contentMaxWidth="max-w-lg"
    />
  );
}
