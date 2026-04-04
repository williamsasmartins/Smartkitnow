"""
Thin Content Editorial Injector
Run: python scripts/add_thin_editorial.py [--dry-run] [--file FILENAME]

For each thin Math/Time calculator, injects a "use-cases" section with
200-280 words of unique prose between the formula and faq sections.
This adds visible, crawlable text that the audit script CAN count.

Injection point: between <section id="formula"> and <section id="faq">
"""

import os
import re
import argparse

CALC_DIR = "src/components/calculators"

# ─────────────────────────────────────────────────────────────────────────────
# EDITORIAL DATABASE  — keyed by filename (without .tsx)
# Each entry: dict with {section_id, heading, paragraphs: [str, ...]}
# Paragraphs are plain text; the script wraps them in <p> tags.
# Target: 200-280 words per entry (counted as visible text).
# ─────────────────────────────────────────────────────────────────────────────
EDITORIAL_DB = {

# ─── TIME ────────────────────────────────────────────────────────────────────
"WorldClockCalculator": {
    "heading": "Why World Clock Tools Matter for Modern Teams",
    "section_id": "use-cases",
    "inject_after": "features",   # special: append after features section
    "paragraphs": [
        "Remote and distributed work has made time zone awareness a daily requirement. When a team spans New York, London, and Singapore, every meeting request requires mental arithmetic: adding five hours here, subtracting eight there, and then remembering which cities are currently observing daylight saving time. A world clock removes this friction entirely, showing the correct local time in any city the moment you look.",
        "Business travelers, international traders, and customer support teams are the heaviest users. A financial analyst timing a trade execution needs exact market hours — the New York Stock Exchange opens at 9:30 AM EST, while the London Stock Exchange opens at 8:00 AM GMT. Knowing the live time difference prevents costly errors. Similarly, a support team handling tickets from three continents needs to know which regional office is currently staffed.",
        "UTC (Coordinated Universal Time) is the global reference standard. Every time zone is expressed as UTC+N or UTC-N. New York is UTC-5 (UTC-4 during EDT), London is UTC+0 (UTC+1 during BST), Tokyo is UTC+9 year-round. When scheduling across zones, convert all times to UTC first, then back to each local time — this eliminates daylight saving confusion because UTC never changes.",
        "Daylight saving time (DST) is the most common source of world clock errors. The United States and Europe transition on different dates: the US shifts in early March and November, while most of Europe transitions in late March and October. This creates a two-week window each spring and fall when the US-Europe time difference is off by one hour from its usual value. Always verify DST status rather than relying on a fixed offset.",
    ]
},

# ─── MATH ────────────────────────────────────────────────────────────────────
"LcmCalculator": {
    "heading": "Real-World Uses of the Least Common Multiple",
    "section_id": "use-cases",
    "paragraphs": [
        "The most familiar use of LCM is adding fractions with unlike denominators. To compute 1/4 + 1/6, you need the smallest number both 4 and 6 divide into — LCM(4,6) = 12. Convert both fractions to twelfths (3/12 + 2/12) and add directly: 5/12. Without LCM, fraction addition requires more steps and is prone to error. The same principle extends to rational expressions in algebra.",
        "Scheduling problems are the second major application. If a train departs every 15 minutes and a bus departs every 20 minutes, they next leave simultaneously after LCM(15, 20) = 60 minutes. This logic applies to factory machine cycles, supply chain restocking intervals, and software cron job alignment. Any time two periodic events must synchronize, the LCM gives the first future coincidence.",
        "In music theory, LCM determines rhythmic alignment. A polyrhythm of 3-against-4 repeats every LCM(3,4) = 12 beats. Composers use this to plan where independent rhythmic patterns resolve back to a shared downbeat. Digital signal processing applies the same principle when resampling audio: converting between 44.1 kHz and 48 kHz requires the LCM of the two sample rates to find the ideal interpolation window.",
    ]
},

"GcfGcdCalculator": {
    "heading": "Practical Applications of the Greatest Common Divisor",
    "section_id": "use-cases",
    "paragraphs": [
        "The GCD is the fundamental tool for simplifying fractions to lowest terms. To reduce 48/72, find GCD(48, 72) = 24, then divide both numerator and denominator: 2/3. This step is required in every arithmetic and algebra class, and the GCD calculator automates the Euclidean algorithm so you can verify your work or handle large numbers instantly.",
        "In practical terms, GCD solves equal-distribution problems. If you have 48 apples and 72 oranges and want to pack identical bags with no fruit left over, GCD(48, 72) = 24 means you can pack 24 bags with 2 apples and 3 oranges each. The same logic applies to cutting material into equal strips, dividing pixels evenly in graphic design, or allocating computing resources in equal blocks.",
        "Cryptography relies on GCD at its foundation. The RSA algorithm determines the public and private keys by requiring that GCD(e, phi(n)) = 1 — that e and phi(n) are coprime. Two numbers are coprime when their GCD equals 1, meaning they share no prime factors. Understanding coprimality lets you see why RSA key generation rejects certain values: if GCD is not 1, the mathematical inverse needed for decryption does not exist.",
        "The Euclidean algorithm makes GCD computation fast even for very large numbers. The algorithm repeatedly applies: GCD(a, b) = GCD(b, a mod b) until the remainder is zero. For GCD(1071, 462): GCD(462, 147) -> GCD(147, 21) -> GCD(21, 0) = 21. This takes three steps regardless of how large the numbers are, making it efficient for cryptographic use cases involving hundreds of digits.",
    ]
},

"PrimeFactorizationToolCalculator": {
    "heading": "When Prime Factorization Is the Right Tool",
    "section_id": "use-cases",
    "paragraphs": [
        "Prime factorization decomposes any composite number into its prime building blocks. This is more than an academic exercise: once you have the prime factorization of two numbers, you can compute their GCD and LCM immediately without any further division. GCD is the product of shared prime factors at their minimum exponents; LCM is the product of all prime factors at their maximum exponents. For 360 = 2^3 x 3^2 x 5 and 84 = 2^2 x 3 x 7: GCD = 2^2 x 3 = 12, LCM = 2^3 x 3^2 x 5 x 7 = 2520.",
        "Cryptography depends on the difficulty of prime factorization for large numbers. The RSA algorithm encodes messages using the product of two large primes (n = p x q). Decoding requires knowing p and q individually. While multiplying two 1024-bit primes takes a computer microseconds, factoring their product would take longer than the current age of the universe with classical computers. This asymmetry is what makes RSA secure.",
        "Number theory puzzles and competitive math problems frequently require prime factorization as the first step. Finding the number of divisors, the sum of divisors, or whether a number is a perfect square all follow directly from the prime factorization. A number has (e1+1)(e2+1)... divisors where e1, e2... are the exponents in its factorization. For 360 = 2^3 x 3^2 x 5^1: divisors = (3+1)(2+1)(1+1) = 24.",
    ]
},

"ShapesAreaVolumePackCalculator": {
    "heading": "Choosing the Right Shape Formula for Your Project",
    "section_id": "use-cases",
    "paragraphs": [
        "Area and volume calculations appear across construction, manufacturing, cooking, and everyday planning. Painting a room requires the wall area in square feet; tiling a floor requires the floor area; filling a garden bed with soil requires the volume in cubic feet. Each shape has its own formula, and using the wrong one — treating a trapezoid as a rectangle, for instance — can produce estimates off by 20 percent or more.",
        "For 3D packaging and shipping, volume calculations determine whether an item fits inside a box and how many units fit on a pallet. A box with dimensions 12 in x 8 in x 6 in has a volume of 576 cubic inches, equivalent to 0.33 cubic feet. Carriers charge by dimensional weight (volume divided by a factor, typically 139 for inches), so accurately computing volume directly affects shipping cost estimates.",
        "Architectural and landscape design uses irregular shapes constantly. A garden shaped like two merged rectangles, an L-shaped room, or a circular lawn center all require decomposing the shape into standard forms, calculating each area, and summing (or subtracting) the results. The shapes calculator handles the individual standard forms so you can focus on the decomposition step rather than the arithmetic.",
        "In academic settings, students encounter area and volume in geometry, physics, and chemistry. Calculating the cross-sectional area of a pipe (circle formula: pi x r^2) is prerequisite knowledge for fluid dynamics. The volume of a cylinder (pi x r^2 x h) appears in problems involving density, concentration, and pressure. Having a reliable calculator to verify manual work prevents compounding errors in multi-step problems.",
    ]
},

"ModuloRemainderCalculator": {
    "heading": "Where Modulo Arithmetic Appears in Practice",
    "section_id": "use-cases",
    "paragraphs": [
        "The modulo operation (a mod n) returns the remainder after dividing a by n. This seemingly simple operation is one of the most used in computer programming. Checking if a number is even: n mod 2 = 0. Wrapping an array index: index = (current + 1) mod length. Generating a cyclical sequence: values cycle through 0, 1, 2, ... n-1 endlessly. Any algorithm that needs to restart at zero after reaching a limit uses modulo.",
        "Calendar calculations rely on modulo. The day of the week follows a mod-7 cycle: if today is Wednesday (day 3), what day is it 100 days from now? (3 + 100) mod 7 = 5 = Friday. This is the same arithmetic behind Zeller's congruence, the formula used to determine day-of-week for any date in history. Leap year detection uses modulo: a year is a leap year if (year mod 4 = 0) and (year mod 100 != 0 or year mod 400 = 0).",
        "Cryptography uses modular arithmetic as its core operation. The RSA algorithm encrypts a message M as C = M^e mod n and decrypts as M = C^d mod n. The security depends on the difficulty of computing discrete logarithms in modular arithmetic without knowing the private exponent d. Even simple Caesar ciphers use modulo: shift each letter by k positions, with wrap-around handled by (letter + k) mod 26.",
        "Hash functions and checksums use modulo to fit values into fixed ranges. A hash table with 16 buckets assigns each key to bucket = hash(key) mod 16. Credit card validation (Luhn algorithm) repeatedly applies modulo 10. ISBN-10 validation uses modulo 11. Anywhere a large number must map to a bounded range, modulo is the mechanism.",
    ]
},

"QuadraticEquationSolverCalculator": {
    "heading": "When You Encounter Quadratic Equations in the Real World",
    "section_id": "use-cases",
    "paragraphs": [
        "Quadratic equations model any situation where a rate of change is itself changing — where the relationship between variables is curved rather than linear. Projectile motion is the classic example: the height of a thrown ball follows h = -16t^2 + v0*t + h0. Setting h = 0 and solving finds when the ball hits the ground. The two roots of the quadratic correspond to the two times the ball was at ground level — launch and landing.",
        "In business, quadratic equations model profit and revenue. If a company sells x units at price (50 - 0.5x), revenue R = 50x - 0.5x^2. To find the price that maximizes revenue, set dR/dx = 0 (giving x = 50) or complete the square on the quadratic. The vertex of the parabola is the revenue-maximizing quantity. This same structure appears in optimal lot-size inventory models and auction theory.",
        "Engineering and physics use quadratic equations for stress analysis, electrical circuit design, and optics. The focal length formula for a lens, the resonant frequency of an LC circuit, and the elastic deformation of a beam under load all produce quadratic relationships. Structural engineers solve quadratic equations when calculating the dimensions of beams that must support a given load without exceeding material stress limits.",
        "The discriminant (b^2 - 4ac) tells you the nature of the solutions before solving. Positive discriminant: two distinct real roots (the parabola crosses the x-axis twice). Zero discriminant: exactly one real root (the parabola just touches the axis). Negative discriminant: two complex conjugate roots (the parabola never crosses the axis). Checking the discriminant first saves time when you only need to know whether real solutions exist.",
    ]
},

"StandardDeviationVariancePopSampleCalculator": {
    "heading": "Standard Deviation in Data Analysis and Decision-Making",
    "section_id": "use-cases",
    "paragraphs": [
        "Standard deviation quantifies how spread out a set of values is around their mean. A low standard deviation means values cluster tightly; a high one means they are scattered widely. This single number summarizes variability in a way that raw lists cannot. Two investments can have the same average return but dramatically different standard deviations — one consistent and predictable, one volatile and risky. Standard deviation is the primary measure of investment risk in modern portfolio theory.",
        "The choice between population and sample standard deviation matters for statistical validity. Use population standard deviation (divide by N) when you have complete data — all exam scores in a class, all products from a production run. Use sample standard deviation (divide by N-1, Bessel's correction) when your data is a subset of a larger population — survey responses from 500 people representing all voters. The N-1 correction removes bias from the estimate of the true population variance.",
        "In manufacturing, the standard deviation of product dimensions determines process capability. A process producing bolts with a 10mm target diameter and standard deviation of 0.1mm is much more consistent than one with 0.5mm standard deviation. The Cp and Cpk indices used in Six Sigma are calculated as (specification range) / (6 x standard deviation). A Cpk above 1.33 indicates the process consistently stays within tolerances.",
        "Normal distribution probabilities are expressed in standard deviations. In a normal distribution, 68.3% of values fall within 1 standard deviation of the mean, 95.4% within 2, and 99.7% within 3. This 68-95-99.7 rule lets you immediately estimate the probability of an observation falling in any range once you know the mean and standard deviation. IQ scores, heights, and measurement errors all approximate normal distributions.",
    ]
},

"ZScorePercentileFinderCalculator": {
    "heading": "Z-Scores in Standardized Testing, Finance, and Research",
    "section_id": "use-cases",
    "paragraphs": [
        "A z-score transforms a raw value into a universal, unitless measure of how many standard deviations it sits above or below the mean. This standardization makes values from different distributions directly comparable. A student scoring 85 on a math test (mean 70, SD 10) has z = (85-70)/10 = 1.5. A student scoring 92 on an English test (mean 80, SD 6) has z = (92-80)/6 = 2.0. Despite the different scales, the English score is more exceptional relative to its distribution.",
        "Standardized tests like the SAT, ACT, and GRE report scores that are essentially scaled z-scores. The SAT scales raw scores to a 400-1600 range calibrated so that the mean and standard deviation are known target values. Percentile rankings — a score at the 90th percentile means 90% of test-takers scored lower — are read directly from the z-score using the standard normal distribution table.",
        "In finance, z-scores appear in anomaly detection and the Altman Z-Score model for bankruptcy prediction. The Altman Z-Score uses five financial ratios, converted to a combined z-score; below 1.81 signals high bankruptcy risk, above 2.99 signals financial health. Statistical process control in manufacturing uses z-scores to flag measurements that deviate more than 3 standard deviations from the process mean — the basis of Six Sigma quality control.",
        "Medical research uses z-scores to compare patient measurements to population norms. A child's height z-score compares their height to all children of the same age and sex. A z-score below -2 indicates the child is in the bottom 2.3% of their peer group, which may trigger clinical evaluation. Bone density T-scores (a type of z-score relative to young adult norms) diagnose osteopenia and osteoporosis using the same principle.",
    ]
},

"PermutationsCombinationsNprNcrCalculator": {
    "heading": "Permutations and Combinations in Everyday Counting Problems",
    "section_id": "use-cases",
    "paragraphs": [
        "The core distinction: use permutations (nPr) when order matters, combinations (nCr) when it does not. Choosing the order of runners finishing a race is a permutation — first, second, third are distinct positions. Selecting members for a committee is a combination — the group is the same regardless of the order members were chosen. Confusing the two produces answers that are off by a factor of r! (r factorial), which for r=5 is 120.",
        "Password and lock combination security is built on permutation counting. A 4-digit PIN from digits 0-9 has 10^4 = 10,000 possible values (with repetition allowed). Without repetition, it is P(10,4) = 10x9x8x7 = 5,040. A 6-character password using 26 letters + 10 digits = 36 characters has 36^6 = 2,176,782,336 possible combinations with repetition. Each added character multiplies the search space, explaining why longer passwords are exponentially harder to crack.",
        "Probability calculations depend on combinations for the denominator. The probability of being dealt a royal flush in poker is C(5,5) / C(52,5) = 1 / 2,598,960. The probability of matching 5 of 6 lottery numbers is [C(6,5) x C(44,1)] / C(50,6). Any probability problem asking 'what fraction of possible selections have property X' requires counting the numerator (favorable selections using combinations) and the denominator (all possible selections).",
        "Network design and algorithm analysis use combinations to count connections. A fully connected network of 10 nodes requires C(10,2) = 45 direct links — each pair of nodes connected once. For 100 nodes: C(100,2) = 4,950 links. This quadratic growth explains why fully-meshed network topologies are impractical at scale and why hub-and-spoke or hierarchical designs are preferred in real infrastructure.",
    ]
},

"AngleConverterDegRadCalculator": {
    "heading": "When to Use Degrees vs Radians — and How to Convert",
    "section_id": "use-cases",
    "paragraphs": [
        "Degrees and radians both measure the same thing — rotation angle — but suit different contexts. Degrees are intuitive for humans: a right angle is 90 degrees, a full rotation is 360. Radians are natural for mathematics and physics: a full rotation is 2*pi radians, and the radian measure of an arc equals the arc length divided by the radius. When you integrate or differentiate trigonometric functions, radian measure makes the derivatives clean: d/dx sin(x) = cos(x) only when x is in radians.",
        "Engineering and programming almost exclusively use radians. Every math library — Python's math module, JavaScript's Math object, C's math.h — assumes radian input for sin(), cos(), and tan(). Passing degrees without converting is a common bug that produces wrong results that look plausible. For example, sin(90) in a radian-based function returns 0.894 (sin of 90 radians), not 1.0 (sin of 90 degrees). Always convert to radians before passing angle values to code.",
        "The conversion formulas are simple: radians = degrees x pi/180; degrees = radians x 180/pi. Key reference points to memorize: 0 degrees = 0 rad, 30 degrees = pi/6 rad, 45 degrees = pi/4 rad, 60 degrees = pi/3 rad, 90 degrees = pi/2 rad, 180 degrees = pi rad, 360 degrees = 2*pi rad. These six values cover the majority of angles encountered in trigonometry and physics problems.",
        "Navigation and geodesy use degrees with decimal minutes or DMS (degrees, minutes, seconds) notation. GPS coordinates are expressed in decimal degrees: 40.7128 degrees N, 74.0060 degrees W for New York City. Converting between DMS and decimal degrees requires dividing minutes by 60 and seconds by 3600, then summing. This is distinct from the degree-to-radian conversion but often encountered alongside it in geospatial calculations.",
    ]
},

"PolynomialFactorizationHelperCalculator": {
    "heading": "Why Factoring Polynomials Is a Foundational Algebra Skill",
    "section_id": "use-cases",
    "paragraphs": [
        "Factoring a polynomial means rewriting it as a product of simpler polynomials, just as factoring an integer means rewriting it as a product of primes. The quadratic x^2 - 5x + 6 factors into (x-2)(x-3), revealing the roots x=2 and x=3 directly. This is faster than applying the quadratic formula for simple cases and is the prerequisite skill for partial fraction decomposition, which appears in calculus integration.",
        "Solving polynomial equations — the core use of factoring — determines equilibrium points in economics, roots of characteristic equations in differential equations, and zeros of transfer functions in control engineering. A cubic polynomial modeling supply and demand has up to three equilibrium prices; factoring identifies all of them. In electrical engineering, the natural frequencies of a circuit are the roots of a polynomial derived from the circuit's differential equation.",
        "Polynomial factoring techniques follow a hierarchy: first remove common factors (GCF), then check for difference of squares (a^2 - b^2 = (a+b)(a-b)), then perfect square trinomials (a^2 + 2ab + b^2 = (a+b)^2), then trial factoring for quadratics, then the rational roots theorem for higher-degree polynomials. Recognizing which technique applies reduces time significantly. The rational roots theorem states that any rational root of a polynomial with integer coefficients must be a factor of the constant term divided by a factor of the leading coefficient.",
    ]
},

"LogAntilogBase10ECalculator": {
    "heading": "Logarithms in Science, Engineering, and Finance",
    "section_id": "use-cases",
    "paragraphs": [
        "Logarithms compress wide-ranging scales to human-readable numbers. The pH scale measures hydrogen ion concentration, which spans 14 powers of ten: pH = -log10([H+]). A pH of 3 (vinegar) has 10,000 times more H+ ions than pH 7 (water). Decibels measure sound intensity: dB = 10 x log10(I/I0). A 30 dB increase represents a 1000-fold increase in intensity. Richter scale earthquakes: magnitude 7 releases about 31.6 times more energy than magnitude 6, because 10^(1.5) = 31.6.",
        "The natural logarithm (base e, where e = 2.71828) is the mathematician's preferred tool because it is the unique function where d/dx ln(x) = 1/x. Compound interest and continuous growth use the natural log: if an investment grows at rate r for time t, its value is P x e^(rt). To find how long it takes to double at 7% continuous growth: ln(2) / 0.07 = 9.9 years. This is the continuous version of the Rule of 72.",
        "Common logarithm (base 10) makes multiplication easier by transforming it into addition: log(a x b) = log(a) + log(b). Before calculators, engineers used slide rules and log tables for this reason. Today, log base 10 is standard in signal-to-noise ratio calculations, computer science bit complexity (log2 for binary trees), and chemistry equilibrium constants. The antilog (10^x or e^x) reverses the operation, converting back from log-space to the original scale.",
        "Information theory uses logarithm base 2 to measure information in bits. The Shannon entropy H = -sum(p x log2(p)) quantifies uncertainty in a probability distribution. A fair coin toss has entropy H = 1 bit. A loaded coin (90% heads) has H = 0.47 bits — less uncertainty, less information content. Data compression algorithms exploit this: highly predictable sequences compress more because their entropy is low.",
    ]
},

"RectangleParallelogramAreaCalculator": {
    "heading": "Rectangle and Parallelogram Area in Construction and Design",
    "section_id": "use-cases",
    "paragraphs": [
        "The rectangle is the most common shape in construction and interior design. Flooring, ceiling tiles, wall panels, and roofing materials are all purchased by area. A room that is 14 feet wide and 18 feet long requires 252 square feet of flooring, plus a 10 percent waste factor for cuts around obstacles brings the order to 277 square feet. Material costs multiply directly with area, so accurate measurement is financially significant.",
        "The parallelogram formula (Area = base x height, where height is perpendicular to the base, not the slant side) is a common source of error. A parallelogram with base 10m and slant side 8m at 60 degrees has height = 8 x sin(60) = 6.93m, not 8m. Area = 10 x 6.93 = 69.3 m^2, not 80 m^2. Using the slant length instead of the perpendicular height overstates the area by 15 percent. In land surveying, this error scales to significant acreage discrepancies.",
        "Composite shapes require decomposing the overall shape into rectangles and parallelograms (and sometimes triangles), computing each area, and summing. An L-shaped floor plan is two rectangles. A room with a bay window is a rectangle plus a smaller attached rectangle. Architects and contractors perform this decomposition routinely when estimating material quantities. CAD software automates it, but understanding the underlying method catches software errors.",
    ]
},

"ScientificNotationStandardFormCalculator": {
    "heading": "Scientific Notation in Physics, Chemistry, and Engineering",
    "section_id": "use-cases",
    "paragraphs": [
        "Scientific notation exists because numbers in science span extreme ranges. The mass of a proton is 0.00000000000000000000000000167 kg (1.67 x 10^-27 kg). The distance from Earth to the Andromeda galaxy is 24,000,000,000,000,000,000,000 meters (2.4 x 10^22 m). Writing these in standard form is error-prone; scientific notation compresses them to a mantissa and exponent that are easy to compare and manipulate.",
        "Multiplication and division in scientific notation require working with exponents. (3 x 10^8) x (2 x 10^5) = 6 x 10^13. (4.5 x 10^9) / (1.5 x 10^3) = 3 x 10^6. Addition and subtraction require matching exponents first: (3 x 10^6) + (2 x 10^5) = (3 x 10^6) + (0.2 x 10^6) = 3.2 x 10^6. Mismatching exponents in addition is the most common scientific notation arithmetic error.",
        "Engineering prefixes are shorthand for powers of ten: milli (10^-3), micro (10^-6), nano (10^-9), kilo (10^3), mega (10^6), giga (10^9). A 5 GHz processor runs at 5 x 10^9 cycles per second. A 100 nm semiconductor node has features 100 x 10^-9 = 10^-7 meters wide. Converting between unit prefixes — from MHz to GHz, from nm to mm — is the practical application of scientific notation arithmetic that engineers perform daily.",
        "Significant figures interact with scientific notation to communicate measurement precision. The value 1.23 x 10^4 has three significant figures; 1.230 x 10^4 has four. Trailing zeros after the decimal point are significant; trailing zeros before the decimal in standard form may or may not be. Scientific notation removes this ambiguity completely. In any reported measurement, the number of digits in the mantissa equals the number of significant figures.",
    ]
},

"LinearInterpolationExtrapolationCalculator": {
    "heading": "Interpolation and Extrapolation in Data Analysis and Engineering",
    "section_id": "use-cases",
    "paragraphs": [
        "Interpolation estimates a value between two known data points. If a temperature sensor reads 20 degrees at 0 minutes and 30 degrees at 10 minutes, linear interpolation estimates the temperature at 6 minutes as 20 + (6/10) x (30-20) = 26 degrees. This is the foundational method used in lookup tables, sensor calibration, and graphics rendering. Bilinear interpolation extends it to 2D; trilinear to 3D — both using the same proportional logic.",
        "Extrapolation extends a trend beyond the observed data range. The same formula works: if two data points define a slope, project forward along that slope. Extrapolation is inherently less reliable than interpolation because trends often change outside the observed range. Climate projections, population growth models, and stock price forecasts all extrapolate from historical data, which is why uncertainty bands grow wider the further from the known data you project.",
        "Engineering lookup tables use linear interpolation constantly. Steam tables in thermodynamics give properties at standard pressures and temperatures; for a non-standard condition, you interpolate. Structural load tables in civil engineering give permissible loads for standard beam sizes and spans; for intermediate spans, interpolate. Aircraft performance charts are interpolated for actual gross weight, altitude, and temperature conditions.",
        "The interpolation formula y = y1 + ((x - x1) / (x2 - x1)) x (y2 - y1) can be rearranged to check if a value is feasible (is the target x between x1 and x2?) and to understand sensitivity (a 1 unit change in x produces (y2-y1)/(x2-x1) units change in y — the slope). This slope insight is useful for sensitivity analysis and for checking whether linear interpolation is reasonable or whether the relationship is too nonlinear for accuracy.",
    ]
},

"CircleAreaCircumferenceCalculator": {
    "heading": "Circle Calculations in Design, Engineering, and Everyday Life",
    "section_id": "use-cases",
    "paragraphs": [
        "The circle is nature's most efficient shape: for a given perimeter, a circle encloses the maximum area. This is why bubbles, cross-sections of pipes, and cell membranes are circular. In engineering, pipes and cables have circular cross-sections because the circular shape distributes internal pressure uniformly — no stress concentrations at corners. The area of a pipe cross-section (pi x r^2) determines its flow capacity for water, gas, or electrical current.",
        "In construction, circular calculations arise in every trade. A concrete column 18 inches in diameter has a cross-sectional area of pi x 9^2 = 254.5 square inches. Cutting a circular hole in drywall, computing how much paint covers a circular feature wall, calculating the area of a round dining table to determine tablecloth size — all require pi x r^2. The circumference (2 x pi x r) gives the perimeter of a circular garden bed, the fencing length for a circular enclosure, or the wheel rotation distance.",
        "Pi (pi = 3.14159...) is irrational and transcendental, meaning it cannot be expressed as a fraction and is not the root of any polynomial with rational coefficients. For practical calculations, pi = 3.14159 provides accuracy to within 0.00001 percent, more than sufficient for any real-world measurement. The approximation 22/7 = 3.14286 is accurate to 0.04 percent — useful for quick mental estimates when a calculator is unavailable.",
    ]
},

"PercentErrorCalculator": {
    "heading": "Using Percent Error in Lab Work and Quality Control",
    "section_id": "use-cases",
    "paragraphs": [
        "Percent error measures the accuracy of a measurement or estimate relative to the true (or accepted) value. The formula: percent error = |measured - accepted| / |accepted| x 100. A chemistry student measures the density of copper as 8.5 g/cm^3; the accepted value is 8.96 g/cm^3. Percent error = |8.5 - 8.96| / 8.96 x 100 = 5.1%. This tells the student their measurement is off by 5.1%, which may indicate a systematic error in their procedure.",
        "Distinguishing percent error from percent difference is important. Percent error compares to a known true value. Percent difference compares two measured values with no agreed truth: |A - B| / ((A+B)/2) x 100. Use percent error when verifying against a standard (calibration, textbook value); use percent difference when comparing two experimental measurements. Using percent error when no true value exists produces a meaningless result.",
        "Acceptable percent error thresholds vary by field and context. Introductory chemistry labs typically accept 5-10% percent error as passing. Analytical chemistry requires 1-2%. Pharmaceutical manufacturing requires <1% for drug potency measurements, with regulatory consequences for exceedances. Engineering tolerances depend on safety criticality: structural loads allow 5-10% while aerospace components may require <0.1%. Always interpret percent error relative to the precision requirements of your specific application.",
        "Systematic errors produce consistent percent error in one direction; random errors average out over many trials. If all your measurements are consistently low by 5%, you likely have a calibration issue or procedural bias. If your measurements scatter around the true value, random error dominates. Calculating percent error for multiple trials and analyzing whether it is consistently positive or negative diagnoses which type of error is present.",
    ]
},

"PythagoreanTheoremSolverCalculator": {
    "heading": "The Pythagorean Theorem Beyond Right Triangles",
    "section_id": "use-cases",
    "paragraphs": [
        "The Pythagorean theorem (a^2 + b^2 = c^2) applies directly to any right triangle: given two sides, it finds the third. In construction, the 3-4-5 right triangle is a standard check for squareness: if a corner measures exactly 3 feet on one side, 4 feet on another, and the diagonal is 5 feet, the corner is a perfect right angle. Builders and framers use this daily to square up walls, foundations, and decks before fastening.",
        "In 2D and 3D coordinate geometry, the Pythagorean theorem extends to the distance formula. The distance between two points (x1,y1) and (x2,y2) is sqrt((x2-x1)^2 + (y2-y1)^2) — the hypotenuse of the right triangle formed by horizontal and vertical displacement. In 3D: distance = sqrt((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2). Every GPS routing algorithm, physics simulation, and 3D game engine uses this formula countless times per second.",
        "The theorem identifies Pythagorean triples — integer solutions where all three sides are whole numbers. Common triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25. These appear in puzzle and competition math, and historically served as construction tools when precise measurement was impossible. Any multiple of a triple is also a triple: 6-8-10, 9-12-15, 10-24-26.",
        "The converse of the theorem is equally useful: if a^2 + b^2 = c^2, then the angle opposite side c is exactly 90 degrees. If a^2 + b^2 < c^2, the angle is obtuse. If a^2 + b^2 > c^2, the angle is acute. This converse allows surveyors, machinists, and engineers to verify right angles without measuring them directly — check the squared relationship between the three sides instead.",
    ]
},

"BinomialProbabilityCalculator": {
    "heading": "Binomial Probability in Quality Control and Statistics",
    "section_id": "use-cases",
    "paragraphs": [
        "The binomial probability model applies when you have a fixed number of independent trials, each with exactly two outcomes (success or failure) and a constant success probability. Coin flipping is the textbook example, but real applications are everywhere: manufacturing defect rates, clinical trial response rates, A/B test conversion rates, and survey response patterns all follow binomial distributions when each unit is independent.",
        "Quality control uses binomial probability to set acceptance sampling rules. If a production line has a 2% defect rate (p=0.02) and you sample 50 units, the probability of finding zero defects is (1-0.02)^50 = 0.364. The probability of finding 3 or more defects is 1 minus the cumulative probability of 0, 1, or 2 defects. Acceptance sampling plans specify a rejection threshold — typically the number of defects where the probability of seeing that many from acceptable-quality production falls below 5%.",
        "A/B testing in web analytics applies binomial testing. Button A converts 5.2% of visitors (control); Button B converts 6.1% (variant). With 1,000 visitors each, is this difference statistically significant? The null hypothesis is that both buttons have the same true conversion rate. The binomial test (or its normal approximation for large samples) calculates the probability of observing this size difference by chance. If p-value < 0.05, the difference is significant.",
        "The normal approximation to the binomial is accurate when np >= 10 and n(1-p) >= 10. For n=1000 and p=0.05: np=50 and n(1-p)=950 — both well above 10, so use the normal approximation with mean = np = 50 and standard deviation = sqrt(np(1-p)) = sqrt(47.5) = 6.89. This simplifies probability calculations for large samples where computing exact binomial probabilities is computationally intensive.",
    ]
},

"NormalCdfPdfEstimatorCalculator": {
    "heading": "Normal Distribution in Science, Finance, and Quality Control",
    "section_id": "use-cases",
    "paragraphs": [
        "The normal distribution (bell curve) is central to statistics because the Central Limit Theorem guarantees that the means of sufficiently large samples from any distribution converge to a normal distribution. This means you can use normal distribution tools for analyzing sample means even when the underlying data is not normally distributed — heights, income distributions, and stock returns all violate normality, but their sample means do not.",
        "The PDF (probability density function) tells you the relative likelihood of a specific value, while the CDF (cumulative distribution function) gives the probability of observing a value at or below a threshold. For the standard normal: PDF peaks at x=0 with value 0.399. CDF(0) = 0.5 (50% of values below the mean). CDF(1.96) = 0.975 (97.5% below, meaning only 2.5% above — the basis of the 95% confidence interval which uses +/-1.96 sigma).",
        "Manufacturing process control uses normal distribution to establish control limits. A control chart plots sample means over time, with upper and lower control limits set at mean +/- 3 standard deviations. Under normal operation, 99.73% of sample means should fall within these limits. A point outside the limits signals a process shift with only 0.27% false positive rate. This is the statistical basis of Shewhart control charts used in Six Sigma.",
        "Value at Risk (VaR) in finance uses the normal distribution to estimate maximum expected loss. If a portfolio has daily returns with mean 0.05% and standard deviation 1.2%, the 1% VaR (worst expected day 1 in 100) is mean + z(0.01) x SD = 0.05% + (-2.326 x 1.2%) = -2.74%. This means there is a 1% chance of losing more than 2.74% in a single day. Banks are required by regulation to hold capital against their VaR.",
    ]
},

"TrigFunctionsAngleSideFinderCalculator": {
    "heading": "Trigonometry in Navigation, Architecture, and Physics",
    "section_id": "use-cases",
    "paragraphs": [
        "The six trigonometric functions (sine, cosine, tangent, and their reciprocals) define the relationships between sides and angles in right triangles. These relationships extend to any triangle (via the law of sines and cosines) and to circular motion (via the unit circle definition). Every wave — sound, light, electrical — is modeled as a combination of sine and cosine functions, making trigonometry the mathematical foundation of signal processing and physics.",
        "Surveying uses trigonometry to calculate distances and elevations without direct measurement. The angle of elevation to the top of a building, measured from a known distance, determines the building's height via tangent: height = distance x tan(angle). GPS trilateration combines distance measurements from multiple satellites using the 3D distance formula, which derives from the Pythagorean theorem and trigonometry.",
        "Architecture uses trigonometry to calculate roof pitches, structural loads, and sight lines. A roof with a 30-degree pitch: the run is the horizontal distance, the rise is the height, and rise = run x tan(30) = run x 0.577. Rafter length = run / cos(30) = run / 0.866. These calculations determine material quantities (roof sheathing, rafters) and load distribution on walls. Steeper pitches carry more wind load and require heavier framing.",
        "Electrical engineering uses trigonometry constantly for AC circuit analysis. Voltage and current in AC circuits are sinusoidal: V(t) = V_max x sin(omega*t + phi). The phase angle phi determines whether voltage leads or lags current, which defines the power factor. Reactive power (which does no useful work) is calculated as P x tan(phase angle). Correcting power factor to near zero phase angle maximizes the efficiency of industrial electrical systems.",
    ]
},

"RandomNumberGeneratorRangesCalculator": {
    "heading": "Random Numbers in Simulation, Cryptography, and Sampling",
    "section_id": "use-cases",
    "paragraphs": [
        "Random number generation has fundamentally different requirements depending on the application. For simulations and games, pseudo-random number generators (PRNGs) are sufficient — they produce statistically random-looking sequences from a deterministic seed. For cryptography and security, cryptographically secure pseudo-random number generators (CSPRNGs) are required — they must be computationally infeasible to predict, even knowing previous outputs. Using a PRNG for key generation is a critical security vulnerability.",
        "Monte Carlo simulations use thousands or millions of random samples to estimate complex probabilities. To estimate the probability of a portfolio losing more than 10% in a month: sample random monthly returns from the historical distribution, compute portfolio value under each, count outcomes below -10%. With 100,000 trials, you estimate the probability to within +/- 0.1 percentage points. Monte Carlo is used in risk management, options pricing (Black-Scholes assumes normally distributed returns), and physics simulations.",
        "Statistical sampling uses random number generators to select representative samples from populations. A simple random sample assigns every population member a number, then selects those matching a random draw. Stratified sampling divides the population into groups and randomly samples from each. Cluster sampling randomly selects groups and samples all members of chosen groups. Each design balances cost, feasibility, and statistical efficiency differently.",
        "Game design and procedural generation use controlled randomness to create varied, replayable experiences. A seeded random number generator produces the same level layout every time when given the same seed — useful for sharing 'seeds' that reproduce specific game worlds. Adjusting the distribution (uniform vs. weighted vs. normal) shapes the player experience: weighted random makes rare items appropriately uncommon without making them impossible.",
    ]
},

# ─── AUTOMOTIVE ──────────────────────────────────────────────────────────────
"EvAccelerationTorqueCalculator": {
    "heading": "Why EV Torque and Acceleration Feel Different From ICE Vehicles",
    "section_id": "use-cases",
    "paragraphs": [
        "Electric motors produce maximum torque from zero RPM — a fundamental physical difference from internal combustion engines (ICE), which must build RPM to reach their torque peak. A gasoline engine might peak at 300 lb-ft at 4,000 RPM; an electric motor produces 300 lb-ft the instant current flows. This is why EVs feel so responsive from a stop: the full torque is available immediately, with no clutch, no gear shift, and no RPM buildup required.",
        "The 0-60 mph time is the standard performance benchmark, but EV acceleration is most dramatically felt in the 0-30 mph range. At city driving speeds, EVs consistently outperform much more powerful ICE vehicles because they deliver full torque before the gasoline engine has even finished gear changes. The Tesla Model S Plaid (1020 hp) hits 60 mph in 2.1 seconds, but its 0-30 mph time of ~0.9 seconds is what drivers notice most.",
        "Torque vs power are related but different: Power (watts or horsepower) = Torque x Angular Velocity. At low RPM, an EV has high torque but moderate power because RPM is low. At high speed (high RPM), the EV enters a power-limited region where the controller reduces torque to maintain constant power output. This is the 'torque curve' plateau visible in EV spec sheets: constant torque from 0 to ~4,000 RPM, then declining torque above that to maintain constant peak power.",
        "Regenerative braking uses the electric motor as a generator during deceleration, converting kinetic energy back to battery energy. In one-pedal driving modes, lifting the accelerator applies strong regenerative braking — up to 0.2g in some vehicles. This regen torque is applied by the same motor and follows the same physics as acceleration torque, but in reverse. Understanding regenerative braking torque helps predict stopping distances and energy recovery on downhill routes.",
    ]
},

# ─── SCIENCE ─────────────────────────────────────────────────────────────────
"ProjectileMotionCalculator": {
    "heading": "Projectile Motion in Sports, Engineering, and Ballistics",
    "section_id": "use-cases",
    "paragraphs": [
        "Projectile motion assumes constant gravitational acceleration (g = 9.81 m/s^2 downward) and neglects air resistance. Under these conditions, horizontal and vertical motion are independent: horizontal velocity is constant; vertical velocity changes at rate g. The two equations of motion are: x(t) = v0*cos(theta)*t and y(t) = v0*sin(theta)*t - (1/2)*g*t^2. From these, range, time of flight, and maximum height all derive algebraically.",
        "Sports science uses projectile motion to optimize throwing, kicking, and launching. The maximum range for a projectile launched from ground level is achieved at 45 degrees, where sin(90) = 1 in the range formula R = v0^2*sin(2*theta)/g. In practice, athletes aim slightly below 45 degrees because a flatter trajectory clears obstacles more easily and because air drag affects high-angle launches more. The optimal angle for a soccer free kick (accounting for drag) is closer to 30-35 degrees.",
        "Artillery and ballistics extend projectile motion to account for air resistance, wind, Earth's rotation (Coriolis effect), and altitude variations in g. For short-range fire, the simple projectile equations provide adequate accuracy. For long-range artillery (20+ km), all corrections become significant — Coriolis deflects trajectories measurably, and the curvature of the Earth must be accounted for. Modern fire control systems solve the full differential equations numerically rather than using the simplified analytical formulas.",
        "Forensic reconstruction of accidents and crimes uses projectile motion in reverse: given the landing point and launch height, determine the initial velocity or launch angle. Blood spatter analysis applies the same equations. A bullet's ricochet path, a vehicle's trajectory after a crash, or a falling object's origin can all be reverse-engineered from the impact point and projectile equations.",
    ]
},

# ─── FUNNY (minimal boost needed) ────────────────────────────────────────────
"MeetingsWastedTimeCounterCalculator": {
    "heading": "The Real Cost of Unproductive Meetings",
    "section_id": "use-cases",
    "paragraphs": [
        "A study by MIT Sloan and Harvard Business Review found that executives spend an average of 23 hours per week in meetings, up from less than 10 hours in the 1960s. Of these meetings, 71% are considered unproductive by the attendees themselves (Harvard Business Review, 2017). The cost is not just time: interrupted deep work takes an average of 23 minutes to restart, so a 30-minute meeting inserted into a work block costs not 30 minutes but potentially 53+ minutes of lost productivity.",
        "Meeting cost calculators help organizations quantify what was previously invisible. A 60-minute status meeting with 8 employees averaging $80,000/year in salary costs approximately $192 in direct payroll (8 x $80K / 2080 hours x 1 hour). Add fully-loaded cost (benefits, overhead: typically 1.25-1.5x salary) and the true cost reaches $240-$288 per meeting. An organization running 10 such meetings per week spends $125,000-$150,000 annually on a single meeting type.",
        "Research-backed improvements: Amazon's famous 'two-pizza rule' limits meeting size to what two pizzas can feed (5-8 people), which cuts irrelevant attendees. Jeff Bezos instituted silent 6-page memo reading periods at meeting starts instead of slide presentations, improving the quality of decision-making. Google's Project Aristotle found that psychological safety (not attendee seniority) was the primary predictor of effective team meetings. Cal Newport's 'deep work' framework recommends batching all meetings into designated blocks to protect uninterrupted focus time.",
    ]
},

"SocialMediaTimeAlternativesCalculator": {
    "heading": "Understanding Your Relationship With Social Media Time",
    "section_id": "use-cases",
    "paragraphs": [
        "Average daily social media usage worldwide is 2 hours 27 minutes (DataReportal, 2024). Over a year, this totals approximately 37 days spent on social platforms. The opportunity cost is substantial: that same time could yield 18 books read, 1,000 hours of skill practice, or a meaningful second language acquisition (research estimates 500-1000 hours to conversational fluency). The calculator translates abstract daily minutes into annual equivalents that make the trade-off concrete.",
        "Passive consumption vs active creation is the key distinction in social media use. Research by the Oxford Internet Institute found that passive scrolling correlates with reduced well-being, while active use (posting, messaging, creating) shows neutral or positive correlation. The same platform can serve either mode — the behavior pattern matters more than the platform. Digital wellness frameworks like the 'JOMO' (Joy of Missing Out) movement advocate intentional, time-bounded social media use rather than total abstinence.",
        "Screen time reduction experiments show a consistent pattern: the first three days feel difficult, days 4-7 show productivity gains, and by day 14, most participants report improved sleep and reduced anxiety (University of Bath study, 2019). The alternative-activity framing used by this calculator is more effective than willpower-based restriction. Replacing scroll time with a specific activity (reading, walking, learning) activates implementation intentions that are more reliably followed than vague 'use less' goals.",
    ]
},

}


# ─────────────────────────────────────────────────────────────────────────────
# INJECTION LOGIC
# ─────────────────────────────────────────────────────────────────────────────

SECTION_TEMPLATE = """
      <section id="{section_id}" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {heading}
        </h2>
{paragraphs}
      </section>
"""

PARA_TEMPLATE = '        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">\n          {text}\n        </p>'


def build_section(data):
    paras = "\n".join(PARA_TEMPLATE.format(text=p) for p in data["paragraphs"])
    return SECTION_TEMPLATE.format(
        section_id=data["section_id"],
        heading=data["heading"],
        paragraphs=paras,
    )


def inject_into_file(filepath, dry_run=False):
    basename = os.path.basename(filepath).replace(".tsx", "")
    if basename not in EDITORIAL_DB:
        return False, "no editorial data for this file"

    data = EDITORIAL_DB[basename]
    content = open(filepath, encoding="utf-8").read()

    # Check if already injected (idempotency)
    if f'id="{data["section_id"]}"' in content:
        return False, f'section id="{data["section_id"]}" already present — skipping'

    new_section = build_section(data)

    # WorldClock special case: inject after existing features section
    inject_after_id = data.get("inject_after", None)
    if inject_after_id:
        marker = f'      </section>\n'
        # Find the features section closing tag
        feature_close_pos = content.find(f'<section id="{inject_after_id}"')
        if feature_close_pos == -1:
            return False, f'could not find section id="{inject_after_id}"'
        # Find the closing </section> after this position
        close_pos = content.find("      </section>", feature_close_pos)
        if close_pos == -1:
            return False, "could not find closing section tag"
        insert_pos = close_pos + len("      </section>")
        new_content = content[:insert_pos] + "\n" + new_section + content[insert_pos:]
    else:
        # Standard Math pattern: inject before <section id="faq"
        faq_marker = '      <section id="faq"'
        pos = content.find(faq_marker)
        if pos == -1:
            # Try without scroll-mt class
            faq_marker = '<section id="faq"'
            pos = content.find(faq_marker)
        if pos == -1:
            return False, 'could not find <section id="faq" — check editorial structure'
        new_content = content[:pos] + new_section + "\n" + content[pos:]

    if dry_run:
        word_count = sum(len(p.split()) for p in data["paragraphs"])
        return True, f"would inject {len(data['paragraphs'])} paragraphs (~{word_count} words) before faq section"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    word_count = sum(len(p.split()) for p in data["paragraphs"])
    return True, f"injected ~{word_count} words in {len(data['paragraphs'])} paragraphs"


def find_file(filename):
    """Search for a .tsx file by name recursively under CALC_DIR."""
    for root, _, files in os.walk(CALC_DIR):
        if filename in files:
            return os.path.join(root, filename)
    return None


def main():
    parser = argparse.ArgumentParser(description="Inject use-cases editorial into thin calculator pages")
    parser.add_argument("--dry-run", action="store_true", help="Show what would change without modifying files")
    parser.add_argument("--file", help="Process a single file (e.g., LcmCalculator.tsx)")
    args = parser.parse_args()

    if args.file:
        path = find_file(args.file)
        if not path:
            print(f"File not found: {args.file}")
            return
        ok, msg = inject_into_file(path, dry_run=args.dry_run)
        status = "OK" if ok else "SKIP"
        print(f"{status}  {args.file}: {msg}")
        return

    results = {"injected": [], "skipped": []}
    for basename in EDITORIAL_DB:
        fname = basename + ".tsx"
        path = find_file(fname)
        if not path:
            results["skipped"].append((fname, "file not found in src/"))
            continue
        ok, msg = inject_into_file(path, dry_run=args.dry_run)
        if ok:
            results["injected"].append((fname, msg))
        else:
            results["skipped"].append((fname, msg))

    prefix = "DRY RUN -- " if args.dry_run else ""
    print(f"\n{prefix}Thin Content Editorial Injection Results")
    print("=" * 60)
    print(f"Injected: {len(results['injected'])}")
    for fname, msg in results["injected"]:
        print(f"  OK   {fname}: {msg}")
    print(f"\nSkipped: {len(results['skipped'])}")
    for fname, msg in results["skipped"]:
        print(f"  --   {fname}: {msg}")


if __name__ == "__main__":
    main()
