import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Types ───────────────────────────────────────────────────────────────────

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
type BetType = "player" | "banker" | "tie";
type GamePhase = "betting" | "dealing" | "result";

interface Card {
  suit: Suit;
  rank: Rank;
}

interface BetState {
  player: number;
  banker: number;
  tie: number;
}

interface RoundResult {
  playerHand: Card[];
  bankerHand: Card[];
  playerScore: number;
  bankerScore: number;
  winner: "player" | "banker" | "tie";
  payout: number;
  betType: BetType;
  betAmount: number;
}

interface GameState {
  balance: number;
  bets: BetState;
  phase: GamePhase;
  playerHand: Card[];
  bankerHand: Card[];
  dealStep: number;
  result: RoundResult | null;
  history: RoundResult[];
  deck: Card[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CHIP_VALUES = [10, 50, 100, 500];
const STORAGE_KEY = "baccarat_balance";
const STARTING_BALANCE = 1000;
const MIN_BET = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildShoe(): Card[] {
  const cards: Card[] = [];
  for (let d = 0; d < 8; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({ suit, rank });
      }
    }
  }
  return cards;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cardValue(rank: Rank): number {
  if (["10", "J", "Q", "K"].includes(rank)) return 0;
  if (rank === "A") return 1;
  return parseInt(rank, 10);
}

function handScore(hand: Card[]): number {
  const total = hand.reduce((sum, c) => sum + cardValue(c.rank), 0);
  return total % 10;
}

// Standard baccarat third-card rules
function shouldPlayerDraw(playerScore: number): boolean {
  return playerScore <= 5;
}

function shouldBankerDraw(bankerScore: number, playerThirdCard: Card | null): boolean {
  if (bankerScore >= 7) return false;
  if (bankerScore <= 2) return true;
  if (playerThirdCard === null) {
    // Player stood — banker draws on 0-5
    return bankerScore <= 5;
  }
  const ptv = cardValue(playerThirdCard.rank);
  if (bankerScore === 3) return ptv !== 8;
  if (bankerScore === 4) return ptv >= 2 && ptv <= 7;
  if (bankerScore === 5) return ptv >= 4 && ptv <= 7;
  if (bankerScore === 6) return ptv === 6 || ptv === 7;
  return false;
}

function computeRound(deck: Card[], bets: BetState): { playerHand: Card[]; bankerHand: Card[]; deck: Card[]; playerScore: number; bankerScore: number; winner: "player" | "banker" | "tie" } {
  const mutableDeck = [...deck];
  const draw = () => mutableDeck.shift()!;

  const playerHand: Card[] = [draw(), draw()];
  const bankerHand: Card[] = [draw(), draw()];

  let pScore = handScore(playerHand);
  let bScore = handScore(bankerHand);

  let playerThird: Card | null = null;

  // Natural check (8 or 9)
  const natural = pScore >= 8 || bScore >= 8;

  if (!natural) {
    if (shouldPlayerDraw(pScore)) {
      playerThird = draw();
      playerHand.push(playerThird);
      pScore = handScore(playerHand);
    }
    if (shouldBankerDraw(bScore, playerThird)) {
      bankerHand.push(draw());
      bScore = handScore(bankerHand);
    }
  }

  const winner: "player" | "banker" | "tie" =
    pScore > bScore ? "player" : bScore > pScore ? "banker" : "tie";

  return { playerHand, bankerHand, deck: mutableDeck, playerScore: pScore, bankerScore: bScore, winner };
}

function computePayout(bets: BetState, winner: "player" | "banker" | "tie"): number {
  let payout = 0;
  const totalBet = bets.player + bets.banker + bets.tie;
  payout -= totalBet; // lose all bets initially

  if (winner === "player" && bets.player > 0) {
    payout += bets.player * 2; // 1:1
  }
  if (winner === "banker" && bets.banker > 0) {
    payout += bets.banker * 1.95; // 0.95:1 after 5% commission
  }
  if (winner === "tie") {
    payout += bets.tie * 9; // 8:1
    // Push for player/banker bets on a tie
    payout += bets.player + bets.banker;
  }

  return Math.round(payout);
}

function loadBalance(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const val = parseInt(stored, 10);
      if (!isNaN(val) && val > 0) return val;
    }
  } catch {
    // ignore
  }
  return STARTING_BALANCE;
}

function saveBalance(balance: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(balance));
  } catch {
    // ignore
  }
}

function initGame(): GameState {
  return {
    balance: loadBalance(),
    bets: { player: 0, banker: 0, tie: 0 },
    phase: "betting",
    playerHand: [],
    bankerHand: [],
    dealStep: 0,
    result: null,
    history: [],
    deck: shuffle(buildShoe()),
  };
}

// ─── Card Component ───────────────────────────────────────────────────────────

const isRedSuit = (suit: Suit) => suit === "♥" || suit === "♦";

interface CardDisplayProps {
  card: Card;
  faceDown?: boolean;
  animate?: boolean;
}

function CardDisplay({ card, faceDown = false, animate = false }: CardDisplayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [animate]);

  if (faceDown) {
    return (
      <div style={{
        width: 52, height: 72, borderRadius: 7,
        background: "linear-gradient(135deg,#8B0000,#c0392b)",
        border: "2px solid #ffd700",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color: "rgba(255,215,0,0.4)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
      }}>
        ✦
      </div>
    );
  }

  return (
    <div style={{
      width: 52, height: 72, borderRadius: 7,
      background: "#fff",
      border: "2px solid #ffd700",
      display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "3px 4px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      transform: visible ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.8)",
      opacity: visible ? 1 : 0,
      transition: "all 0.35s cubic-bezier(0.175,0.885,0.32,1.275)",
    }}>
      <div style={{ fontSize: 12, fontWeight: "bold", color: isRedSuit(card.suit) ? "#c0392b" : "#1a1a1a", lineHeight: 1 }}>
        {card.rank}
      </div>
      <div style={{ fontSize: 18, textAlign: "center", color: isRedSuit(card.suit) ? "#c0392b" : "#1a1a1a", lineHeight: 1 }}>
        {card.suit}
      </div>
      <div style={{ fontSize: 12, fontWeight: "bold", color: isRedSuit(card.suit) ? "#c0392b" : "#1a1a1a", lineHeight: 1, transform: "rotate(180deg)", alignSelf: "flex-end" }}>
        {card.rank}
      </div>
    </div>
  );
}

// ─── Chip Component ───────────────────────────────────────────────────────────

function Chip({ value, onClick }: { value: number; onClick: () => void }) {
  const colors: Record<number, string> = {
    10: "#e74c3c",
    50: "#3498db",
    100: "#2ecc71",
    500: "#9b59b6",
  };
  return (
    <button
      onClick={onClick}
      style={{
        width: 50, height: 50, borderRadius: "50%",
        background: colors[value] || "#666",
        border: "3px solid rgba(255,255,255,0.4)",
        color: "#fff", fontWeight: "bold", fontSize: 13,
        cursor: "pointer", boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
        transition: "transform 0.1s",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      ${value}
    </button>
  );
}

// ─── Bet Box ──────────────────────────────────────────────────────────────────

interface BetBoxProps {
  label: string;
  amount: number;
  isWinner?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  odds: string;
}

function BetBox({ label, amount, isWinner, disabled, onClick, odds }: BetBoxProps) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      style={{
        flex: 1, padding: "12px 6px", borderRadius: 10, textAlign: "center",
        background: isWinner ? "rgba(255,215,0,0.25)" : "rgba(0,0,0,0.3)",
        border: `2px solid ${isWinner ? "#ffd700" : "rgba(255,215,0,0.3)"}`,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.2s",
        minWidth: 90,
      }}
    >
      <div style={{ color: "#ffd700", fontWeight: "bold", fontSize: 14 }}>{label}</div>
      <div style={{ color: "#aaa", fontSize: 11, marginBottom: 4 }}>{odds}</div>
      <div style={{ color: "#fff", fontSize: 18, fontWeight: "bold", minHeight: 24 }}>
        {amount > 0 ? `$${amount}` : "—"}
      </div>
      {isWinner && <div style={{ color: "#ffd700", fontSize: 11, marginTop: 2 }}>WINNER</div>}
    </div>
  );
}

// ─── Main Game ────────────────────────────────────────────────────────────────

function BaccaratRoyale() {
  const [game, setGame] = useState<GameState>(initGame);
  const [activeBet, setActiveBet] = useState<BetType>("player");
  const [dealAnimating, setDealAnimating] = useState(false);
  const [animateCards, setAnimateCards] = useState<number[]>([]);
  const dealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    saveBalance(game.balance);
  }, [game.balance]);

  const totalBet = game.bets.player + game.bets.banker + game.bets.tie;

  const handleAddChip = useCallback((value: number) => {
    if (game.phase !== "betting") return;
    if (game.balance - totalBet - value < 0) return;
    if (totalBet + value < MIN_BET && totalBet === 0 && value < MIN_BET) return;
    setGame((prev) => ({
      ...prev,
      bets: {
        ...prev.bets,
        [activeBet]: prev.bets[activeBet] + value,
      },
    }));
  }, [game.phase, game.balance, totalBet, activeBet]);

  const handleClearBet = useCallback(() => {
    if (game.phase !== "betting") return;
    setGame((prev) => ({ ...prev, bets: { player: 0, banker: 0, tie: 0 } }));
  }, [game.phase]);

  const handleDeal = useCallback(() => {
    if (game.phase !== "betting") return;
    if (totalBet < MIN_BET) return;
    if (game.balance < totalBet) return;

    setDealAnimating(true);
    setAnimateCards([]);

    // Rebuild shoe if low
    let deck = game.deck.length < 20 ? shuffle(buildShoe()) : [...game.deck];

    const roundData = computeRound(deck, game.bets);
    const payout = computePayout(game.bets, roundData.winner);
    const mainBetType: BetType =
      game.bets.player > game.bets.banker && game.bets.player > game.bets.tie
        ? "player"
        : game.bets.banker > game.bets.tie
        ? "banker"
        : "tie";

    const result: RoundResult = {
      playerHand: roundData.playerHand,
      bankerHand: roundData.bankerHand,
      playerScore: roundData.playerScore,
      bankerScore: roundData.bankerScore,
      winner: roundData.winner,
      payout,
      betType: mainBetType,
      betAmount: totalBet,
    };

    // Animate cards one by one
    const totalCards = roundData.playerHand.length + roundData.bankerHand.length;
    let step = 0;
    const reveal = () => {
      step++;
      setAnimateCards((prev) => [...prev, step]);
      if (step < totalCards) {
        dealTimerRef.current = setTimeout(reveal, 400);
      } else {
        dealTimerRef.current = setTimeout(() => {
          setDealAnimating(false);
          setGame((prev) => ({
            ...prev,
            phase: "result",
            playerHand: roundData.playerHand,
            bankerHand: roundData.bankerHand,
            deck: roundData.deck,
            result,
            balance: Math.max(0, prev.balance - totalBet + Math.max(0, payout + totalBet)),
            history: [result, ...prev.history].slice(0, 10),
          }));
        }, 600);
      }
    };

    setGame((prev) => ({
      ...prev,
      phase: "dealing",
      playerHand: roundData.playerHand,
      bankerHand: roundData.bankerHand,
      deck: roundData.deck,
      balance: prev.balance, // deduct after result
    }));

    dealTimerRef.current = setTimeout(reveal, 200);
  }, [game, totalBet]);

  const handleNewRound = useCallback(() => {
    setGame((prev) => ({
      ...prev,
      phase: "betting",
      playerHand: [],
      bankerHand: [],
      dealStep: 0,
      result: null,
      bets: { player: 0, banker: 0, tie: 0 },
    }));
    setAnimateCards([]);
  }, []);

  const handleReset = useCallback(() => {
    const fresh = initGame();
    setGame({ ...fresh, balance: STARTING_BALANCE });
    saveBalance(STARTING_BALANCE);
    setAnimateCards([]);
  }, []);

  useEffect(() => {
    return () => {
      if (dealTimerRef.current) clearTimeout(dealTimerRef.current);
    };
  }, []);

  const showCards = game.phase === "dealing" || game.phase === "result";
  const isResult = game.phase === "result";

  const winnerLabel =
    game.result?.winner === "player"
      ? "Player Wins!"
      : game.result?.winner === "banker"
      ? "Banker Wins!"
      : "Tie!";

  const payoutLabel =
    game.result
      ? game.result.payout >= 0
        ? `+$${game.result.payout}`
        : `-$${Math.abs(game.result.payout)}`
      : "";

  return (
    <div style={{
      background: "linear-gradient(160deg,#0a4a2a 0%,#0d5c34 50%,#0a4a2a 100%)",
      minHeight: 600, borderRadius: 16, padding: 16,
      fontFamily: "Georgia, serif", position: "relative",
      border: "3px solid #8B6914", boxShadow: "0 0 30px rgba(0,0,0,0.5)",
    }}>
      {/* Title & Balance */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ color: "#ffd700", fontWeight: "bold", fontSize: 20, letterSpacing: 1, textShadow: "0 0 10px rgba(255,215,0,0.5)" }}>
          BACCARAT ROYALE
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#90ee90", fontSize: 13 }}>Balance</div>
          <div style={{ color: "#ffd700", fontSize: 22, fontWeight: "bold" }}>${game.balance.toLocaleString()}</div>
        </div>
      </div>

      {/* Bet selection tabs */}
      {game.phase === "betting" && (
        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
          {(["player", "banker", "tie"] as BetType[]).map((bt) => (
            <button
              key={bt}
              onClick={() => setActiveBet(bt)}
              style={{
                flex: 1, padding: "6px 0", borderRadius: 8, border: "none",
                background: activeBet === bt ? "#ffd700" : "rgba(255,215,0,0.15)",
                color: activeBet === bt ? "#1a1a1a" : "#ffd700",
                fontWeight: "bold", fontSize: 13, cursor: "pointer", textTransform: "capitalize",
              }}
            >
              {bt === "tie" ? "Tie" : bt.charAt(0).toUpperCase() + bt.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Chips */}
      {game.phase === "betting" && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          {CHIP_VALUES.map((v) => (
            <Chip key={v} value={v} onClick={() => handleAddChip(v)} />
          ))}
        </div>
      )}

      {/* Bet Boxes */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <BetBox
          label="PLAYER"
          amount={game.bets.player}
          odds="1:1"
          isWinner={isResult && game.result?.winner === "player"}
          disabled={game.phase !== "betting"}
          onClick={() => { setActiveBet("player"); }}
        />
        <BetBox
          label="TIE"
          amount={game.bets.tie}
          odds="8:1"
          isWinner={isResult && game.result?.winner === "tie"}
          disabled={game.phase !== "betting"}
          onClick={() => { setActiveBet("tie"); }}
        />
        <BetBox
          label="BANKER"
          amount={game.bets.banker}
          odds="0.95:1"
          isWinner={isResult && game.result?.winner === "banker"}
          disabled={game.phase !== "betting"}
          onClick={() => { setActiveBet("banker"); }}
        />
      </div>

      {/* Hands */}
      {showCards && (
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 14, padding: "10px 0" }}>
          {/* Player Hand */}
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#ffd700", fontWeight: "bold", marginBottom: 6, fontSize: 13 }}>
              PLAYER {isResult && <span style={{ color: "#90ee90" }}>({game.result?.playerScore})</span>}
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {game.playerHand.map((card, i) => (
                <CardDisplay key={i} card={card} animate={i < animateCards.length} faceDown={i >= animateCards.length} />
              ))}
            </div>
          </div>
          {/* Banker Hand */}
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#ffd700", fontWeight: "bold", marginBottom: 6, fontSize: 13 }}>
              BANKER {isResult && <span style={{ color: "#90ee90" }}>({game.result?.bankerScore})</span>}
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {game.bankerHand.map((card, i) => {
                const cardIdx = game.playerHand.length + i;
                return (
                  <CardDisplay key={i} card={card} animate={cardIdx < animateCards.length} faceDown={cardIdx >= animateCards.length} />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {isResult && game.result && (
        <div style={{
          textAlign: "center", padding: "10px 0", borderTop: "1px solid rgba(255,215,0,0.3)",
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 22, fontWeight: "bold", color: "#ffd700", marginBottom: 2 }}>
            {winnerLabel}
          </div>
          <div style={{
            fontSize: 18, fontWeight: "bold",
            color: game.result.payout >= 0 ? "#90ee90" : "#ff6b6b",
          }}>
            {payoutLabel}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {game.phase === "betting" && (
          <>
            <button
              onClick={handleClearBet}
              disabled={totalBet === 0}
              style={{
                padding: "8px 20px", borderRadius: 8, border: "none",
                background: totalBet === 0 ? "#444" : "#e74c3c",
                color: "#fff", fontWeight: "bold", cursor: totalBet === 0 ? "not-allowed" : "pointer",
                fontSize: 14,
              }}
            >
              Clear Bet
            </button>
            <button
              onClick={handleDeal}
              disabled={totalBet < MIN_BET}
              style={{
                padding: "8px 30px", borderRadius: 8, border: "2px solid #ffd700",
                background: totalBet < MIN_BET ? "#555" : "linear-gradient(135deg,#8B6914,#ffd700,#8B6914)",
                color: totalBet < MIN_BET ? "#aaa" : "#1a1a1a",
                fontWeight: "bold", cursor: totalBet < MIN_BET ? "not-allowed" : "pointer",
                fontSize: 15, letterSpacing: 1,
              }}
            >
              DEAL {totalBet > 0 ? `($${totalBet})` : ""}
            </button>
          </>
        )}
        {game.phase === "result" && (
          <>
            <button
              onClick={handleNewRound}
              style={{
                padding: "8px 30px", borderRadius: 8, border: "2px solid #ffd700",
                background: "linear-gradient(135deg,#8B6914,#ffd700,#8B6914)",
                color: "#1a1a1a", fontWeight: "bold", cursor: "pointer", fontSize: 15,
              }}
            >
              New Round
            </button>
            {game.balance < MIN_BET && (
              <button
                onClick={handleReset}
                style={{
                  padding: "8px 20px", borderRadius: 8, border: "none",
                  background: "#2980b9", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: 14,
                }}
              >
                Reload $1000
              </button>
            )}
          </>
        )}
        {game.phase === "dealing" && (
          <div style={{ color: "#ffd700", fontSize: 16, fontWeight: "bold", padding: "8px 0" }}>
            Dealing...
          </div>
        )}
      </div>

      {/* Min bet note */}
      {game.phase === "betting" && (
        <div style={{ color: "#aaa", fontSize: 11, textAlign: "center", marginTop: 6 }}>
          Min bet: ${MIN_BET} | Select Player/Banker/Tie, then add chips
        </div>
      )}

      {/* History */}
      {game.history.length > 0 && (
        <div style={{ marginTop: 14, borderTop: "1px solid rgba(255,215,0,0.2)", paddingTop: 10 }}>
          <div style={{ color: "#ffd700", fontSize: 12, marginBottom: 6, fontWeight: "bold" }}>Round History</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {game.history.map((r, i) => (
              <div
                key={i}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: r.winner === "player" ? "#3498db" : r.winner === "banker" ? "#e74c3c" : "#2ecc71",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: "#fff", fontWeight: "bold",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
                title={`${r.winner.toUpperCase()} P${r.playerScore} vs B${r.bankerScore}`}
              >
                {r.winner === "player" ? "P" : r.winner === "banker" ? "B" : "T"}
              </div>
            ))}
          </div>
          <div style={{ color: "#aaa", fontSize: 10, marginTop: 4 }}>Blue=Player, Red=Banker, Green=Tie</div>
        </div>
      )}
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function BaccaratRoyaleGame() {
  return (
    <CalculatorVerticalLayout
      title="Baccarat Royale"
      description="Play Baccarat Royale online — bet on Player, Banker, or Tie. Authentic third-card rules, animated dealing, and realistic casino payouts. Free to play."
      canonical="https://www.smartkitnow.com/games/baccarat-royale"
      widget={<BaccaratRoyale />}
      contentMaxWidth="max-w-5xl"
      editorial={
        <div>
          <h2>How to Play Baccarat Royale</h2>
          <p>
            Baccarat is one of the most elegant and suspenseful casino card games. It requires no skill
            — you simply bet on which hand (Player or Banker) will be closest to 9, or whether the
            result will be a Tie.
          </p>
          <h3>Card Values</h3>
          <ul>
            <li>Ace = 1 point</li>
            <li>2–9 = face value</li>
            <li>10, J, Q, K = 0 points</li>
            <li>Only the units digit of the total counts (e.g., 15 = 5)</li>
          </ul>
          <h3>How to Bet</h3>
          <ol>
            <li>Select a bet target: Player, Banker, or Tie.</li>
            <li>Click chip buttons ($10, $50, $100, $500) to add to your bet.</li>
            <li>Click DEAL to start the round.</li>
          </ol>
          <h3>Third Card Rules (Automatic)</h3>
          <p>
            If either hand totals 8 or 9 (a "natural"), no more cards are drawn. Otherwise:
          </p>
          <ul>
            <li>Player draws a third card if their score is 0–5.</li>
            <li>Banker's draw depends on their score and whether the Player drew a third card (standard rules applied automatically).</li>
          </ul>
          <h3>Payouts</h3>
          <ul>
            <li><strong>Player wins:</strong> 1:1 (even money)</li>
            <li><strong>Banker wins:</strong> 0.95:1 (5% commission deducted)</li>
            <li><strong>Tie:</strong> 8:1 (Player and Banker bets are returned)</li>
          </ul>
          <h3>Strategy Tips</h3>
          <p>
            The Banker bet has the lowest house edge (~1.06%), making it statistically the best bet.
            Tie bets carry a high house edge (~14%) and should be used sparingly. There is no system
            that can overcome the house edge in the long run — enjoy the game responsibly.
          </p>
        </div>
      }
    />
  );
}
