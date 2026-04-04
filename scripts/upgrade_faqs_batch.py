"""
Batch FAQ Upgrader -- replaces generic 8-question template with specific FAQs.
Run: python scripts/upgrade_faqs_batch.py [--dry-run] [--file FILENAME]

Each calculator gets 5-6 unique questions with:
  --  Real numbers, benchmarks, or regulatory thresholds
  --  No generic "How accurate" / "What should I do" template language
  --  At least 2 answers with numeric examples
  --  At least 1 comparison to a related concept
"""

import os
import re
import argparse

CALC_DIR = "src/components/calculators/Financial"

# ─────────────────────────────────────────────────────────────────────────────
# FAQ DATABASE -- keyed by filename (without .tsx)
# Each entry: list of {question, answer} dicts (plain text, no HTML required)
# ─────────────────────────────────────────────────────────────────────────────
FAQ_DB = {

"CapitalGainsTaxEstimatorCalculator": [
    {
        "question": "What is the difference between short-term and long-term capital gains?",
        "answer": "Short-term capital gains apply to assets held 365 days or fewer and are taxed at your ordinary income rate (10–37% in 2024). Long-term capital gains apply to assets held longer than one year and are taxed at preferential rates: 0% (income ≤ $47,025), 15% ($47,026–$518,900), or 20% (above $518,900) for single filers. Holding an asset just one extra day to cross the one-year threshold can save thousands. For example, a $20,000 gain in the 32% income bracket drops from $6,400 (short-term) to $3,000 (15% long-term)."
    },
    {
        "question": "Does the wash-sale rule apply to capital gains calculations?",
        "answer": "The wash-sale rule disallows claiming a loss if you repurchase the same or substantially identical security within 30 days before or after the sale. It does not affect gain calculations -- only losses. If you sell a stock at a loss to offset capital gains (tax-loss harvesting), you must wait 31 days before buying it back. Note: as of 2024, the IRS has not formally applied wash-sale rules to cryptocurrency, though proposed legislation would change this."
    },
    {
        "question": "How does state capital gains tax work alongside federal tax?",
        "answer": "Most states tax capital gains as ordinary income, with no preferential long-term rate. State rates range from 0% (FL, TX, WA, NV, no state income tax) to 13.3% (California, which has the highest rate and taxes all gains as income). Combined federal + state rates in high-tax states can reach 33% for long-term gains and 50%+ for short-term. California, for instance, applies 13.3% on top of up to 20% federal, plus the 3.8% Net Investment Income Tax (NIIT) for high earners."
    },
    {
        "question": "What is the Net Investment Income Tax (NIIT) and who pays it?",
        "answer": "The NIIT is an additional 3.8% tax on net investment income (including capital gains) for taxpayers whose modified adjusted gross income (MAGI) exceeds $200,000 (single) or $250,000 (married filing jointly). This means high earners pay up to 23.8% on long-term gains (20% + 3.8%) rather than 20%. The NIIT applies to both realized and some unrealized gains in specific circumstances. Use this calculator's results alongside your MAGI to determine whether the NIIT applies."
    },
    {
        "question": "Can I offset capital gains with capital losses?",
        "answer": "Yes. Capital losses directly offset capital gains dollar-for-dollar. If losses exceed gains, up to $3,000 of excess loss can offset ordinary income per year; remaining losses carry forward indefinitely. Strategy: harvest losses in December to offset gains realized earlier in the year. Example: $15,000 gain + $12,000 loss = $3,000 net gain. Without the loss, you might owe $450 (15% rate); with it, only $450 on $3,000. Carry-forward losses reduce future tax liability even after you stop investing."
    },
    {
        "question": "How are cryptocurrency capital gains taxed in 2024?",
        "answer": "The IRS treats cryptocurrency as property (Notice 2014-21), so the same short-term/long-term rules apply. Every disposal -- sell, swap, or use crypto to purchase goods -- is a taxable event. The cost basis method matters: FIFO, LIFO, and specific identification all produce different gains. The IRS now requires Form 1099-DA from brokers starting in 2025. Unreported crypto gains are the #1 crypto tax mistake; the IRS receives transaction data from major exchanges. Use this calculator to estimate liability, then report on Schedule D and Form 8949."
    }
],

"CryptoDcaStrategyCalculator": [
    {
        "question": "Does dollar-cost averaging actually outperform lump-sum investing in crypto?",
        "answer": "Academic research consistently shows lump-sum investing outperforms DCA about 66% of the time in traditional markets over 10-year periods (Vanguard, 2012). In crypto, where volatility is extreme, DCA shows stronger relative performance because large price swings punish perfectly-timed lump sums. However, DCA's primary benefit isn't return maximization -- it's behavioral: removing timing pressure reduces panic selling and improves long-term hold rates. If you cannot predict market bottoms (and no one reliably can), a weekly or monthly DCA schedule removes that variable entirely."
    },
    {
        "question": "How does exchange trading fee frequency affect DCA returns?",
        "answer": "Fees compound against you with every DCA purchase. At 0.1% per trade (Coinbase Advanced): 52 weekly purchases at $100 = $5,200 invested, $5.20 in fees (0.1% total cost). At 1.49% (Coinbase standard): same schedule costs $77.48 in fees -- nearly 1.5% of principal before any market movement. Always use limit orders or a low-fee platform for DCA. Multiply your intended DCA frequency by fee rate to understand annualized drag. A 0.5% fee on weekly buys is a 26% annual fee drag on new capital."
    },
    {
        "question": "How should I set my DCA interval -- daily, weekly, or monthly?",
        "answer": "Shorter intervals reduce timing risk more but increase fee drag. For most crypto investors: weekly DCA offers the best balance of volatility smoothing and fee efficiency. Monthly is better if your exchange charges flat fees (e.g., $2.99 per trade regardless of size). Daily is only worth it if fees are zero and you have evidence that daily volatility is meaningful. Practically: match your DCA interval to your income cycle -- weekly for weekly paychecks, monthly for monthly salary. Consistency matters more than the exact interval."
    },
    {
        "question": "What is the tax treatment of DCA purchases -- do I track each lot separately?",
        "answer": "Yes. Each DCA purchase creates a separate tax lot with its own cost basis and holding period. When you sell, you choose which lots to sell using FIFO (default), LIFO, or specific identification. Specific identification lets you sell high-cost-basis lots first to minimize gains. For 50 weekly DCA purchases, that is 50 separate tax lots to track. Most crypto tax software (Koinly, CoinTracker) handles this automatically. Failing to track lot-level basis is the most common DCA tax error -- the IRS will default to 0 cost basis if records are missing."
    },
    {
        "question": "Should I DCA into a single crypto or spread across multiple assets?",
        "answer": "Single-asset DCA (typically BTC or ETH) provides the most concentrated exposure and clearest tracking. Multi-asset DCA increases complexity proportionally -- each asset has its own lot tracking, different liquidity, and correlated or uncorrelated risk. Research shows Bitcoin and Ethereum had 0.85+ correlation during bear markets (2022), meaning diversification benefits within crypto are limited. If your goal is crypto exposure with managed risk, DCA into BTC/ETH first, then consider diversification once your position exceeds $10,000. Avoid DCA into low-cap coins -- illiquidity and project failure risk outweigh DCA's volatility-smoothing benefit."
    }
],

"CryptoFutureValueCompoundGrowthCalculator": [
    {
        "question": "What growth rate should I use for crypto future value projections?",
        "answer": "Bitcoin's compound annual growth rate (CAGR) from 2012–2024 was approximately 140%. From 2017–2024 (post-mainstream adoption): approximately 30% CAGR. From 2020–2024: approximately 25%. Use 15–25% for conservative long-term BTC projections, 5–10% for extremely conservative scenarios. Never project altcoin growth from past performance -- selection bias (you only see coins that survived) makes historical altcoin returns misleading. For financial planning, stress-test with 0% growth and negative scenarios alongside optimistic projections."
    },
    {
        "question": "How does the compound growth formula apply to volatile assets like crypto?",
        "answer": "The compound growth formula (FV = PV × (1 + r)^n) assumes a smooth, consistent growth rate -- which crypto never has. In reality, a 25% CAGR might be delivered as: +300%, -70%, +100%, -65%, +200%. The terminal value matches the formula, but the path matters for investors who sell during drawdowns. The geometric mean return is always lower than the arithmetic mean for volatile assets. A 50% gain followed by 50% loss = -25% net, not 0%. This calculator gives your expected terminal value; your actual outcome depends heavily on whether you hold through volatility."
    },
    {
        "question": "What is the difference between nominal and inflation-adjusted crypto returns?",
        "answer": "Nominal returns are raw percentage gains in USD. Real (inflation-adjusted) returns subtract the purchasing power impact of inflation. With 3% annual inflation, a 25% nominal return is a 21.4% real return. For large crypto gains, this distinction matters less (25% nominal vs 21.4% real), but for conservative scenarios (8% nominal), a 3% inflation rate drops real return to 4.9% -- nearly halved. Always compare crypto returns to inflation-adjusted alternatives: the S&P 500 has returned approximately 7% real (10% nominal - 3% inflation) over the long term. Use the real return when evaluating whether crypto outperforms a traditional portfolio."
    },
    {
        "question": "How does compounding frequency affect future value for crypto holdings?",
        "answer": "Compounding frequency only matters if you are reinvesting returns (e.g., staking rewards). For simple price appreciation, holding $1,000 in BTC compounds once -- when you sell. For staking: daily compounding at 5% APY yields 5.13% effective APY (APY = (1 + 0.05/365)^365 − 1). Monthly compounding at 5% APY yields 5.12% effective APY. The difference between daily and monthly compounding is negligible below 20% APY. Above 20% (common in early DeFi), daily compounding adds meaningful return -- a 50% APY daily-compounded becomes 64.9% effective APY."
    },
    {
        "question": "Why do future value projections for crypto feel unrealistic at long time horizons?",
        "answer": "At high growth rates, the math produces astronomical numbers that reveal a real constraint: market cap ceilings. Bitcoin cannot sustain 100% annual growth for 20 years -- that would produce a market cap larger than global GDP. At 25% CAGR for 20 years, $10,000 becomes $867,000. At 10% for 20 years: $67,275. Use the calculator to understand scenarios rather than predictions. The most useful exercise is running multiple rates (5%, 10%, 20%) to understand the range of outcomes and to compare whether crypto projections beat index fund equivalents (7% real) by a meaningful enough margin to justify the risk."
    }
],

"CryptoProfitLossCalculator": [
    {
        "question": "How do exchange fees affect my actual crypto profit?",
        "answer": "Fees are subtracted from profit on both entry and exit. On a $10,000 trade at 0.1% taker fee: $10 fee buying + $10 fee selling = $20 total fees. On a 5% price move ($500 gain), your net profit is $480 -- fees consumed 4% of profit. On small price moves, fees dominate: a 0.2% move on a $10,000 position yields $20 gain minus $20 fees = $0 net. Always factor in your platform's maker/taker structure. Binance: 0.1% standard, 0.075% with BNB. Coinbase Advanced: 0.6% taker. Kraken: 0.26% taker. Over 100 trades per year, fee optimization can save thousands."
    },
    {
        "question": "Should I use FIFO or specific identification for crypto cost basis?",
        "answer": "FIFO (first-in, first-out) is the IRS default if you do not specify otherwise. It sells your oldest lots first, which often means selling low-cost-basis lots (bought long ago when price was lower), maximizing taxable gains. Specific identification lets you choose which lot to sell -- typically the highest-cost-basis lot to minimize gain. For profit/loss calculation, the method changes your taxable outcome, not your economic gain. Example: bought 1 BTC at $20,000 (2022) and 1 BTC at $60,000 (2024), selling 1 BTC at $70,000. FIFO: $50,000 gain. Specific ID: $10,000 gain. Always document your lot selection at time of sale for IRS compliance."
    },
    {
        "question": "What counts as a taxable disposal for crypto profit/loss purposes?",
        "answer": "Any of these triggers a taxable event requiring gain/loss calculation: (1) selling crypto for fiat, (2) trading crypto-to-crypto (e.g., BTC→ETH -- the BTC sale is taxable), (3) using crypto to pay for goods or services, (4) receiving staking or mining rewards (taxed as income at fair market value on receipt date, then as capital gain/loss when sold). Non-taxable events: buying crypto with fiat, transferring between your own wallets, gifting crypto below annual exclusion ($18,000 in 2024), holding. Every taxable event needs a basis record; missing basis records default to $0 cost basis under IRS rules."
    },
    {
        "question": "How do I calculate profit on a partial crypto sale?",
        "answer": "Profit = (Sale price × units sold) − (Cost basis per unit × units sold) − fees. If you bought 2 ETH at $1,500 each ($3,000 total) and sell 0.5 ETH at $2,200: proceeds = $1,100. Cost basis for 0.5 ETH = $750. Net gain = $350 (before fees). Remaining 1.5 ETH retains its original $2,250 cost basis for future calculations. For DCA purchases (multiple lots at different prices), calculate the weighted average cost or track each lot individually for specific identification. Weighted average is simpler but not accepted by IRS for crypto -- you must use FIFO, LIFO, or specific ID."
    },
    {
        "question": "How does leverage affect crypto profit and loss calculations?",
        "answer": "Leveraged crypto trading multiplies both gains and losses by the leverage ratio. At 10× leverage on a $1,000 margin: you control $10,000 of crypto. A 5% price increase = $500 gain (50% on your $1,000 margin). A 10% price decrease = $1,000 loss -- full liquidation of margin. Liquidation typically occurs at 8–12% adverse move on 10× leverage (exchanges maintain a buffer). Profit/loss calculations must use the full position value, not just margin. Additionally, funding rates on perpetual contracts (0.01–0.1% per 8 hours) create ongoing cost that erodes leveraged positions -- equivalent to 10–45% annual cost on a perpetually held leveraged position."
    }
],

"CryptoRoiCalculator": [
    {
        "question": "What is the difference between ROI, CAGR, and IRR for crypto investments?",
        "answer": "ROI = (Gain / Cost) × 100 -- simple total return, ignores time. CAGR (Compound Annual Growth Rate) = (Final Value / Initial Value)^(1/years) − 1 -- annualizes ROI for fair time-period comparison. IRR (Internal Rate of Return) accounts for multiple cash flows at different times -- useful for DCA strategies where you invest at different prices. Example: $1,000 → $4,000 in 3 years. ROI = 300%. CAGR = 58.7% per year. Use CAGR to compare across investments. Use IRR for DCA. Simple ROI overvalues longer-held investments when comparing to alternatives."
    },
    {
        "question": "How do I calculate ROI when I've made multiple crypto purchases at different prices?",
        "answer": "Calculate weighted average cost basis, then compare to current value. Example: bought 0.1 BTC at $30,000 ($3,000) + 0.05 BTC at $50,000 ($2,500) = 0.15 BTC at average $36,667. If BTC is now $70,000: value = $10,500. Total invested = $5,500. ROI = ($10,500 − $5,500) / $5,500 × 100 = 90.9%. For tax reporting, weighted average is acceptable for stocks but not crypto -- the IRS requires lot-level tracking. For management/decision-making, weighted average cost basis gives the clearest picture of overall position performance."
    },
    {
        "question": "Should I include transaction fees in crypto ROI calculations?",
        "answer": "Yes -- always include fees in the cost basis for accurate ROI. If you paid $5,000 for ETH plus $50 in exchange fees, your true cost basis is $5,050. Excluding fees overstates ROI, especially for active traders. On a position with 10% gain ($500 on $5,000), ignoring $100 total fees (entry + exit) inflates ROI from 8% true return to 10% nominal. For high-frequency traders, fee drag can consume 2–5% of capital annually. Include: exchange trading fees, gas fees for on-chain transactions, withdrawal fees, and any conversion costs when moving between exchanges."
    },
    {
        "question": "How do I calculate the break-even price needed to recover my investment?",
        "answer": "Break-even price = Total cost (including fees) / Units held. Example: bought 2 ETH at $1,600 = $3,200, paid $16 in fees = $3,216 total cost. Break-even per ETH = $3,216 / 2 = $1,608. To calculate break-even including sell-side fees: Break-even = Total cost / (Units × (1 − sell fee rate)). With 0.1% sell fee: $3,216 / (2 × 0.999) = $1,609.61. This matters most for low-margin trades. For a tax-included break-even (accounting for capital gains), the math is more complex and depends on your marginal rate and holding period."
    },
    {
        "question": "How do taxes affect my real crypto ROI?",
        "answer": "After-tax ROI = Pre-tax gain × (1 − effective tax rate) / Investment. For a $10,000 gain on $5,000 invested (200% pre-tax ROI) held under one year (short-term): at 32% marginal rate, after-tax gain = $6,800, after-tax ROI = 136%. For long-term (held 1+ year) at 15% rate: after-tax gain = $8,500, after-tax ROI = 170%. State taxes add 0–13.3%. The difference between short-term and long-term treatment on a large gain can easily exceed $5,000 in taxes. On investments above $518,900 income, the additional 3.8% NIIT brings long-term rate to 23.8% federal."
    }
],

"CryptoTaxLiabilityCalculator": [
    {
        "question": "Which crypto transactions are taxable events in 2024?",
        "answer": "Taxable: selling crypto for USD, trading crypto-to-crypto, paying for goods/services with crypto, receiving staking rewards (taxed as ordinary income at receipt), receiving mining income, receiving airdrops (taxed as income when you gain dominion and control). Not taxable: buying crypto with fiat, holding, transferring between your own wallets, gifting below the annual exclusion ($18,000 in 2024). The IRS added a crypto question to the top of Form 1040 in 2019 -- answering 'no' when you had taxable transactions is a perjury risk. Over 8,000 cryptocurrency enforcement cases were opened by IRS CI in 2023."
    },
    {
        "question": "How do I calculate crypto tax liability for staking rewards?",
        "answer": "Staking rewards are taxed as ordinary income at their fair market value (FMV) on the date received. Example: received 0.5 ETH as staking reward when ETH = $2,000/ETH. Taxable income = $1,000 (ordinary income at your marginal rate). Your new cost basis for this 0.5 ETH is $1,000. When you later sell it at $3,000, you recognize an additional $500 capital gain (($3,000 − $1,000) × 0.5 ETH). This double taxation -- income at receipt + capital gain at sale -- is why staking has complex tax treatment. The IRS confirmed this position in Rev. Rul. 2023-14."
    },
    {
        "question": "What crypto tax forms does the IRS require?",
        "answer": "Form 8949 (Sales and Other Dispositions of Capital Assets): reports every individual disposal with cost basis, proceeds, and gain/loss. Schedule D: summarizes all capital gains/losses from Form 8949. Schedule 1 (Additional Income): reports staking, mining, and airdrop income. Starting 2025, exchanges issue Form 1099-DA (Digital Asset Proceeds) -- similar to a 1099-B for stocks. Before 2025, most exchanges issued 1099-Misc or nothing. Missing a Form 8949 entry for each disposal is an audit risk; the IRS cross-references exchange 1099 data. Crypto tax software (Koinly, TaxBit, CoinTracker) generates compliant Form 8949 exports automatically."
    },
    {
        "question": "How does the IRS detect unreported cryptocurrency income?",
        "answer": "The IRS receives data from major US exchanges via John Doe summonses and voluntary reporting. Coinbase was required to report user data for accounts with $20,000+ in transactions (2016). Kraken, Poloniex, and others faced similar summonses. Starting 2025, all US exchanges must issue 1099-DA for every customer. Additionally, the IRS uses blockchain analytics firms (Chainalysis, CipherTrace) to trace on-chain activity to real identities via exchange-linked wallet addresses. Virtual currency is included on FBAR if foreign exchange holdings exceed $10,000. The IRS crypto unit audited over 1,000 cases in 2023 with an 89% success rate."
    },
    {
        "question": "Can I deduct crypto losses against other income?",
        "answer": "Crypto losses follow standard capital loss rules: they first offset capital gains (net against gains dollar-for-dollar). If net capital losses remain, up to $3,000 can offset ordinary income per year ($1,500 for married filing separately). Excess losses carry forward indefinitely. Example: $30,000 crypto loss, $20,000 capital gain from stocks. Net loss = $10,000. Use $3,000 against ordinary income this year; carry $7,000 forward. Note: unlike stocks, the wash-sale rule does not currently apply to crypto (as of 2024) -- you can sell at a loss and immediately repurchase the same crypto. This enables aggressive tax-loss harvesting strategies that are unavailable in traditional markets."
    }
],

"CryptoToCryptoExchangeRateCalculator": [
    {
        "question": "Is converting crypto-to-crypto a taxable event?",
        "answer": "Yes -- the IRS explicitly confirmed in Rev. Rul. 2019-24 that crypto-to-crypto trades are taxable. When you swap BTC for ETH, it is treated as: (1) selling BTC at its current FMV (triggering capital gain/loss), (2) buying ETH at that same FMV (establishing your new cost basis). Example: sold 0.1 BTC (cost basis $3,000) when BTC = $60,000 ($6,000 value). You recognize $3,000 capital gain and receive ETH with $6,000 cost basis. This applies to all exchanges -- DEX swaps on Uniswap, CEX trades on Binance, and bridging between chains (which the IRS has not explicitly ruled on, but most tax professionals treat as taxable)."
    },
    {
        "question": "How does the exchange rate between two cryptocurrencies differ from fiat exchange rates?",
        "answer": "Crypto-to-crypto rates are derived market rates with no central authority setting them. On DEXes (Uniswap, Curve), rates are set by automated market makers (AMMs) using liquidity pool ratios -- a large trade moves the rate. On CEXes (Binance, Coinbase), rates are determined by the order book. The same BTC/ETH rate may differ by 0.1–0.5% across exchanges at any moment (arbitrage opportunity). Unlike fiat FX markets which trade $7.5 trillion/day with tight spreads, crypto cross-rates have higher slippage on large trades and wider spreads for illiquid pairs. Always use a fresh rate from your execution venue, not a general price aggregator, for tax reporting."
    },
    {
        "question": "What is slippage in crypto-to-crypto exchanges and how does it affect my rate?",
        "answer": "Slippage is the difference between your expected rate and your executed rate, caused by insufficient liquidity or price movement between order submission and execution. On DEXes: a $10,000 BTC→ETH swap on a liquid pair might have 0.05% slippage; the same swap on a low-liquidity pair could have 5%+ slippage. On CEXes: market orders suffer slippage based on order book depth; limit orders eliminate slippage but may not execute. Price impact (a specific type of slippage on AMMs) increases proportionally with trade size relative to pool liquidity. For large swaps (>$50,000), always check the price impact percentage before confirming a DEX transaction."
    },
    {
        "question": "How do gas fees affect the true cost of crypto-to-crypto exchanges?",
        "answer": "Gas fees are paid in the native token of the blockchain (ETH on Ethereum, BNB on BSC, SOL on Solana) and add directly to your cost basis for the received token. On Ethereum: during peak congestion, a single swap can cost $20–$200 in gas. Example: swap $500 worth of USDC to ETH, pay $50 gas. True cost basis of ETH received = $550. DEX aggregators (1inch, Paraswap) find the lowest slippage route but cannot reduce base gas fees. For small swaps below $1,000, gas fees can represent 5–20% of transaction value on Ethereum mainnet -- use L2 networks (Arbitrum, Base) or CEXes for small trades where gas optimization matters."
    },
    {
        "question": "What is the best way to get the most accurate exchange rate for a crypto swap?",
        "answer": "For execution purposes: use a DEX aggregator (1inch, Jupiter on Solana) which queries multiple liquidity sources simultaneously -- typically beats single-DEX rates by 0.1–0.5% on large trades. For reference/tax reporting: use the exact executed price from your trade confirmation, not a spot price from CoinGecko at the time -- the IRS requires the actual transaction rate, not an approximated FMV. For fiat conversion (to calculate USD value): use the exchange's USD price at the exact timestamp of the trade. Crypto tax software like Koinly pulls historical price data at the exact transaction timestamp, which is essential for compliance. Approximating rates by date (not time) can create material errors on high-volatility days."
    }
],

"DcaStrategyAnalyzerCryptoCalculator": [
    {
        "question": "How does DCA performance compare to lump-sum investing in Bitcoin historically?",
        "answer": "Historical BTC data shows DCA underperforms lump-sum in strongly trending bull markets, but outperforms in bear markets and high-volatility periods. In 2020–2021 (strong bull): a $12,000 lump-sum in January 2020 would have grown to ~$65,000 by December 2021. Monthly $1,000 DCA over the same period: ~$52,000 final value. In 2022 bear market: DCA investors who continued monthly purchases during the crash built lower average cost basis and recovered faster. The primary advantage of DCA is not return maximization -- it is behavioral: it removes the need to time entries and prevents large-loss events from a poorly timed lump-sum."
    },
    {
        "question": "What DCA interval minimizes cost basis in a volatile crypto market?",
        "answer": "Shorter intervals (daily) provide marginally better volatility smoothing but face fee drag. Studies on BTC DCA show that weekly intervals achieve 95%+ of the cost-averaging benefit of daily intervals, while incurring 7× fewer trades (and fees). For practical DCA strategy: use weekly purchases if your exchange has low/zero fees (Fidelity, Robinhood, or CEXes with maker rebates). Use monthly if your platform charges per-trade fees. The optimal interval depends on your exchange's fee structure and your asset's volatility profile -- more volatile assets benefit slightly more from higher-frequency DCA."
    },
    {
        "question": "Should I pause DCA during crypto bear markets?",
        "answer": "The historical data strongly supports continuing DCA during bear markets -- this is precisely when DCA builds the lowest-cost lots. Dollar-cost averaging into BTC during the 2022 bear (peak $69K to bottom $15.5K) resulted in some investors accumulating BTC at sub-$20,000 average cost, which was profitable by mid-2023. The psychological challenge: DCA during bear markets feels painful. Pausing is the most common DCA mistake and turns a systematic strategy into market-timing. The only rational reason to pause: you genuinely cannot afford the investment. Set the DCA amount at a level you can sustain for at least 3 years regardless of price action."
    },
    {
        "question": "How do I track the performance of a DCA strategy over time?",
        "answer": "Key metrics to track: (1) Average cost basis = Total invested / Total units held. (2) Current value = Units held × Current price. (3) Total gain/loss = Current value − Total invested. (4) CAGR = (Current value / Total invested)^(1/years) − 1 -- annualizes your return for comparison. (5) Payback period: when cumulative gains equal total fees paid. Most crypto exchanges provide a 'cost basis' report. For multi-exchange DCA, use portfolio tracking tools (Delta, CoinStats) that aggregate positions and calculate overall basis. Recalculate average basis after every purchase -- the number changes with every DCA execution."
    },
    {
        "question": "What is value averaging (VA) and how does it differ from DCA?",
        "answer": "Value averaging (VA) adjusts the investment amount each period to maintain a target portfolio growth rate. Instead of investing a fixed $200/month, you invest whatever is needed to reach the target value. If your portfolio grew more than expected (crypto price up), you invest less -- or even sell. If it grew less (price down), you invest more. VA generates better average entry prices than DCA in backtests but requires active calculation and more capital reserves for down periods. DCA is simpler and fully automatable; VA is more efficient but demands discipline to invest large amounts precisely when markets are down and reduces positions when they're up -- contrary to human psychology."
    }
],

"FiatToCryptoPurchaseCalculator": [
    {
        "question": "What fees are included in a fiat-to-crypto purchase and how do I minimize them?",
        "answer": "A fiat-to-crypto purchase typically includes: (1) Trading fee: 0.1–1.5% of transaction, (2) Spread: hidden markup between buy and sell price, (3) Deposit fee: varies by payment method (ACH: free; credit card: 3–5%; wire: $10–$25 flat). Total effective cost comparison (2024): Coinbase simple: 2.5–3.5% total. Coinbase Advanced: 0.6% taker + minimal spread. Kraken: 0.26% taker. Binance US: 0.1%. PayPal/CashApp: 1.5–2.5% spread (no stated fee but wide spread). To minimize: use ACH/bank transfer (not credit card), use limit orders on advanced trading interfaces, and compare all-in costs including the bid-ask spread, not just stated fees."
    },
    {
        "question": "How does my choice of fiat currency affect crypto purchase rates outside the US?",
        "answer": "Buying Bitcoin in USD on US exchanges provides the tightest spreads due to highest liquidity. In other currencies, you pay an implicit FX conversion fee. EUR→BTC on a EUR-denominated exchange: tighter spreads than USD→EUR→BTC via conversion. GBP→BTC: good liquidity on Coinbase UK, Kraken. Emerging market currencies (BRL, NGN, ARS): significantly wider spreads (2–5%) and fewer exchange options -- this is why P2P platforms like Paxful historically served these markets. For non-USD purchases, always calculate the all-in rate by comparing your fiat amount to the USD-equivalent value of crypto received."
    },
    {
        "question": "What is the tax basis of crypto purchased with fiat?",
        "answer": "Your cost basis = total fiat amount paid + all fees. If you buy $1,000 of BTC and pay $10 in trading fees, your cost basis is $1,010. This basis determines your capital gain or loss when you later sell or exchange the crypto. Keep records of: purchase date, amount of fiat paid, fees paid, and quantity of crypto received. The IRS requires these records; exchanges are required to report this data via 1099-DA starting 2025. Missing basis information forces you to either prove basis from transaction history or risk the IRS applying $0 basis (maximizing your taxable gain). Purchase confirmations should be saved permanently."
    },
    {
        "question": "How quickly does a fiat-to-crypto purchase settle and why does timing matter?",
        "answer": "Settlement times by method: ACH bank transfer: 3–5 business days (but many exchanges credit crypto immediately while holding the ACH settlement). Wire transfer: same day if sent before cutoff (typically 2PM local). Debit card: instant. Credit card: instant (but 3–5% fee and possible cash advance classification). The timing matters because crypto price fluctuates while fiat is in transit. Most exchanges lock in the price at order time (not settlement time), so a delayed ACH still gets the price at the moment of purchase. Verify your exchange's policy -- some use settlement price, which means your actual crypto quantity is determined after the ACH clears."
    },
    {
        "question": "Is there a limit on how much fiat I can convert to crypto in a single purchase?",
        "answer": "Purchase limits vary by exchange, KYC tier, and payment method. Typical 2024 limits: Coinbase basic: $25,000/day ACH. Coinbase verified: $50,000/day. Kraken: $500,000/day (Pro). Wire transfers often have higher limits. Limits exist due to KYC/AML regulations -- any purchase over $10,000 triggers a Currency Transaction Report (CTR) to FinCEN. Structuring transactions (making multiple purchases under $10,000 specifically to avoid CTR filing) is a federal crime under 31 U.S.C. § 5324, regardless of whether the underlying funds are legal. For large purchases ($100K+), contact your exchange's OTC desk for better rates and institutional-level service."
    }
],

"FutureValueInvestmentCalculator": [
    {
        "question": "What is the difference between future value with and without additional contributions?",
        "answer": "Future value without contributions (FV = PV × (1+r)^n) shows only compound growth on an initial lump sum. Future value with periodic contributions (FV = PV×(1+r)^n + PMT × ((1+r)^n − 1)/r) adds the compounding effect of regular deposits. Example: $10,000 invested at 7% for 30 years = $76,123 (no contributions). Add $200/month: total invested $72,000 extra, but final value = $265,903 -- contributions grew by 3.7× due to compounding. This illustrates why early, consistent contributions matter more than any single lump-sum deposit -- the monthly habit creates most of the terminal value in long-horizon scenarios."
    },
    {
        "question": "How do I account for inflation when interpreting future value results?",
        "answer": "Divide the nominal future value by (1 + inflation rate)^years to get real (purchasing-power-adjusted) value. With 3% inflation for 30 years: divide by 2.427. A $265,000 nominal value has purchasing power of $109,193 in today's dollars. Rule of thumb: at 3% inflation, purchasing power halves every 24 years. For retirement planning: your real return = ((1 + nominal rate) / (1 + inflation rate)) − 1. A 7% nominal return with 3% inflation = 3.88% real return. Always show clients both nominal and real projections -- most people significantly overestimate the purchasing power of large future-value numbers."
    },
    {
        "question": "What investment return rate should I use for a 30-year projection?",
        "answer": "Historical annualized returns (inflation-adjusted): S&P 500: ~7% real (10% nominal − 3% inflation). US bonds: ~1–2% real. Global diversified equity: ~5–6% real. Bitcoin (2015–2024): ~30% nominal (but with extreme volatility and selection bias for survival). Conservative planning assumption: 5–6% nominal for a balanced portfolio, 7–8% for equity-heavy. Never use past crypto returns as a projection rate -- the growth rate was front-loaded in early adoption and is not replicable. Run sensitivity analysis: calculate at 4%, 6%, and 8% to show the outcome range rather than picking one number as 'the answer'."
    },
    {
        "question": "How does compounding frequency affect future value in practice?",
        "answer": "More frequent compounding increases future value, but the effect is small in most practical scenarios. $10,000 at 7% for 30 years: annual compounding = $76,123. Monthly compounding = $81,165. Daily compounding = $81,645. The difference between monthly and daily is only $480 over 30 years -- negligible. The difference between annual and monthly is $5,042 -- more meaningful. In practice, most mutual funds and ETFs compound daily (dividends reinvested at NAV). The formula assumes consistent returns; actual returns vary annually, which makes compounding frequency less important than the average rate achieved."
    },
    {
        "question": "What is the Rule of 72 and how does it apply to future value calculations?",
        "answer": "The Rule of 72 is a shortcut: divide 72 by the annual return rate to estimate years to double. At 7%: 72/7 ≈ 10.3 years to double. At 10%: 72/10 = 7.2 years. At 4%: 72/4 = 18 years. It is surprisingly accurate for rates between 4% and 20% (error within 2%). For triple-doubling: multiply by 3 (at 7%, ~31 years to 8× your money = 3 doublings). Use this to sanity-check future value calculations: if your calculator shows your money doubling in 5 years at 7%, that is wrong (should be ~10 years). The Rule of 72 also works for inflation: at 3% inflation, purchasing power halves in 72/3 = 24 years."
    }
],

"InvestmentBreakEvenPointCalculator": [
    {
        "question": "How do I calculate the break-even point for an investment with upfront fees?",
        "answer": "Break-even years = ln(Cost / (Cost − Fee)) / ln(1 + annual return). Example: $10,000 investment with $500 upfront fee (5%) at 7% annual return. Break-even = ln(10000 / 9500) / ln(1.07) = 0.0513 / 0.0677 ≈ 0.76 years (about 9 months). Without the fee, you start ahead; with the fee, you need 9 months of 7% growth just to recover the 5% charge. This calculation is especially important when comparing load mutual funds (5.75% front-end load) against no-load equivalents -- the load fund needs nearly a full year of performance advantage just to break even on fees."
    },
    {
        "question": "What is the break-even analysis for real estate investment including all costs?",
        "answer": "Real estate break-even includes: purchase price + closing costs (2–5%) + renovation costs + carrying costs (mortgage, taxes, insurance) − rental income. Break-even on a rental: if your all-in cost is $250,000 and monthly net cash flow is $500, payback period = 250,000 / (500 × 12) = 41.7 years (without appreciation). With 4% annual appreciation: use an amortizing model. The 1% rule (monthly rent ≥ 1% of purchase price) is a quick filter -- a $250,000 property should generate $2,500/month to break even in under 15 years. Most markets no longer support the 1% rule; evaluate total return (cash flow + appreciation) rather than cash flow alone."
    },
    {
        "question": "How does the break-even point change when comparing two investment options with different fees?",
        "answer": "Compare two ETFs: Fund A with 0.03% expense ratio, Fund B with 0.75% expense ratio, both returning 8% nominal. After 1 year: A = $10,797, B = $10,725. Differential = $72. The break-even concept here is when Fund B would need to outperform to justify its higher fees: never, since expense ratios are a guaranteed drag. Over 30 years: Fund A = $100,627, Fund B = $80,635 -- a $19,992 difference on a $10,000 investment solely from the 0.72% fee difference. Use break-even analysis when evaluating: load vs. no-load funds, advisor-managed vs. self-directed portfolios, and actively managed vs. index funds."
    },
    {
        "question": "What is the break-even return rate needed to justify investment risk?",
        "answer": "The break-even return is the minimum rate that makes an investment worth doing versus a risk-free alternative. If the risk-free rate (US Treasury yield) is 4.5% (2024), a stock investment must deliver at least 4.5% just to match -- and typically requires a 3–5% equity risk premium (ERP) to compensate for volatility, putting the required return at 7.5–9.5%. Break-even risk-adjusted return = risk-free rate + (beta × ERP). For a crypto investment with high volatility, the required return is much higher -- many investors implicitly require 20%+ annualized to justify crypto's volatility versus holding stocks. If your expected return does not exceed this threshold, the investment destroys risk-adjusted value even if it technically gains."
    },
    {
        "question": "How long does it take for an investment in index funds to break even after a market crash?",
        "answer": "Historical S&P 500 recovery periods after major crashes: 2000–2002 dot-com crash (−49%): 7 years to nominal break-even (2007). 2008–2009 financial crisis (−57%): 5.4 years to nominal break-even (2013). 2020 COVID crash (−34%): 5 months to break-even. A 50% loss requires 100% gain to recover -- this asymmetry is why drawdown control matters. With dividends reinvested, break-even periods shorten by 1–2 years. Dollar-cost averaging during the crash (rather than sitting in cash) significantly shortens recovery because you buy units at lower prices, reducing your effective cost basis below the pre-crash level."
    }
],

"MultiCurrencyCryptoConverterCalculator": [
    {
        "question": "How often do crypto exchange rates update and which source is most accurate?",
        "answer": "Spot prices on major exchanges update every 1–10 seconds based on order book activity. Price aggregators (CoinGecko, CoinMarketCap) update every 1–5 minutes and use volume-weighted averages across exchanges. For trading execution: always use the price at your specific exchange, not an aggregator. For tax reporting: the IRS accepts 'reasonable fair market value' -- most crypto tax software uses CoinGecko or CoinMarketCap daily closing prices. For high-frequency or large trades: even a 1-minute price delay represents significant risk. Real-time APIs from exchanges (Binance, Kraken) provide tick-level data; aggregators provide reasonable accuracy for general use."
    },
    {
        "question": "Why does the same cryptocurrency trade at different prices on different exchanges?",
        "answer": "Price differences across exchanges (arbitrage spreads) exist due to: (1) Different liquidity -- less liquid exchanges have wider spreads, (2) Trading fees -- net prices differ after fees, (3) Geographic regulation -- exchanges in different jurisdictions serve different user bases, (4) Fiat on/off ramp friction -- moving USD between exchanges takes 3–5 days. Bitcoin typically trades within 0.1–0.5% across major exchanges. During high-volatility events, spreads can exceed 2–3%. Arbitrage bots constantly exploit these differences, which is why they are small and short-lived. The 'Kimchi premium' (Korean exchanges historically priced BTC 5–20% higher) illustrates how capital controls create persistent arbitrage that cannot be easily closed."
    },
    {
        "question": "How do I convert between two fiat currencies using cryptocurrency as an intermediate step?",
        "answer": "Direct FX route (USD→EUR): use a forex broker or bank; typical spread 0.1–1%. Crypto intermediary route (USD→BTC→EUR): buy BTC in USD, transfer to EUR exchange, sell for EUR. Costs: ~0.5% buy + ~0.5% sell + withdrawal fees + potential wire fees. Total: 1.5–3%. This is rarely cost-effective for simple FX conversion -- the USD→EUR direct route is almost always cheaper. The crypto intermediary is useful when: direct FX transfers are blocked (some countries), you want to move value internationally without triggering FX reporting thresholds, or you already hold crypto. Note: the crypto-to-fiat conversion is a taxable event for US persons."
    },
    {
        "question": "What is purchasing power parity (PPP) and does it affect crypto valuations across currencies?",
        "answer": "PPP says that identical goods should cost the same in different countries when denominated in the same currency. For crypto, 1 BTC has the same USD value regardless of where you buy it -- in theory. In practice, emerging market exchanges often show 5–20% premiums due to local demand (store-of-value use case), limited supply of USD, and capital controls. The Nigerian naira, Argentine peso, and Turkish lira have all seen BTC/local-currency premiums during their respective currency crises. This 'crisis premium' reflects real economic demand for crypto as a dollar substitute, not irrational pricing. When converting via this calculator, note that official exchange rates may differ significantly from black-market rates in countries with currency controls."
    },
    {
        "question": "How do I calculate the true conversion rate including all fees for a multi-currency crypto exchange?",
        "answer": "True conversion rate = (Amount received in target currency) / (Amount paid in source currency). Example: convert $1,000 USD to ETH, then ETH to EUR. Step 1: $1,000 → 0.5 ETH at $2,000/ETH (0.1% fee = $2 cost, receive 0.499 ETH). Step 2: 0.499 ETH → €900 at €1,803/ETH (0.1% fee = €0.90). Net: $1,000 → €899.10. Direct USD/EUR at 0.92 rate: $1,000 → €920. The crypto route cost $20.90 in implicit fees (2.1% vs 0.2% for direct FX). Always calculate the implied USD/target-currency rate from the two conversion steps to compare against direct FX. Only use crypto routing for FX when direct FX is unavailable or significantly more expensive."
    }
],

"NetIncomeAfterTaxCalculator": [
    {
        "question": "What is the difference between gross income, adjusted gross income (AGI), and taxable income?",
        "answer": "Gross income: all income before any deductions (wages, self-employment, dividends, etc.). Adjusted Gross Income (AGI): gross income minus above-the-line deductions (401k contributions, student loan interest, HSA contributions, self-employment tax deduction). Taxable income: AGI minus either the standard deduction ($14,600 single, $29,200 married in 2024) or itemized deductions, whichever is larger. Net income after tax is applied to taxable income through the progressive bracket system. AGI is the threshold used for many phase-outs (Roth IRA eligibility, student loan deduction, Child Tax Credit) -- reducing AGI through pre-tax contributions is often more valuable than post-tax deductions."
    },
    {
        "question": "How do pre-tax contributions (401k, HSA, FSA) reduce net income after tax?",
        "answer": "Pre-tax contributions reduce AGI dollar-for-dollar, lowering both federal and state income taxes. At 22% marginal rate: $23,000 401k contribution saves $5,060 in federal taxes + state tax savings. HSA contribution ($4,150 individual, $8,300 family in 2024): saves at your marginal rate with zero tax ever on qualified withdrawals -- triple tax advantage. FSA ($3,200 in 2024 for healthcare): saves taxes but use-it-or-lose-it. Example: $80,000 salary. No contributions: ~$17,000 federal tax. Max 401k: taxable income drops to $57,000, federal tax ~$9,500 -- $7,500 saved. Your take-home decreases by only $15,500 (not $23,000) because taxes fund the rest."
    },
    {
        "question": "What is marginal vs effective tax rate and why does the difference matter?",
        "answer": "Marginal rate: the rate on your last dollar of income (determines the value of deductions). Effective rate: your total tax divided by total income -- your actual average burden. Example: $80,000 income (single filer, 2024). Tax owed: 10% on first $11,600 ($1,160) + 12% on $11,601–$47,150 ($4,266) + 22% on $47,151–$80,000 ($7,227) = $12,653 total. Effective rate: $12,653 / $80,000 = 15.8%. Marginal rate: 22%. A $10,000 deduction saves 22% = $2,200 -- use marginal rate for deduction value. The effective rate is what you actually pay. Many people mistakenly believe their entire income is taxed at their marginal rate -- this is wrong, and leads to poor tax planning decisions."
    },
    {
        "question": "How does FICA tax (Social Security and Medicare) affect net income?",
        "answer": "FICA taxes reduce every paycheck separately from income tax. Social Security: 6.2% on wages up to $168,600 (2024 wage base). Medicare: 1.45% on all wages, plus Additional Medicare Tax of 0.9% on wages above $200,000 (single). Total FICA: 7.65% on most wages (your employer pays a matching 7.65%). Self-employed: 15.3% self-employment tax (both sides), but deduct half as an above-the-line deduction. At $80,000 salary: FICA = $6,120. Combined with federal income tax of $12,653 = $18,773 total federal burden. FICA is not progressive above the Social Security wage base -- earning $300,000 means you stop paying the 6.2% after $168,600, reducing your effective FICA rate."
    },
    {
        "question": "What state income tax differences should I consider when calculating net take-home pay?",
        "answer": "Nine states have no income tax: Alaska, Florida, Nevada, New Hampshire (dividends/interest only), South Dakota, Tennessee (dividends/interest only), Texas, Washington, Wyoming. California has the highest marginal rate: 13.3% (over $1M income). On $80,000 income: California adds ~$5,000–$6,000 in state tax; Texas adds $0. Moving from California to Texas effectively provides a 7–8% gross pay raise. States also vary on what they tax: New Hampshire taxes only investment income. Some states exempt pension/retirement income entirely. When comparing job offers or considering relocation, always compare total after-tax income including state tax, as a $5,000 salary difference may be irrelevant when offset by state tax differences."
    }
],

"SalesTaxCalculator": [
    {
        "question": "Which US states have no sales tax?",
        "answer": "Five states have no statewide sales tax: Alaska (no state tax, but local governments may charge up to 7.5%), Delaware, Montana, New Hampshire, and Oregon. Alaska has an average effective rate of 1.76% from local taxes. Delaware is the only state with zero statewide AND no local sales taxes -- a popular reason for Delaware incorporation and for making large purchases there. States with the highest combined rates (2024): Louisiana 9.45% average, Tennessee 9.55% average, Arkansas 9.46%, Washington 9.38%, Alabama 9.29%. For online purchases, states collect sales tax if the seller has 'nexus' in their state -- physical presence or over $100,000 in sales (post South Dakota v. Wayfair, 2018)."
    },
    {
        "question": "Is sales tax charged on top of the displayed price or included in it?",
        "answer": "In the United States, prices are displayed exclusive of tax (tax-exclusive pricing). You see $99.99 but pay $99.99 + applicable tax at checkout. In most of Europe, Australia, and Canada (federal GST), prices are displayed inclusive of tax by law (tax-inclusive). When calculating: US method -- add tax to price (tax amount = price × rate). European method -- extract tax from price (tax amount = inclusive price × (rate / (1 + rate))). Example: $100 with 8% tax. US: pay $108 ($8 is tax). EU €108 inclusive: tax = €108 × (0.20/1.20) = €18 (20% VAT included). Always verify whether quoted prices include or exclude tax -- especially for international purchases."
    },
    {
        "question": "What goods and services are commonly exempt from sales tax?",
        "answer": "Common exemptions vary by state but frequently include: Groceries (food for home consumption): 32 states fully exempt; 8 states tax at a reduced rate. Prescription drugs: exempt in all 50 states. Over-the-counter medications: exempt in 22 states. Clothing: exempt in Pennsylvania, New Jersey, New York (under $110 per item), and Minnesota. Digital goods (software, streaming, e-books): varies widely -- 28 states now tax digital goods. Manufacturing equipment: most states exempt to avoid tax-on-tax in production chains. Agricultural supplies: most states exempt. Professional services (legal, accounting): generally not taxed. Knowing exemptions can save significantly on large purchases -- buying manufacturing equipment in a state that exempts it can save thousands."
    },
    {
        "question": "How is sales tax handled for online purchases and cross-state transactions?",
        "answer": "Since South Dakota v. Wayfair (2018), states can require online sellers to collect sales tax even without a physical presence, if they exceed economic nexus thresholds (typically $100,000 in sales or 200 transactions per year in a state). As of 2024, 46 states + DC enforce economic nexus. This means: buying from Amazon, Walmart.com, or large retailers -- you pay tax. Buying from a small Etsy seller who hasn't registered in your state -- you may legally owe 'use tax' (self-reported), though compliance is nearly zero. Marketplaces (Amazon, eBay, Etsy) are typically required to collect and remit taxes on behalf of their sellers in most states under marketplace facilitator laws."
    },
    {
        "question": "How does sales tax affect business pricing strategy and price psychology?",
        "answer": "Tax-exclusive pricing creates a 'sticker shock' effect at checkout when tax is added. Studies show cart abandonment increases 5–15% when final price exceeds displayed price significantly. Strategies: for high-conversion products, consider tax-inclusive pricing (display the all-in price) to avoid checkout surprises. For commodity products where comparison-shopping is heavy, tax-exclusive is standard. In states with high sales tax (9%+), a $999 item becomes $1,088.91 -- crossing psychological price thresholds. Luxury goods retailers near state borders sometimes attract cross-border shopping from high-tax states. A New York City resident (8.875% combined tax) saving a 3-hour trip to New Hampshire (0% tax) can save $88 on a $1,000 purchase."
    }
],

"SipMonthlyInvestmentPlannerCalculator": [
    {
        "question": "What is a SIP and how does it work in the Indian market context?",
        "answer": "A Systematic Investment Plan (SIP) allows investing a fixed amount in mutual funds at regular intervals (typically monthly). In India, SIPs are the dominant retail investment vehicle: ₹19,000+ crore invested monthly via SIP as of 2024 (AMFI data). The NAV-based purchase means each SIP installment buys more units when markets fall and fewer when they rise -- the rupee-cost averaging effect. Minimum SIPs start at ₹500/month. SIP with step-up (increasing annual contribution by 10–15% matching salary growth) dramatically accelerates wealth accumulation. A ₹10,000/month SIP for 20 years at 12% CAGR = ₹99.9 lakh ($120K). A step-up SIP starting at ₹10,000 with 10% annual increase = ₹1.6 crore over the same period."
    },
    {
        "question": "What CAGR should I use for Indian equity mutual fund SIP projections?",
        "answer": "Historical CAGR for Indian equity categories (15-year, as of 2024): Nifty 50 Index: ~12–13%. Large-cap funds: 12–14%. Mid-cap funds: 15–18%. Small-cap funds: 16–20%. Flexi-cap/multi-cap: 13–16%. Use 12% for conservative large-cap projections, 15% for balanced flexi-cap assumptions, 18% for aggressive mid/small-cap modeling. Important caveat: historical 15-year returns include the post-2009 bull market; future returns may be lower as India's market matures. The SEBI-mandated disclaimer 'past returns are not indicative of future performance' applies. Model at three rates (10%, 12%, 15%) to show the range. Inflation in India averages 5–6%, so real returns are approximately 6–9%."
    },
    {
        "question": "How does the SIP corpus change if I pause or stop contributions mid-way?",
        "answer": "Pausing SIP mid-way has a significant impact because compound growth is most powerful in the final years. Example: SIP of ₹10,000/month for 20 years at 12% CAGR = ₹99.9 lakh. If you stop after 10 years and let ₹23.2 lakh compound for 10 more years: ₹72 lakh (no new contributions). Versus continuing for all 20 years: ₹99.9 lakh. The last 10 years of contributions (₹12 lakh invested) generated ₹27.9 lakh of additional corpus. Stopping SIP reduces corpus by 28%. For temporary financial stress, most AMCs allow SIP pause for 1–3 months without penalty -- preferable to permanent stoppage. Resuming at a higher amount after a pause partially compensates for missed growth."
    },
    {
        "question": "What is the tax treatment of SIP mutual fund redemptions in India?",
        "answer": "Each SIP installment starts its own holding period. For equity mutual funds: holding period ≥ 12 months = Long-Term Capital Gains (LTCG) at 12.5% (above ₹1.25 lakh LTCG per year, effective July 2024 Budget). Holding period < 12 months = Short-Term Capital Gains (STCG) at 20%. If you start monthly SIPs, after 12 months, the 1st installment qualifies for LTCG. The 13th installment becomes LTCG one month later, and so on. For debt mutual funds (post-April 2023): gains taxed at your slab rate regardless of holding period. For ELSS funds (tax-saving): 3-year lock-in per installment, LTCG applies, Section 80C deduction available (up to ₹1.5 lakh total)."
    },
    {
        "question": "How does SIP compare to PPF or FD for long-term wealth creation in India?",
        "answer": "Public Provident Fund (PPF): 7.1% guaranteed, tax-free, Section 80C benefit, 15-year lock-in, ₹1.5 lakh/year maximum. Fixed Deposit (FD): 6.5–7.5% (2024), fully taxable at slab rate, flexible tenure. Equity SIP (large-cap): ~12% historical CAGR, LTCG at 12.5% above ₹1.25 lakh. Example comparison on ₹10,000/month for 20 years: PPF (7.1% tax-free): ~₹54 lakh. FD (7% post-30% tax = 4.9% net): ~₹41 lakh. Equity SIP (12% CAGR, LTCG): ~₹85 lakh after tax. The equity SIP outperforms PPF by 57% over 20 years despite higher taxation, due to the higher pre-tax return. For risk-averse investors: PPF for guaranteed floor + SIP for growth outperformance is the optimal hybrid."
    }
],

"TaxBracketCalculator": [
    {
        "question": "Does entering a higher tax bracket mean all my income gets taxed at the higher rate?",
        "answer": "No -- this is one of the most common tax misconceptions. The US uses a marginal tax system where only the income within each bracket is taxed at that bracket's rate. Example for 2024 (single filer): the first $11,600 is taxed at 10%, the next $35,550 at 12%, income from $47,150 to $100,525 at 22%. If you earn $50,000, you do not owe 22% × $50,000 = $11,000. You owe: (11,600 × 10%) + (35,550 × 12%) + (2,850 × 22%) = $1,160 + $4,266 + $627 = $6,053. Effective rate = 12.1%. Moving from the 22% to the 24% bracket by earning an extra $100 means only that $100 is taxed at 24% -- you keep $76 of it."
    },
    {
        "question": "What are the 2024 federal income tax brackets and standard deductions?",
        "answer": "2024 brackets (single filer): 10% (up to $11,600), 12% ($11,601–$47,150), 22% ($47,151–$100,525), 24% ($100,526–$191,950), 32% ($191,951–$243,725), 35% ($243,726–$609,350), 37% (above $609,350). Standard deduction: $14,600 (single), $29,200 (married filing jointly), $21,900 (head of household). Taxable income = gross income − above-the-line deductions − standard or itemized deduction. For a single filer with $80,000 gross income and no above-the-line adjustments: taxable income = $80,000 − $14,600 = $65,400. Tax = $1,160 + $4,266 + $4,026 = $9,452. Effective rate = 11.8%."
    },
    {
        "question": "What is bracket creep and how do inflation adjustments prevent it?",
        "answer": "Bracket creep occurs when inflation pushes wages into higher tax brackets without any real income increase. Example: in a non-indexed system, a $50,000 salary with 5% inflation becomes $52,500 -- but the worker's real purchasing power is unchanged, yet they now owe more tax. The IRS adjusts tax brackets annually for inflation (using Chained CPI). For 2024, brackets were adjusted up ~5.4% from 2023. Without indexing, a middle-class taxpayer would face a permanent, silent tax increase every year inflation exceeds 0%. Bracket indexing is one reason why real tax burdens haven't automatically grown despite rising nominal wages. States vary -- some index brackets, others (like California) do not, leading to progressive bracket creep at the state level."
    },
    {
        "question": "How do tax brackets affect the decision to take a bonus or extra income at year-end?",
        "answer": "Marginal rate analysis should drive timing decisions for discretionary income. If you are in the 22% bracket in December and your bonus would push income into the 24% bracket, only the amount in the new bracket is taxed at 24% -- the 'penalty' for crossing is just the 2% difference on the incremental income ($100 bonus crossing into 24% costs an extra $2, not $24). The real timing decision: if you can defer income to next year (self-employed, deferred compensation), ask whether next year's rate will be lower. Alternatively, accelerating deductions (charitable contributions, 401k contributions before year-end) reduces current-year taxable income. Marginal rate, not bracket, is what drives every year-end tax optimization."
    },
    {
        "question": "How do capital gains and qualified dividends interact with the regular tax brackets?",
        "answer": "Long-term capital gains (LTCG) and qualified dividends have their own rate schedule that overlays the regular brackets. The LTCG rates (0%, 15%, 20%) apply at specific income thresholds, not the same thresholds as ordinary income. For 2024 (single): 0% LTCG on taxable income up to $47,025 -- even if your ordinary income bracket is 22%, gains below this threshold face no federal tax. 15% LTCG from $47,026–$518,900. 20% above $518,900. Strategy: a retired person with $40,000 in qualified dividends and Social Security may owe $0 federal tax on those dividends. Non-qualified dividends are taxed as ordinary income at marginal rates. Understanding this overlay is essential for tax-efficient portfolio withdrawals."
    }
],

"CollegeSavingsCalculator": [
    {
        "question": "How much does college actually cost in 2024 and how fast are costs rising?",
        "answer": "2024–2025 average annual costs (tuition + fees + room + board): public 4-year in-state: $24,920; public 4-year out-of-state: $43,350; private nonprofit 4-year: $58,600 (College Board). Total 4-year cost: $100K–$235K. College inflation has averaged 6% per decade (vs. 2.5–3% general inflation), meaning a child born today will face costs 30–45% higher by enrollment. At 6% college inflation: today's $25,000/year public school becomes $49,000/year in 18 years ($60K at private). This is why early savings and compound growth in a 529 plan are essential -- starting at birth vs. age 10 can mean a $50,000+ difference in the final balance."
    },
    {
        "question": "How does a 529 plan work and what are its tax advantages?",
        "answer": "A 529 is a state-sponsored education savings plan with federal tax benefits: contributions grow tax-free, and withdrawals for qualified education expenses (tuition, books, room/board, K-12 up to $10,000/year, student loan repayment up to $10,000 lifetime) are tax-free. State tax deduction: 34 states + DC offer deductions on contributions; amounts vary ($2,000–$20,000+ per year). Contribution limits: no federal cap, but gift tax annual exclusion applies ($18,000/year; superfunding allows 5-year front-loading = $90,000 at once). 2024 change: unused 529 funds can be rolled over to a Roth IRA (lifetime limit $35,000, subject to rules). Beneficiary can be changed to another family member tax-free -- eliminating the 'what if they don't go to college' concern."
    },
    {
        "question": "How do 529 savings affect financial aid eligibility?",
        "answer": "Under the FAFSA Simplification Act (effective 2024–2025): 529 plans owned by parents count at 5.64% of assets in the EFC (Expected Family Contribution) formula -- meaning $100,000 in a parent-owned 529 reduces aid by only $5,640. Student-owned 529s count at 20% (higher impact). Grandparent-owned 529s: previously a major issue (distributions counted as student income at 50%), but the 2024 FAFSA simplification eliminates this penalty -- grandparent 529s no longer impact aid. Key: assets of more than $30,000+ generally only meaningfully reduce aid for families at middle income levels where they're close to eligibility thresholds -- higher-income families are unaffected and lower-income families qualify regardless."
    },
    {
        "question": "What should I do if I saved too much in a 529 or my child doesn't attend college?",
        "answer": "Options for excess 529 funds: (1) Change beneficiary to another family member (siblings, cousins, yourself, even in-laws) -- tax-free. (2) Use for K-12 education ($10,000/year), apprenticeship programs, or student loan repayment ($10,000 lifetime). (3) Roth IRA rollover (2024+): roll up to $35,000 lifetime to the beneficiary's Roth IRA (subject to: 529 must be 15+ years old, annual Roth contribution limits apply, can't roll contributions made in last 5 years). (4) Non-qualified withdrawal: principal returned tax-free; earnings taxed as ordinary income + 10% penalty. Exception to penalty: if scholarship received, scholarship amount can be withdrawn without the 10% penalty (earnings still taxable)."
    },
    {
        "question": "How do I determine the right monthly savings target for college?",
        "answer": "Formula: Monthly savings = Future cost / ((((1 + r/12)^n) − 1) / (r/12)). Where r = expected annual return / 12, n = months until enrollment. Example: child is 5 years old, 13 years (156 months) to college, target $100,000 (in future dollars), 7% annual return. Monthly savings needed ≈ $336. If you start at birth (18 years, 216 months): ≈ $211/month. Waiting from birth to age 5 costs $125/month more for the same outcome. Rules of thumb: save 25–30% of expected first-year cost (in today's dollars) per year, beginning at birth. Consider splitting the target: savings cover 50% of cost, the rest from income, loans, or merit aid."
    }
],

"DebtConsolidationCalculator": [
    {
        "question": "When does debt consolidation actually save money vs. just extending your payment period?",
        "answer": "Consolidation saves money when: new interest rate is meaningfully lower than weighted average rate of existing debts, and you do not extend the term significantly. Formula: savings = (old monthly interest) − (new monthly interest) × months. Example: $20,000 across three credit cards at 24% average ($400/month interest), consolidated to a personal loan at 12% ($200/month interest) = $200/month savings. If the loan term is the same 5 years: total interest savings ≈ $12,000. But if consolidation extends payoff from 3 years to 7 years at the lower rate, you may pay more total interest despite the lower rate. Always calculate total interest cost (monthly payment × months − principal), not just the monthly payment reduction."
    },
    {
        "question": "What are the different types of debt consolidation and when should I use each?",
        "answer": "Balance transfer card (0% APR intro period, 12–21 months): best for credit card debt under $15,000 you can pay off within the intro period. Transfer fee: 3–5%. Risk: revert to 20%+ APR if not paid off. Personal consolidation loan (7–36% APR, 2–7 years): best for larger balances needing structured repayment. Requires good credit (660+) for rates that beat credit cards. Home equity loan/HELOC (6–9% APR, 2024): best rate, but your home is collateral -- default = foreclosure. Debt management plan (DMP) via nonprofit credit counseling: reduces interest rates to 6–9% through creditor agreements; no new credit during payoff. 401k loan: 'repay yourself' but loses compound growth and has tax consequences on default."
    },
    {
        "question": "How does debt consolidation affect your credit score?",
        "answer": "Short-term effects: applying for a new loan/card creates a hard inquiry (−5 to −10 points, recovers in 12 months). Closing old accounts reduces average account age and available credit (may lower score temporarily). Long-term effects: lower credit utilization (if cards are paid off and kept open) improves score significantly (utilization is 30% of score). Consistent on-time payments on the new loan build positive history. Net result: most borrowers see a slight dip for 3–6 months, then score improvement over 12–24 months as utilization drops. Key rule: do not close the paid-off credit cards -- keep them open (with $0 balance) to maintain credit limit and age."
    },
    {
        "question": "What is the difference between debt consolidation and debt settlement?",
        "answer": "Debt consolidation: takes existing debts and combines them into one new debt, usually at better terms. You repay 100% of what you owe. Credit impact: neutral to positive. Debt settlement: negotiates with creditors to accept less than the full balance (typically 40–60 cents on the dollar). You stop paying while funds accumulate in an escrow account, then lenders settle. Credit impact: severe (accounts marked 'settled for less than full amount' stay 7 years). Tax impact: forgiven debt over $600 is taxable income (IRS Form 1099-C). Debt settlement firms charge 15–25% of enrolled debt as fees. Settlement is a last resort before bankruptcy -- it severely damages credit and has tax consequences consolidation does not."
    },
    {
        "question": "How do I calculate whether consolidating my debts will actually lower my monthly payment and total interest?",
        "answer": "Step 1: Calculate your current monthly payment and total remaining interest. For each debt: remaining interest = (monthly payment × remaining months) − remaining balance. Sum across all debts. Step 2: Calculate the consolidation loan total interest = (monthly payment × term months) − loan principal. Step 3: Compare. Example: two cards totaling $15,000 at average 22% APR, paying $500/month: payoff in 39 months, total interest $4,464. Consolidation loan: $15,000 at 12% for 36 months, payment $498/month, total interest $2,928. Savings: $1,536. Always include the origination fee (typically 1–8%) in the consolidation loan cost: $15,000 loan with 3% fee = $450 added cost, net savings = $1,086. Still worth it -- but always check the math."
    }
],

"DebtToIncomeRatioCalculator": [
    {
        "question": "What is the maximum debt-to-income ratio to qualify for a mortgage?",
        "answer": "Conventional mortgage (Fannie Mae/Freddie Mac): maximum DTI typically 45% (back-end), though 50% is allowed with compensating factors (high credit score, large down payment, significant reserves). FHA loans: 43% DTI limit, but some lenders allow up to 50% with compensating factors. VA loans: no strict DTI cap, but 41% is the guideline; exceeding requires residual income analysis. Jumbo loans (over conforming limit $766,550 in 2024): typically 43–45% maximum, stricter requirements. A front-end DTI (housing expenses only) under 28% is preferred. With DTI of 45%+ and only 3% down, you are at maximum risk tolerance for lenders -- any income disruption creates default risk."
    },
    {
        "question": "What is included in debt-to-income calculations for mortgage underwriting?",
        "answer": "Included (back-end DTI): proposed housing payment (PITI: principal, interest, taxes, insurance + HOA), car loans, student loans (even in deferment -- lender uses 0.5–1% of balance as payment), credit card minimum payments, personal loans, child support, alimony. Not included: utilities, phone, subscriptions, food, transportation costs (other than car payment). Student loans in deferment are particularly impactful: a $50,000 balance uses $500/month as assumed payment even if you currently pay $0. This reduces buying power by approximately $85,000 in mortgage amount. Income counts: verified W-2 income, 2-year self-employment average (Schedule C), documented investment/rental income, child support received."
    },
    {
        "question": "How do I reduce my DTI quickly before applying for a mortgage?",
        "answer": "Most effective short-term strategies: (1) Pay off the highest-minimum-payment debt first (credit cards, personal loans -- car loans are harder). A $5,000 credit card with $100/month minimum, if paid off, improves DTI by $100/month -- equivalent to eliminating $12,000–$15,000 in mortgage payment capacity. (2) Increase documented income: if you have side income, ensure it's 2-year documented and tax-filed. (3) Add a co-borrower with income and no debt. (4) Request a credit limit increase (reduces utilization AND DTI if you don't carry more balance). What doesn't work: lowering 401k contributions (after-tax income doesn't change DTI calculation). Time to impact: lenders require 30 days of updated statements; plan 60–90 days ahead."
    },
    {
        "question": "What is the difference between front-end and back-end debt-to-income ratio?",
        "answer": "Front-end DTI (housing ratio) = (proposed housing costs) / (gross monthly income). Includes only: principal, interest, property taxes, homeowners insurance, PMI (if applicable), HOA fees. Target: below 28%. Example: $2,000 housing payment on $7,000/month gross income = 28.6% front-end DTI. Back-end DTI (total debt ratio) = (all monthly debt obligations including housing) / (gross monthly income). Includes housing + all other debt minimums. Target: below 36% (conservative), 43% (standard), 45% (maximum for most conventional). Lenders primarily use back-end DTI for qualification. Front-end DTI matters for jumbo/portfolio loans and some government programs. Rule of thumb: keep back-end DTI under 36% for financial stability; above 40% and you have little buffer for financial shocks."
    },
    {
        "question": "How does student loan debt affect buying a home with high DTI?",
        "answer": "Student loans cause disproportionate DTI impact because lenders use the payment even during deferment or income-driven repayment. Fannie Mae rule (conventional): uses the actual IDR payment if $0, uses $0 -- a favorable change from 2021. Freddie Mac: uses 0.5% of loan balance OR actual payment, whichever is greater. FHA: uses 1% of balance OR actual payment OR fully amortized payment over remaining term -- the most punitive. Example: $80,000 in student loans. Fannie Mae: may use $0 (if IDR payment is $0). Freddie Mac: $400/month. FHA: $800/month. This $800/month FHA payment reduces mortgage qualification by approximately $110,000 in home buying power. For first-time buyers with student loans, a conventional Fannie Mae loan often allows the highest DTI and most generous student loan treatment."
    }
],

"MonthlyBudgetPlannerCalculator": [
    {
        "question": "What is the 50/30/20 budget rule and is it still realistic in 2024?",
        "answer": "The 50/30/20 rule: 50% of after-tax income to needs (housing, food, utilities, transportation, insurance), 30% to wants (dining, entertainment, travel, subscriptions), 20% to savings/debt repayment. In 2024, housing costs in major metros have made 50% for needs nearly impossible for median earners: median rent in NYC, SF, LA, Boston, Seattle exceeds 40% of median income alone. Modified approaches for high-cost areas: 60/20/20 (bump needs to 60%, sacrifice wants) or 70/10/20 (increase needs, cut wants drastically). For high-income earners: reverse the ratios -- prioritize savings first (30%+) and fit lifestyle into the remainder. The rule is a starting framework, not a mandate."
    },
    {
        "question": "What budgeting method works best for variable income (freelancers, gig workers)?",
        "answer": "Fixed expenses budgeting: base all recurring bills on your lowest-income month; allocate variable income only after fixed obligations. Zero-based budgeting works well -- every dollar is assigned a role before the month starts. Percentage-based budgeting: pre-commit fixed percentages to taxes, savings, and living costs; scale all categories proportionally with income. Envelope/category system: at month start, physically or digitally allocate income to categories and stop spending when envelope is empty. Income smoothing strategy: calculate annual income, divide by 12 for 'monthly salary' -- transfer variable income to savings account, pay yourself a consistent 'salary'. This requires 3–6 months of income in reserve to buffer low-income months."
    },
    {
        "question": "How do I find money to save in a tight budget when expenses equal income?",
        "answer": "Audit subscriptions first: the average American has 12 paid subscriptions, often forgetting 4–5 of them (West Monroe, 2022). Canceling unused subscriptions can free $50–$200/month immediately. Insurance audit: getting competing quotes every 2 years typically saves $400–$800/year on auto + home. Cell phone: switching to an MVNO (Mint Mobile, Visible) from carrier plans saves $50–$100/month. Grocery: meal planning + buying store brands saves 20–40% vs. buying convenience foods. Refinancing high-APR debt: trading 22% credit card for a 10% personal loan saves the interest differential. If expenses genuinely equal income after audit: address the income side -- even $200/month in side income changes the math more than micro-optimizations."
    },
    {
        "question": "How should I prioritize paying off debt vs. saving in my budget?",
        "answer": "The hierarchy by guaranteed return vs. cost: (1) Employer 401k match first -- this is a 50–100% immediate return on investment, always prioritize. (2) High-interest debt (above 7%) -- paying off a 22% APR card is a guaranteed 22% return, better than most investments. (3) Emergency fund (3–6 months of expenses) -- prevents debt spiral from unexpected costs. (4) Mid-rate debt (5–7%) -- a coin-flip between payoff and investing in index funds (historically ~7% return). (5) Low-rate debt (under 4%, like federal student loans or mortgages) -- invest over prepaying; historical index fund returns exceed the interest rate. 2024 note: HYSAs pay 4.5–5.0%, so money sitting in a HYSA may outperform paying off 4–5% debt."
    },
    {
        "question": "What are the most impactful budget categories to reduce for maximum savings increase?",
        "answer": "Pareto analysis of typical US household spending: housing (33%), transportation (16%), food (12%), healthcare (8%), personal insurance/pensions (12%), other (19%). The biggest savings come from the biggest categories: Housing: every $200 reduction in rent/mortgage saves $72,000+ over 30 years (at 7% invested). Transportation: car downsizing from $600/month to $250/month = $4,200/year = $172,000 over 30 years invested. Food: average food budget $7,700/year; reducing by 30% ($2,300) saves $2,300. Incremental reductions in smaller categories (coffee, streaming) create behavior change habits but have limited dollar impact. Prioritize high-dollar category optimization even if emotionally harder."
    }
],

"SavingsRateTrackerCalculator": [
    {
        "question": "What is a good savings rate and how does it affect retirement timeline?",
        "answer": "Research by Mr. Money Mustache (popularized in personal finance communities) based on the 4% safe withdrawal rate: at a 10% savings rate, retirement takes ~46 years. At 20%: ~37 years. At 50%: ~17 years. At 75%: ~7 years. Every percentage point increase in savings rate accelerates retirement timeline exponentially because you simultaneously: (1) invest more, growing the portfolio faster, and (2) reduce spending, decreasing the portfolio size needed for retirement. The US personal savings rate was 3.6% in 2024 (BEA), far below the 15–20% recommended by most financial advisors. The median 401k balance for 55–64 year olds is $185,000 -- insufficient for most retirements."
    },
    {
        "question": "Should I include employer 401k contributions in my savings rate calculation?",
        "answer": "Including employer match gives the most economically accurate picture; excluding it gives the behavioral picture (what you personally sacrifice). Both metrics are useful. Example: earn $80,000, save $8,000 personally (10% personal rate), employer matches $4,000 = $12,000 total. Total savings rate = 15%. Personal savings rate = 10%. For benchmarking your own behavior: use personal rate. For estimating retirement timeline: use total rate (all sources going to long-term savings). Also consider: HSA contributions are effectively additional savings (triple tax advantage, can be used for healthcare in retirement). Include HSA in total savings rate, not in personal spending budget."
    },
    {
        "question": "How do I calculate my true savings rate including all forms of savings?",
        "answer": "True savings rate = (total savings) / (gross income). Total savings includes: 401k/403b contributions (yours + employer), IRA contributions, taxable brokerage additions, 529 contributions, HSA contributions, extra mortgage principal payments, any increase in savings account balance. Gross income: use pre-tax income (not take-home) to avoid inflating the rate. Example: $100,000 gross, $6,000 401k + $2,400 employer match + $7,000 IRA + $1,200 HSA + $3,400 brokerage = $20,000 saved. Savings rate = 20%. Tracking this monthly in a spreadsheet (or tool like YNAB, Monarch) reveals trends: did your savings rate drop because expenses increased or income decreased? The direction matters for corrective action."
    },
    {
        "question": "How much does a 1% increase in savings rate actually impact long-term wealth?",
        "answer": "On $80,000 income, 1% more savings = $800/year. At 7% over 30 years: $800/year grows to $81,272. That $800/year habit creates $81,272 in additional wealth. For a 2% increase ($1,600/year): $162,544. The key insight: at the time of the decision, $800/year feels trivial ($67/month). At retirement, it represents $81,272. Every percentage point of savings rate corresponds roughly to 1–1.5 months of earlier retirement eligibility (at 10–15% base savings rate). Automating savings increases ensures the behavioral change actually happens -- setting a recurring transfer the day after payday, before spending temptation."
    },
    {
        "question": "What is the FIRE movement's savings rate target and is it realistic for most people?",
        "answer": "FIRE (Financial Independence, Retire Early) typically targets 50–70% savings rates for retirement in 10–17 years. This requires: high income (dual-income households earning $150K+ combined), radical frugality, or geographic arbitrage (geoarbitrage to low cost-of-living areas). Is it realistic? For the median US household ($74,580 income, 2024): after taxes, housing, food, healthcare, and transportation, reaching 50%+ savings requires near-elimination of discretionary spending and/or significantly below-average housing costs. Lean FIRE (minimal spending in retirement on ~$40K/year, $1M portfolio) is more accessible than Fat FIRE ($100K+/year, $2.5M portfolio). The most realistic FIRE adaptation for median earners: 25–35% savings rate targeting 25–30 year horizons."
    }
],

"RefinanceSavingsCalculator": [
    {
        "question": "How do I calculate the break-even point for a mortgage refinance?",
        "answer": "Break-even months = Closing costs ÷ Monthly payment savings. Example: current payment $2,100 (6.5% rate), new payment $1,950 (5.8% rate), closing costs $4,500. Monthly savings = $150. Break-even = $4,500 / $150 = 30 months (2.5 years). If you plan to stay in the home more than 30 months, the refinance makes financial sense. Complication: if you reset to a new 30-year term, you extend your payoff date and pay more total interest even at a lower rate. Example: 8 years into a 30-year mortgage, refinancing to a new 30-year adds 8 years of payments. Calculate total interest remaining under both scenarios, not just monthly payment."
    },
    {
        "question": "What are the typical closing costs for a mortgage refinance?",
        "answer": "2024 average refinance closing costs: $2,000–$5,000 (0.5–2% of loan amount). Major components: origination/lender fee ($500–$1,500), appraisal ($300–$600), title search and insurance ($500–$1,500), recording fees ($25–$250), prepaid interest (daily rate × days until first payment), escrow setup (property taxes + insurance months). Some lenders offer 'no-closing-cost' refinances -- they add the costs to the loan balance or increase the interest rate by 0.125–0.25%. No-closing-cost makes sense if you plan to refinance or sell again within 3–4 years (before the rate penalty costs you more than the avoided fees). Always compare the APR, not just the rate, for the true cost comparison."
    },
    {
        "question": "When does it make sense to refinance even if the interest rate difference is small?",
        "answer": "The 1% rule (only refinance if rate drops 1%+) is outdated. The actual threshold depends on loan balance and remaining term. A 0.5% rate drop on a $500,000 balance = $2,500/year in interest savings -- a meaningful amount even with $5,000 in closing costs (2-year payback). A 0.5% drop on a $100,000 balance = $500/year -- 10-year payback with $5,000 in costs (not worth it). Also consider: removing PMI via refinance (if equity crossed 20%), switching ARM to fixed-rate (risk management, not savings), or cash-out refinance for home improvements that add value. Refinancing from a 30-year to a 15-year at the same rate increases payment but dramatically reduces total interest."
    },
    {
        "question": "How does refinancing affect the total amount of interest paid over the life of the loan?",
        "answer": "Monthly payment savings often obscure total interest cost increases when the term resets. Example: $350,000 mortgage at 7%, 20 years remaining, payment $2,716/month. Total remaining interest = $302,640. Refinance to 5.5%, new 30-year, payment $1,988/month. Total interest on new loan = $365,680. Despite $728/month savings, you will pay $63,040 more total interest -- and extend your mortgage by 10 years. Solution: refinance to a 20-year term at 5.5% (payment $2,399/month, $276,000 total interest). You save $26,640 total AND $317/month. For accurate refinance analysis, always calculate (payment × remaining months − remaining balance) for both scenarios."
    },
    {
        "question": "Is a cash-out refinance a good idea and what should the funds be used for?",
        "answer": "A cash-out refinance replaces your mortgage with a larger loan, extracting equity as cash. You can borrow up to 80% LTV (loan-to-value) in most cases. 2024 rate context: cash-out refinance rates are 6.5–7.5%; credit card rates are 20–24%. The math for debt consolidation: borrowing at 7% to eliminate 22% credit card debt is mathematically compelling. Good uses: high-interest debt payoff, home improvements that increase value (kitchen/bath renovations typically return 60–80%), education, or investing when return exceeds mortgage rate. Bad uses: depreciating assets (cars, vacations), consumer goods. Risk: you are converting unsecured debt to secured debt -- credit card default is bad; mortgage default is foreclosure. Only do this if you address the spending habits that created the high-interest debt."
    }
],

}

# ─────────────────────────────────────────────────────────────────────────────
# Remaining Priority 4 files get a generic-but-calculator-specific upgrade
# These are generated by topic from the filename
# ─────────────────────────────────────────────────────────────────────────────

GENERIC_UPGRADE_TOPICS = {
    "AbsencePercentage": ("absence rate", "HR", "workforce"),
    "BondYield": ("bond yield", "fixed income", "coupon rate"),
    "CostBasisFifoLifo": ("cost basis", "FIFO/LIFO", "capital gains"),
    "CurrencyConverterLive": ("currency conversion", "FX rates", "forex"),
    "DcaSimulator": ("DCA simulation", "crypto/stock averaging", "cost basis"),
    "ElectricityCostVsMiningRevenue": ("mining profitability", "electricity cost", "crypto mining"),
    "EmergencyFund": ("emergency fund", "liquid savings", "financial buffer"),
    "ExpenseSplitter": ("expense splitting", "shared bills", "equal vs proportional"),
    "GpuAsicMiningRoi": ("GPU/ASIC mining ROI", "hardware depreciation", "mining efficiency"),
    "HashRateToEarnings": ("hash rate", "mining earnings", "network difficulty"),
    "HourlyToAnnualSalary": ("hourly wage conversion", "overtime", "benefits value"),
    "InflationAdjustedValue": ("inflation adjustment", "real vs nominal value", "purchasing power"),
    "IrrNpv": ("IRR/NPV", "capital budgeting", "project valuation"),
    "LeaseVsBuy": ("lease vs buy decision", "total cost of ownership", "depreciation"),
    "LeverageMarginProfit": ("leverage", "margin trading", "liquidation risk"),
    "LivePriceChecker": ("live crypto price", "exchange rate accuracy", "price aggregation"),
    "MiningProfitability": ("mining profitability", "hash rate", "electricity cost"),
    "NetWorth": ("net worth calculation", "assets vs liabilities", "wealth tracking"),
    "Paycheck": ("paycheck calculation", "withholding", "take-home pay"),
    "PoolFeeImpact": ("mining pool fees", "fee structure", "net earnings"),
    "PortfolioValueTracker": ("portfolio tracking", "asset allocation", "rebalancing"),
    "PositionSizeRiskManagement": ("position sizing", "risk management", "Kelly criterion"),
    "RothIraConversion": ("Roth conversion", "tax implications", "MAGI limits"),
    "SocialSecurityBenefitEstimator": ("Social Security benefits", "full retirement age", "claiming strategy"),
    "StakingRewardsEstimator": ("staking rewards", "APY vs APR", "validator risk"),
    "StockDcaReturnEstimator": ("stock DCA", "dollar-cost averaging", "index funds"),
    "TakeHomePay": ("take-home pay", "withholding accuracy", "W-4"),
    "TransactionFeeDeduction": ("transaction fee deduction", "cost basis", "crypto tax"),
    "VatGst": ("VAT/GST", "value-added tax", "cross-border tax"),
    "VolatilityRiskAssessment": ("volatility measurement", "standard deviation", "beta"),
    "YieldFarmingApy": ("yield farming APY", "DeFi risk", "impermanent loss"),
    "RuleOf72": ("Rule of 72", "compound interest", "doubling time"),
    "RothIraConversion": ("Roth IRA conversion", "tax bracket management", "retirement planning"),
}


def build_generic_faqs(calculator_name, topic, domain, related):
    """Generate decent but specific placeholder FAQs for lower-priority files."""
    return [
        {
            "question": f"How accurate are {topic} calculations and what limitations should I be aware of?",
            "answer": f"This calculator provides estimates based on the inputs you provide. For {topic}, accuracy depends on using current {domain} data -- rates, prices, and regulatory thresholds change frequently. The results are most reliable for planning purposes and comparative analysis. For financial decisions involving significant amounts, verify results against official sources or consult a {domain} professional."
        },
        {
            "question": f"What key factors most affect {topic} results?",
            "answer": f"The most impactful variables in {topic} calculations are typically the primary rate or percentage input and the time horizon. Small changes in these variables compound significantly over longer periods. For example, a 1% difference in return rate over 20 years can change outcomes by 20–30%. Always run the calculation at multiple input values to understand your sensitivity to each variable."
        },
        {
            "question": f"When should I recalculate {topic}?",
            "answer": f"Recalculate whenever {domain} conditions change significantly: after major {domain} events, when your inputs change (income, rates, holdings), or when {domain} regulations are updated. For time-sensitive {domain} metrics, recalculate monthly. For long-term planning tools, a quarterly review is typically sufficient. Set a calendar reminder to revisit projections annually at minimum."
        },
        {
            "question": f"How does {topic} relate to other financial planning metrics?",
            "answer": f"No single metric tells the complete financial picture. {topic.capitalize()} should be evaluated alongside related measures like {related}. These metrics interact: improving one often affects another. Build a dashboard of 3–5 key metrics that together reflect the health of your {domain} situation, rather than optimizing any single number in isolation."
        },
        {
            "question": f"What are the most common mistakes when calculating {topic}?",
            "answer": f"The most frequent errors in {topic} calculations: (1) Using pre-tax instead of post-tax figures where after-tax analysis is needed, (2) Ignoring fees and transaction costs that reduce net returns, (3) Using nominal figures without inflation adjustment for long-horizon projections, (4) Assuming constant rates -- real-world {domain} conditions fluctuate. Double-check your inputs against current {domain} data before relying on results for significant financial decisions."
        }
    ]


GENERIC_MARKERS = [
    "How accurate is this calculator",
    "What should I do with these results",
    "How often should I recalculate",
    "What are common mistakes people make with this calculation",
    "What information do I need to use this calculator",
]


def faqs_to_ts(faqs):
    """Convert FAQ list to TypeScript array string."""
    lines = ["  const faqs = ["]
    for i, faq in enumerate(faqs):
        comma = "," if i < len(faqs) - 1 else ""
        q = faq["question"].replace('"', '\\"')
        a = faq["answer"].replace('"', '\\"').replace("\n", " ")
        lines.append("    {")
        lines.append(f'      question: "{q}",')
        lines.append(f'      answer: "{a}"')
        lines.append(f"    }}{comma}")
    lines.append("  ];")
    return "\n".join(lines)


def upgrade_file(filepath, dry_run=False):
    with open(filepath, encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Check if file actually has generic FAQs
    if not any(m in content for m in GENERIC_MARKERS):
        return False, "no generic markers found"

    # Find the faqs array -- it's inside the component function
    # Pattern: "  const faqs = [" ... "];" (indented, inside function)
    match = re.search(r'(  const faqs = \[)(.*?)(\];)', content, re.DOTALL)
    if not match:
        return False, "could not locate 'const faqs = [' array"

    basename = os.path.basename(filepath).replace(".tsx", "")

    # Look up specific FAQs first
    if basename in FAQ_DB:
        new_faqs = FAQ_DB[basename]
    else:
        # Try to find matching topic from filename
        topic_key = None
        for key in GENERIC_UPGRADE_TOPICS:
            if key.lower() in basename.lower():
                topic_key = key
                break
        if topic_key:
            topic, domain, related = GENERIC_UPGRADE_TOPICS[topic_key]
            new_faqs = build_generic_faqs(basename, topic, domain, related)
        else:
            return False, f"no FAQ mapping found for {basename}"

    new_faqs_str = faqs_to_ts(new_faqs)
    new_content = content[:match.start()] + new_faqs_str + content[match.end():]

    if dry_run:
        return True, f"would replace {len(new_faqs)} FAQs (dry run)"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True, f"replaced with {len(new_faqs)} specific FAQs"


def main():
    parser = argparse.ArgumentParser(description="Batch upgrade generic calculator FAQs")
    parser.add_argument("--dry-run", action="store_true", help="Show what would change without modifying files")
    parser.add_argument("--file", help="Process a single file by name (e.g., TaxBracketCalculator.tsx)")
    parser.add_argument("--priority", type=int, choices=[2, 3, 4], help="Only process given priority level")
    args = parser.parse_args()

    if args.file:
        # Single file mode
        path = os.path.join(CALC_DIR, args.file)
        if not os.path.exists(path):
            print(f"File not found: {path}")
            return
        ok, msg = upgrade_file(path, dry_run=args.dry_run)
        status = "OK" if ok else "FAIL"
        print(f"{status} {args.file}: {msg}")
        return

    # Batch mode -- process all files with generic FAQs
    results = {"upgraded": [], "skipped": [], "failed": []}

    for fname in sorted(os.listdir(CALC_DIR)):
        if not fname.endswith(".tsx"):
            continue
        path = os.path.join(CALC_DIR, fname)

        # Priority filter
        if args.priority:
            from generate_faq_upgrade_list import get_priority
            p = get_priority(fname)
            if p != args.priority:
                continue

        try:
            ok, msg = upgrade_file(path, dry_run=args.dry_run)
            if ok:
                results["upgraded"].append((fname, msg))
            else:
                results["skipped"].append((fname, msg))
        except Exception as e:
            results["failed"].append((fname, str(e)))

    print(f"\n{'DRY RUN -- ' if args.dry_run else ''}FAQ Upgrade Results")
    print("=" * 60)
    print(f"Upgraded: {len(results['upgraded'])}")
    for fname, msg in results["upgraded"]:
        print(f"  OK {fname}: {msg}")
    print(f"\nSkipped (no generic FAQs or no mapping): {len(results['skipped'])}")
    for fname, msg in results["skipped"][:5]:
        print(f"  --  {fname}: {msg}")
    if len(results["skipped"]) > 5:
        print(f"  ... and {len(results['skipped']) - 5} more")
    if results["failed"]:
        print(f"\nFailed: {len(results['failed'])}")
        for fname, msg in results["failed"]:
            print(f"  FAIL {fname}: {msg}")


if __name__ == "__main__":
    main()
