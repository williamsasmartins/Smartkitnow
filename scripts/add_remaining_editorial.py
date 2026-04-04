"""Inject use-cases editorial for the 8 remaining thin pages."""
import os, re

CALC_DIR = "src/components/calculators"

EDITORIAL_DB = {
"RootRadicalSimplifierCalculator": {
    "heading": "Simplifying Radicals in Algebra and Geometry",
    "section_id": "use-cases",
    "paragraphs": [
        "Radical simplification is essential before combining radical expressions. Two radical terms can be added only when they share the same radicand: 3*sqrt(5) + 2*sqrt(5) = 5*sqrt(5). But 3*sqrt(5) + 2*sqrt(3) cannot be simplified further. Simplifying each radical first reveals whether they share a common radicand. For example, sqrt(75) + sqrt(48) = 5*sqrt(3) + 4*sqrt(3) = 9*sqrt(3). The simplification step was the key that made addition possible.",
        "The Pythagorean theorem produces radicals naturally. The hypotenuse of a right triangle with legs 3 and 7 is sqrt(9+49) = sqrt(58). This does not simplify because 58 = 2 x 29 has no perfect square factor. Compare to legs 4 and 6: sqrt(16+36) = sqrt(52) = sqrt(4x13) = 2*sqrt(13). Recognizing whether a radical simplifies avoids leaving unnecessarily complex expressions in engineering and physics calculations involving distances, forces, and waveforms.",
        "Rationalizing the denominator is the companion operation to simplification. When a radical appears in the denominator (1/sqrt(3)), multiply by sqrt(3)/sqrt(3) to get sqrt(3)/3. This is required when polynomial long division, partial fractions, and standard-form root expressions need a rational denominator. The process uses the identity sqrt(a) x sqrt(a) = a. In calculus, simplified radicals appear in derivatives: d/dx sqrt(x) = 1/(2*sqrt(x)), and in integrals using trigonometric substitution where sqrt(a^2 - x^2) factors after setting x = a*sin(theta).",
        "In algebra, fractional exponents and radicals are interchangeable: a^(1/2) = sqrt(a), a^(1/3) = cube root of a, and a^(m/n) = nth root of a^m. Exponential rules apply to all radical expressions through this equivalence: sqrt(a) x sqrt(b) = sqrt(ab) follows from a^(1/2) x b^(1/2) = (ab)^(1/2). Negative fractional exponents such as a^(-1/2) = 1/sqrt(a) appear frequently in physics formulas including inverse-square laws, pendulum periods, and wave speed equations.",
    ]
},
"ExponentPowerCalculator": {
    "heading": "Exponents in Growth, Science, and Computing",
    "section_id": "use-cases",
    "paragraphs": [
        "Exponential growth describes any quantity that increases by a constant multiplicative factor per time unit. Compound interest follows A = P x (1+r)^n: a 7% annual return on $10,000 grows to $19,672 in 10 years. Population growth, viral spread, and radioactive decay all follow the same exponential pattern with different bases. The defining property: growth accelerates over time because each step multiplies the current value, not the original. This is why early exponential growth looks slow and then becomes sudden.",
        "The laws of exponents govern all power manipulation: a^m x a^n = a^(m+n), a^m / a^n = a^(m-n), (a^m)^n = a^(mn), a^0 = 1, a^(-n) = 1/a^n. These rules handle every exponent operation. The most common error is treating (a+b)^2 as a^2 + b^2 instead of a^2 + 2ab + b^2. The rule (a^m)^n = a^(mn) applies only to products, not sums. Recognizing this prevents algebraic mistakes that cascade through multi-step problems in physics and engineering.",
        "Computer science uses powers of 2 for every memory and data size standard. 1 kilobyte = 2^10 = 1,024 bytes. 1 megabyte = 2^20 = 1,048,576 bytes. 1 gigabyte = 2^30 bytes. A 32-bit integer stores values from 0 to 2^32 - 1 = 4,294,967,295. Choosing between int8, int16, int32, and int64 data types is a direct choice between these powers of 2. Integer overflow bugs occur when a computation exceeds the maximum value a type can hold, a problem diagnosed immediately by knowing the relevant power of 2.",
        "Fractional exponents unify roots and powers: a^(1/2) = sqrt(a), a^(1/3) = cube root of a, a^(m/n) = nth root of a^m. Physics equations from orbital mechanics (period proportional to radius^(3/2)) to fluid dynamics (flow rate proportional to pressure^(1/2)) use fractional exponents. The exponential function base e (where e = 2.71828) is uniquely self-differentiating: d/dx e^x = e^x. This makes it the natural base for continuous growth and decay, differential equations, and Fourier analysis.",
    ]
},
"MeanMedianModeCalculator": {
    "heading": "Choosing Mean, Median, or Mode for Your Data",
    "section_id": "use-cases",
    "paragraphs": [
        "The mean, median, and mode each answer a different question about the center of a dataset. Mean answers: what is the average value? Median answers: what value splits the distribution in half? Mode answers: what value appears most frequently? For symmetric, bell-shaped distributions, all three are approximately equal. When distributions are skewed or contain outliers, they diverge significantly, and the choice of which to report changes the interpretation of the data.",
        "Income and wealth data are the canonical case where median beats mean. US median household income in 2023 was approximately $77,000; mean household income was approximately $101,000. The gap arises because a small number of extremely high earners pull the mean upward without moving the median. When describing the typical household, economists use the median. Real estate listings report median home prices rather than mean prices for the same reason: one $10 million sale in a neighborhood would distort the mean for all other buyers.",
        "Mode is most useful for categorical data and inventory decisions. A shoe store asking which size to reorder uses mode: the most frequently purchased size, not the average (which might be 9.37, a size that does not exist). In quality control, mode identifies the most common defect type. For survey responses on a 1-5 scale, the mode is often more informative than the mean: if most respondents answer 5 and a few answer 1, a mean of 4.1 obscures the bimodal distribution that the mode makes immediately visible.",
        "Sample size affects the reliability of all three measures. With small samples (under 20), all three are sensitive to individual values. The standard error of the mean decreases as 1/sqrt(n), meaning quadrupling sample size halves measurement uncertainty. The median requires at least 20-30 data points to be stable. When reporting any central tendency measure, include both sample size and a measure of spread (standard deviation for normally distributed data, interquartile range for skewed data) to give the measure proper context.",
    ]
},
"TipSplitBillCalculator": {
    "heading": "Tip Etiquette, Customs, and the Math Behind Splitting Bills",
    "section_id": "use-cases",
    "paragraphs": [
        "Tipping norms vary significantly by country and service type. In the United States, 18-20% is standard for restaurant service, 20-25% for excellent service. Bartenders typically receive $1-2 per drink or 15-20% of the tab. Hotel housekeeping: $2-5 per night. In Japan, tipping is not practiced and offering a tip can be considered rude. In the UK, 10-12.5% is common but not mandatory. Australia has minimal tipping culture. Understanding local conventions prevents both undertipping service workers who depend on tips and creating awkwardness in cultures where it is unnecessary.",
        "The pre-tax vs post-tax tipping question is a minor practical consideration. Technically, tips should be calculated on the pre-tax food and beverage total since the tax is a government charge, not compensation for service. In practice, the difference on a typical restaurant check is under $1. Tipping 18% on a post-tax total at an 8% sales tax rate is equivalent to tipping about 19.4% on the pre-tax total. Most people use the post-tax total for simplicity without meaningful financial impact.",
        "Splitting bills equally works well when everyone ordered similar items. Proportional splitting is fairer when orders vary widely, but requires more tracking. Modern payment apps such as Venmo, Splitwise, and Square Cash handle itemized proportional splits. For groups of 4-6, a hybrid approach works: split shared items (appetizers, wine) equally, then each person pays for their individual items. The social consideration: avoid letting one person consistently under-order while benefiting from others covering shared costs, which creates friction over repeated group meals.",
    ]
},
"NetflixOneMoreEpisodeTimerCalculator": {
    "heading": "The Psychology of Binge-Watching and Time Awareness",
    "section_id": "use-cases",
    "paragraphs": [
        "Streaming platforms are engineered for continued viewing. Netflix auto-plays the next episode after a 5-second countdown, removing the conscious decision to continue. Each episode ends on an unresolved narrative tension specifically designed to create forward momentum. The result: what viewers intend as a single episode often becomes three or four. Research at the University of Texas at Austin found that binge-watching correlates with higher levels of loneliness and depression, and is often associated with using television to escape negative emotions rather than as active entertainment.",
        "The sunk cost fallacy amplifies binge-watching. Having already watched seven episodes of a mediocre series, viewers continue because stopping feels like wasting the previous investment. The rational approach recognizes that past time is already spent regardless of future choices. This calculator makes the sunk cost explicit by showing the total time committed and the precise end-time of additional episodes, which helps break the automatic continuation pattern by making the cost concrete and visible.",
        "Sleep researchers identify late-night streaming as a significant contributor to sleep debt. Blue light from screens suppresses melatonin production, and psychological arousal from compelling content delays sleep onset even after screens are turned off. The American Academy of Sleep Medicine recommends stopping screen use 30-60 minutes before target sleep time. Using the end-time calculation from this calculator to know the exact clock time three more episodes will finish enables concrete bedtime planning rather than vague intentions that dissolve in the moment.",
    ]
},
"CommitMessageQualityJudgeCalculator": {
    "heading": "Why Good Commit Messages Are Developer Infrastructure",
    "section_id": "use-cases",
    "paragraphs": [
        "A git commit message is the primary communication tool in a codebase over time. Code tells you what was done; the commit message tells you why. Future maintainers, including your own future self, spend more time reading git history than writing new code. A message like 'fix bug' forces the next developer to diff the commit to understand context. A message like 'Fix null pointer when user has no billing address (closes #4521)' is searchable, navigable, and self-explanatory without opening the diff.",
        "The Conventional Commits specification (conventionalcommits.org) is the most widely adopted format: type(scope): description, with types including feat, fix, docs, style, refactor, test, and chore. This structure enables automated tooling: semantic-release can automatically increment version numbers (feat = minor bump, fix = patch bump) and generate CHANGELOG.md entries from commit history. Many teams enforce conventional commits via git hooks or CI checks, making message format a pipeline requirement rather than a suggestion.",
        "Bad commit hygiene compounds over time. A repository with descriptive commits is like a well-indexed book; one with 'asdf' and 'WIP' messages is like a book with blank chapter titles. Code review is faster when commits are atomic (one logical change per commit) and well-described. Using git bisect to find which commit introduced a bug is only effective when commits are atomic and descriptive. Rebasing and cherry-picking across branches is safer when each commit represents a single, complete unit of change.",
    ]
},
"MedicalTourismCostSaverCalculator": {
    "heading": "Medical Tourism: Savings, Risks, and Planning Considerations",
    "section_id": "use-cases",
    "paragraphs": [
        "Medical tourism has grown to a $44 billion industry (Patients Beyond Borders, 2023), with an estimated 14-16 million patients traveling internationally each year. The primary driver is cost: procedures that cost $30,000-$50,000 in the United States often cost $5,000-$15,000 in Mexico, Thailand, India, or Costa Rica, even after travel and accommodation. The most common procedures sought internationally are hip and knee replacement, dental restoration, cardiac procedures, cosmetic surgery, and fertility treatments.",
        "The savings calculation must account for all costs: procedure fee, pre-operative testing, accommodation for 2-3 weeks post-surgery, flights, travel insurance, and follow-up care at home. A $35,000 US knee replacement done in Costa Rica for $12,000 plus $3,000 in travel expenses produces approximately $20,000 in net savings. However, complications requiring additional treatment abroad or at home can eliminate these savings quickly, which is why reputable medical tourism requires both facility accreditation through the Joint Commission International (JCI) and comprehensive travel medical insurance with emergency evacuation coverage.",
        "Insurance and legal considerations are critical. Most US health insurance plans do not cover procedures performed abroad. Legal recourse for malpractice is limited compared to domestic standards. The FDA does not regulate drugs, devices, or procedures performed outside the United States. These factors explain why medical tourism is most economically justified for elective procedures at established medical tourism destinations with verifiable JCI-accredited facilities, rather than for complex procedures where intensive post-operative monitoring significantly reduces risk.",
    ]
},
"LoopTheLoopSpeedCalculator": {
    "heading": "Circular Motion and the Physics of Loop-the-Loop",
    "section_id": "use-cases",
    "paragraphs": [
        "The loop-the-loop demonstrates centripetal acceleration and Newton's second law. At the top of the loop, gravity must provide at least the centripetal force needed to maintain circular motion: v^2/r >= g. This gives the minimum speed at the loop top: v_min = sqrt(g x r). For a loop with 5-meter radius, minimum speed = sqrt(9.81 x 5) = 7.0 m/s (about 25 km/h). Below this speed, the normal force from the track would need to be negative to maintain the circular path, which is impossible: the rider would fall away from the track.",
        "Real roller coasters apply this physics with safety factors. A loop with 10-meter radius requires minimum speed of sqrt(9.81 x 10) = 9.9 m/s at the top. Designers add 1.3-1.5x safety margins, increasing the required entry speed. Crucially, the minimum-speed relationship scales as sqrt(r): doubling the loop radius increases required speed by only 41%, not 100%. This is why modern coasters use larger teardrop-shaped loops rather than smaller circles: the larger radius requires proportionally less speed while providing a more comfortable rider experience.",
        "The g-force at the bottom of the loop is the sum of weight support and centripetal force: g_experienced = v^2/(g x r) + 1. A roller coaster moving at 20 m/s through a 10-meter loop bottom experiences 5.1g. At the top: g_experienced = v^2/(g x r) - 1 (centripetal and weight forces partially cancel). This difference between top and bottom g-forces motivates the clothoid (Euler spiral) loop design used in modern coasters. By continuously varying the loop radius, the clothoid keeps g-forces more uniform throughout, reducing physical stress on riders while allowing higher overall speeds.",
    ]
},
}

SECTION_TEMPLATE = """
      <section id="{section_id}" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {heading}
        </h2>
{paragraphs}
      </section>
"""
PARA_TEMPLATE = '        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">\n          {text}\n        </p>'


def find_file(basename):
    for root, _, files in os.walk(CALC_DIR):
        if basename + ".tsx" in files:
            return os.path.join(root, basename + ".tsx")
    return None


def main():
    for basename, data in EDITORIAL_DB.items():
        path = find_file(basename)
        if not path:
            print(f"SKIP {basename}: file not found")
            continue
        content = open(path, encoding="utf-8").read()
        if f'id="{data["section_id"]}"' in content:
            print(f"SKIP {basename}: section already present")
            continue
        paras = "\n".join(PARA_TEMPLATE.format(text=p) for p in data["paragraphs"])
        new_section = SECTION_TEMPLATE.format(
            section_id=data["section_id"],
            heading=data["heading"],
            paragraphs=paras,
        )
        # inject before <section id="faq"
        faq_pos = content.find('      <section id="faq"')
        if faq_pos == -1:
            faq_pos = content.find('<section id="faq"')
        if faq_pos == -1:
            print(f"SKIP {basename}: no faq section found")
            continue
        new_content = content[:faq_pos] + new_section + "\n" + content[faq_pos:]
        open(path, "w", encoding="utf-8").write(new_content)
        wc = sum(len(p.split()) for p in data["paragraphs"])
        print(f"OK   {basename}: injected ~{wc} words")


if __name__ == "__main__":
    main()
