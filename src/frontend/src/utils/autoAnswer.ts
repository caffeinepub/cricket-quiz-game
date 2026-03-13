/**
 * Auto-answer engine for Kuzo Solution
 * Generates detailed or direct subject-specific answers within 1-2 seconds
 */

function detectMathTopic(q: string): string {
  const lower = q.toLowerCase();
  if (/percentage|percent|%/.test(lower)) return "percentage";
  if (/fraction|\d+\/\d+|numerator|denominator/.test(lower)) return "fraction";
  if (/algebra|equation|solve|x =|\dx|variable/.test(lower)) return "algebra";
  if (/triangle|area|perimeter|circle|rectangle|geometry|square/.test(lower))
    return "geometry";
  if (/multiply|multiplication|times|गुणा/.test(lower)) return "multiplication";
  if (/divide|division|भाग/.test(lower)) return "division";
  if (/add|addition|sum|जोड़/.test(lower)) return "addition";
  if (/subtract|subtraction|minus|घटाना/.test(lower)) return "subtraction";
  if (/profit|loss|discount|interest|लाभ|हानि/.test(lower))
    return "profit-loss";
  if (/probability|chance|संभावना/.test(lower)) return "probability";
  if (/ratio|proportion/.test(lower)) return "ratio";
  return "general-math";
}

function extractNumbers(q: string): string[] {
  return q.match(/\d+\.?\d*/g) ?? [];
}

// ─── DIRECT (short) answers ───────────────────────────────────────────────

function mathDirectAnswer(q: string): string {
  const topic = detectMathTopic(q);
  const nums = extractNumbers(q);
  const n1 = nums[0] ?? "a";
  const n2 = nums[1] ?? "b";

  const map: Record<string, string> = {
    algebra:
      "Variable solve karne ke liye: dono sides se constant hatao, phir coefficient se divide karo. Jaise 2x+5=15: x = (15-5)/2 = 5. Equation ek taraazu hai — ek side pe jo karo, dusri side pe bhi karo.",
    percentage:
      "Percentage = (Value ÷ Total) × 100. Jaise 60 out of 80 = (60÷80)×100 = 75%. Value nikalni ho toh: Value = (Percentage × Total) ÷ 100.",
    geometry: `Area aur Perimeter ke basic formulas: Rectangle mein Area = L×B, Perimeter = 2(L+B). Circle mein Area = πr², Circumference = 2πr. Triangle mein Area = ½×Base×Height.${n1 !== "a" ? ` Diye gaye numbers ${n1} aur ${n2} ke saath calculate karo.` : ""}`,
    "profit-loss": `Profit = SP - CP (jab SP > CP). Loss = CP - SP (jab CP > SP). Profit% = (Profit÷CP)×100. Loss% = (Loss÷CP)×100.${n1 !== "a" ? ` CP=₹${n1}, SP=₹${n2} ke saath profit = ₹${Number(n2) - Number(n1)}.` : ""}`,
    fraction:
      "Fractions add/subtract karne ke liye pehle denominator same karo (LCM lo). Multiply karne ke liye seedha numerator×numerator aur denominator×denominator karo. Divide karne ke liye dusri fraction ko flip karke multiply karo.",
    "general-math": `Is sawaal ko step-by-step solve karo: pehle diya gaya data identify karo, phir sahi formula lagao, aur unit ke saath answer likho.${nums.length > 0 ? ` Numbers: ${nums.slice(0, 3).join(", ")}.` : ""}`,
  };
  return map[topic] ?? map["general-math"];
}

function scienceDirectAnswer(q: string): string {
  const lower = q.toLowerCase();
  if (/photosynthesis|प्रकाश संश्लेषण/.test(lower))
    return "Photosynthesis ek process hai jisme paudhe sunlight, CO2 aur paani se glucose (khana) banate hain aur oxygen release karte hain. Formula: 6CO2 + 6H2O + Sunlight → C6H12O6 + 6O2. Yeh chloroplasts mein hota hai.";
  if (/gravity|gravitation/.test(lower))
    return "Gravity woh force hai jo kisi bhi mass wali cheez ko doosri cheez ki taraf kheenchti hai. Newton ka formula: F = Gm1m2/r². Earth pe g = 9.8 m/s².";
  if (/atom|electron|proton|neutron/.test(lower))
    return "Atom ke andar nucleus (proton + neutron) hota hai aur bahar electron shells mein ghoomte hain. Atomic number = protons ki sankhya. Mass number = protons + neutrons.";
  if (/cell|koshika/.test(lower))
    return "Cell zindagi ki basic unit hai. Nucleus control center hai, mitochondria energy banata hai (ATP), aur cell membrane bahar se protect karti hai. 'Mitochondria = Powerhouse of the cell' — exam mein zaroor likhna.";
  return "Science mein har concept systematic observation aur experimentation pe based hai. Is topic ko define karo, uska mechanism samjho, aur real-life examples se connect karo.";
}

function englishDirectAnswer(q: string): string {
  const lower = q.toLowerCase();
  if (/tense|present|past|future/.test(lower))
    return "3 main tenses hain: Present (is/am/are), Past (was/were), Future (will). Har tense ke 4 forms hain — Simple, Continuous, Perfect, Perfect Continuous. V1=base, V2=past form, V3=past participle.";
  if (/essay|paragraph|writing/.test(lower))
    return "Essay mein teen parts hote hain: Introduction (topic introduce karo), Body (2-3 paragraphs mein points explain karo), Conclusion (summary do). PEEL method use karo: Point → Evidence → Explanation → Link.";
  if (/grammar|noun|verb|adjective/.test(lower))
    return "8 Parts of Speech: Noun (naming), Pronoun (replaces noun), Verb (action), Adjective (describes noun), Adverb (describes verb), Preposition (shows relation), Conjunction (joins words), Interjection (emotion).";
  return "English mein improve karne ke liye roz thoda padhna, likhna aur bolna zaroori hai. Simple sentences se shuru karo, grammar rules follow karo, aur naye words roz seekho.";
}

function hindiDirectAnswer(q: string): string {
  const lower = q.toLowerCase();
  if (/nibandh|essay|paragraph/.test(lower))
    return "Nibandh mein teen bhaag hote hain: Prastavana (parichay), Mukhya Bhaag (2-3 paragraphs), Upsanhar (conclusion). Saral Hindi mein likho, muhaavare use karo, aur topic clearly explain karo.";
  if (/vyakaran|sandhi|samas/.test(lower))
    return "Hindi vyakaran ke main topics: Sandhi (milne par dhwani parivartan), Samas (do shabdon ka mel), Karak (ne, ko, se, mein, par), Vachan (ek/anek), Ling (striling/pullling).";
  return "Hindi mein strong hone ke liye roz padhna aur likhna zaroori hai. Shuddh vartan, sahi vyakaran, aur muhaavaron ka use karo.";
}

function generalDirectAnswer(_q: string, subject: string): string {
  return `${subject} mein is sawaal ka jawab: concept ko clearly define karo, step-by-step approach use karo, aur real-life example se samjhao. Is topic ke basic principles samjhne se saari related problems easy ho jaati hain.`;
}

// ─── DETAILED (explained) answers — same as before ────────────────────────

function mathAnswer(q: string): string {
  const topic = detectMathTopic(q);
  const nums = extractNumbers(q);
  const n1 = nums[0] ?? "a";
  const n2 = nums[1] ?? "b";

  const topicMap: Record<string, string> = {
    algebra: `## 🧮 Algebra — Variable Solve Karna

**Tumhara Sawaal:** ${q}

---

### 📌 Linear Equation Kya Hoti Hai?
Ek linear equation mein ek unknown variable (jaise **x**) hoti hai. Hame uski value dhundni hoti hai.

---

### 📝 Step-by-Step Method:

**Step 1 — Variable ek side pe laao**
Sabse pehle equation mein se constant terms ek taraf karo.

**Step 2 — Inverse operation use karo**
- Agar addition hai → subtraction karo
- Agar multiplication hai → division karo

**Step 3 — Simplify karo**
Value calculate karo.

**Step 4 — Verify karo**
Answer wapas equation mein daalo aur check karo LHS = RHS hai ya nahi.

---

### 🔑 Golden Rule:
> **Jo bhi ek side pe karo, wahi EXACTLY dusri side pe bhi karo.**
> Equation ek taraazu (balance) hai — dono sides hamesha equal rehni chahiye!

---

### 💡 Example:
Agar **2x + 5 = 15** hai:
- Step 1: 2x = 15 - 5 = 10
- Step 2: x = 10 ÷ 2 = **5**
- Check: 2(5) + 5 = 15 ✓

### 🏋️ Practice Karo:
- 3x + 7 = 22
- 5x - 3 = 12
- 4x + 10 = 30

**Algebra practice karte raho — easily master ho jaata hai! 💪**`,

    percentage: `## 📊 Percentage — Sampoorn Guide

**Tumhara Sawaal:** ${q}

---

### 📌 Percentage Kya Hota Hai?
Percentage matlab **"100 mein se kitna"** — yeh ek ratio hai jo hamesha 100 ke upar based hota hai.

**Symbol:** % (percent)

---

### 🔢 Important Formulas:

**1. Percentage Nikalna:**
$$Percentage = (Value ÷ Total) × 100$$

**2. Percentage ka Value Nikalna:**
$$Value = (Percentage × Total) ÷ 100$$

**3. Percentage Increase:**
$$Increase % = (New - Old) ÷ Old × 100$$

**4. Percentage Decrease:**
$$Decrease % = (Old - New) ÷ Old × 100$$

---

### 📝 Examples:

**Example 1:** 80 mein se 60 ka percentage?
- (60 ÷ 80) × 100 = **75%**

**Example 2:** 500 ka 20% kya hoga?
- (20 × 500) ÷ 100 = **100**

**Example 3:** Price 200 se 250 ho gayi — kitna increase?
- (250 - 200) ÷ 200 × 100 = **25% increase**

---

### 💡 Quick Tricks:
- 10% nikalna = number ko 10 se divide karo
- 5% = pehle 10% nikalo phir aadha karo
- 50% = simply 2 se divide karo
- 25% = 4 se divide karo

**Percentage real life mein bahut kaam aata hai — exams, shopping, marks sab jagah! 🎯**`,

    geometry: `## 📐 Geometry — Shapes & Formulas

**Tumhara Sawaal:** ${q}

---

### 📌 Important Shapes & Formulas:

**🔷 Triangle (Tribhuj):**
- Area = ½ × Base × Height
- Perimeter = a + b + c (teeno sides ka sum)
- Right triangle mein: a² + b² = c² (Pythagoras)

**🔶 Rectangle (Aayat):**
- Area = Length × Breadth
- Perimeter = 2 × (L + B)

**🔵 Circle (Vritt):**
- Area = π × r² (π ≈ 3.14)
- Circumference = 2 × π × r
- Diameter = 2r

**🟦 Square (Varg):**
- Area = side × side = side²
- Perimeter = 4 × side

---

### 📝 Example Calculations:

Agar **Rectangle ki length = ${n1}, breadth = ${n2}** ho toh:
- Area = ${n1} × ${n2} = **${Number(n1) * Number(n2) || `${n1}×${n2}`}**
- Perimeter = 2 × (${n1} + ${n2}) = **${2 * (Number(n1) + Number(n2)) || `2×(${n1}+${n2})`}**

---

### 💡 Yaad Rakhne Ki Trick:
> **"Area = andar ka hissa, Perimeter = bahar ki line"**

**Geometry mein formulas yaad karo aur practice karo — marks pakke! 📏**`,

    "profit-loss": `## 💰 Profit & Loss — Complete Guide

**Tumhara Sawaal:** ${q}

---

### 📌 Basic Terms:
- **CP (Cost Price)** = Jis price pe cheez khareedte hain
- **SP (Selling Price)** = Jis price pe cheez bechte hain
- **Profit** = SP > CP → Profit = SP - CP
- **Loss** = SP < CP → Loss = CP - SP

---

### 🔢 Important Formulas:

**Profit %:**
$$Profit\% = \frac{Profit}{CP} × 100$$

**Loss %:**
$$Loss\% = \frac{Loss}{CP} × 100$$

**SP jab Profit% pata ho:**
$$SP = CP × \frac{100 + Profit\%}{100}$$

**SP jab Loss% pata ho:**
$$SP = CP × \frac{100 - Loss\%}{100}$$

---

### 📝 Example:
CP = ₹${n1 || 200}, SP = ₹${n2 || 250}
- Profit = ${n2 || 250} - ${n1 || 200} = ₹${Number(n2 || 250) - Number(n1 || 200) || 50}
- Profit% = (${Number(n2 || 250) - Number(n1 || 200) || 50} ÷ ${n1 || 200}) × 100 = **${(((Number(n2 || 250) - Number(n1 || 200)) / Number(n1 || 200)) * 100).toFixed(0) || 25}%**

**Profit/Loss concepts real life mein bahut important hain! 💡**`,

    "general-math": `## 🧮 Mathematics — Detailed Solution

**Tumhara Sawaal:** ${q}

---

### 📌 Problem Ko Samjhein:
Is sawaal ko hum step-by-step approach se solve karenge.

---

### 📝 Step-by-Step Method:

**Step 1 — Diya hua data identify karo**
Sawaal mein jo numbers aur conditions di hain unhe clearly likh lo.
- Given: ${nums.length > 0 ? nums.slice(0, 3).join(", ") : "sawaal mein diye gaye values"}

**Step 2 — Appropriate formula lagao**
Sawaal ke type ke hisaab se sahi formula choose karo.

**Step 3 — Calculate karo**
Step-by-step calculation karo.

**Step 4 — Units check karo**
Answer ke saath sahi unit zaroor likho.

**Step 5 — Verify karo**
Answer check karo ki reasonable lag raha hai ya nahi.

---

### 🔑 Math Mein Success Ka Secret:
> **Practice + Samajhna = Perfect Score! 🎯**

**Koi specific topic mein doubt ho toh clearly puchho! 😊**`,
  };

  return topicMap[topic] ?? topicMap["general-math"];
}

function scienceAnswer(q: string): string {
  const lower = q.toLowerCase();

  if (/photosynthesis|प्रकाश संश्लेषण/.test(lower)) {
    return `## 🌿 Photosynthesis — Complete Explanation

**Photosynthesis** woh process hai jisme **paudhe (plants) sunlight ki energy se apna khana khud banate hain.**

---

### 🔬 Simple Definition:
> Paudhe **carbon dioxide (CO₂)** aur **paani (H₂O)** lekar, **sunlight** ki madad se **glucose** banate hain aur **oxygen (O₂)** release karte hain.

---

### ⚗️ Chemical Equation:
**6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂**

---

### 📍 Kahan Hota Hai?
- Paudhon ke **chloroplasts** mein (leaves mein hote hain)
- **Chlorophyll** = green pigment jo sunlight absorb karta hai

---

### 🌞 Zaroorat Kya Hai? (Reactants)
1. **Sunlight** — energy source
2. **CO₂** — hawa se (stomata ke zariye)
3. **Water (H₂O)** — roots se

### 🎁 Kya Milta Hai? (Products)
1. **Glucose (C₆H₁₂O₆)** — paudhe ka khana
2. **Oxygen (O₂)** — hum yahi saanste hain! 🌬️

---

### 💡 Easy Trick:
> **"Sunlight + CO₂ + H₂O → Sugar + O₂"**

### 🌍 Kyun Important Hai?
- Saari food chain ka aadhar hai
- Atmosphere mein oxygen maintain karta hai
- Carbon dioxide kam karta hai

**Photosynthesis = Life ki factory! 🏭**`;
  }

  if (/gravity|gravitation|gravitational|गुरुत्वाकर्षण/.test(lower)) {
    return `## 🌍 Gravity (Gurutvakarshan) — Full Explanation

**Gravity** woh force hai jo kisi bhi mass wali cheez ko doosri cheez ki taraf kheenchti hai.

---

### 📌 Newton Ka Universal Law of Gravitation:
> **"Har do objects ek dusre ko attract karte hain — force unke masses ke product ke proportional aur distance ke square ke inversely proportional hoti hai."**

**Formula:**
$$F = G × \frac{m_1 × m_2}{r^2}$$

Jahan:
- **F** = gravitational force
- **G** = gravitational constant (6.674 × 10⁻¹¹ N m²/kg²)
- **m₁, m₂** = dono objects ke masses
- **r** = unke beech ki distance

---

### 🌐 Earth Ki Gravity:
- Earth ki surface pe g = **9.8 m/s²**
- Matlab har second koi bhi falling object ki speed 9.8 m/s se badhti hai

### 🔑 Important Facts:
- Moon Earth se kam gravity rakhta hai (1/6 Earth ka)
- Space mein gravity zero nahi hoti — sirf bahut kam hoti hai
- Gravity ki wajah se planets orbit mein rehte hain

**Gravity hi universe ko ek saath rakhti hai! 🌌**`;
  }

  if (/atom|atomic|electron|proton|neutron|nucleus/.test(lower)) {
    return `## ⚛️ Atom — Building Block of Matter

**Atom** kisi bhi element ka sabse chhota particle hai jo us element ke saare chemical properties rakhta hai.

---

### 🔬 Atom Ki Structure:

**1. Nucleus (Naabhik) — Centre mein:**
- **Proton (+)** — positive charge, mass = 1 amu
- **Neutron (0)** — no charge, mass = 1 amu

**2. Electron Shells — Bahar:**
- **Electron (-)** — negative charge, bahut kam mass
- Electrons different shells (orbits) mein ghoomte hain

---

### 📊 Comparison Table:

| Particle | Charge | Location | Mass |
|----------|--------|----------|------|
| Proton | +1 | Nucleus | 1 amu |
| Neutron | 0 | Nucleus | 1 amu |
| Electron | -1 | Shells | ~0 amu |

---

### 🔑 Important Terms:
- **Atomic Number** = number of protons
- **Mass Number** = protons + neutrons
- **Valence Electrons** = outermost shell ke electrons

**Sari chemistry atoms ke behavior pe based hai! 🧪**`;
  }

  if (/cell|koshika|mitochondria|nucleus|chloroplast/.test(lower)) {
    return `## 🦠 Cell — Life Ki Basic Unit

**Cell** sabhi living organisms ki **basic structural aur functional unit** hai.

---

### 📌 Cell Theory:
1. Saare living things cells se bane hain
2. Cell life ki basic unit hai
3. Saari cells existing cells se banti hain

---

### 🔬 Cell Ke Types:

**1. Prokaryotic Cell (Simple)**
- Koi nucleus nahi hota
- Example: Bacteria

**2. Eukaryotic Cell (Complex)**
- Proper nucleus hota hai
- Example: Plant cells, Animal cells

---

### 🏗️ Important Cell Organelles:

| Organelle | Kaam (Function) |
|-----------|----------------|
| **Nucleus** | Control center — DNA rakhta hai |
| **Mitochondria** | Energy produce karta hai (ATP) |
| **Chloroplast** | Photosynthesis (sirf plants mein) |
| **Ribosome** | Protein synthesis |
| **Cell Membrane** | Bahar ka protection |
| **Vacuole** | Storage (plants mein bada) |

---

### 💡 Trick:
> **"Mitochondria = Powerhouse of the cell"** — yeh sabse important line hai exam mein!

**Cells ko samjho toh Biology easy ho jaati hai! 🌱**`;
  }

  return `## 🔬 Science — Detailed Explanation

**Tumhara Sawaal:** ${q}

---

### 📌 Concept Ko Samjho:
Science mein har concept ek systematic process ya phenomenon hai.

---

### 🔍 Key Points:

**Scientific Method:**
1. **Observation** — kuch observe karo
2. **Hypothesis** — possible explanation socho
3. **Experiment** — test karo
4. **Analysis** — results analyze karo
5. **Conclusion** — result pe pahuncho

---

### 💡 Science Padhne Ka Sahi Tarika:
> Sirf yaad mat karo — **samjho aur examples socho!**

**Specific topic ke baare mein aur detail mein puchho! 🎯**`;
}

function englishAnswer(q: string): string {
  const lower = q.toLowerCase();

  if (/tense|present|past|future/.test(lower)) {
    return `## ⏰ English Tenses — Complete Guide

Angrezi mein **3 main tenses** hote hain, aur har tense ke **4 forms** hote hain — total **12 tenses**.

---

## 1️⃣ PRESENT TENSE (Vartaman Kaal)

| Form | Structure | Example |
|------|-----------|--------|
| **Simple Present** | Subject + V1 | I eat rice. |
| **Present Continuous** | Subject + is/am/are + V-ing | I am eating. |
| **Present Perfect** | Subject + has/have + V3 | I have eaten. |
| **Present Perfect Continuous** | Subject + has/have been + V-ing | I have been eating for 2 hours. |

---

## 2️⃣ PAST TENSE (Bhoot Kaal)

| Form | Structure | Example |
|------|-----------|--------|
| **Simple Past** | Subject + V2 | I ate rice. |
| **Past Continuous** | Subject + was/were + V-ing | I was eating. |
| **Past Perfect** | Subject + had + V3 | I had eaten before he came. |
| **Past Perfect Continuous** | Subject + had been + V-ing | I had been eating for an hour. |

---

## 3️⃣ FUTURE TENSE (Bhavishya Kaal)

| Form | Structure | Example |
|------|-----------|--------|
| **Simple Future** | Subject + will + V1 | I will eat rice. |
| **Future Continuous** | Subject + will be + V-ing | I will be eating. |
| **Future Perfect** | Subject + will have + V3 | I will have eaten by then. |

---

### 💡 Easy Trick:
> **"Present → is/am/are, Past → was/were, Future → will"**

**V1 = base (eat), V2 = past (ate), V3 = past participle (eaten)**

**Tenses practice karo — fluency khud aa jaayegi! ✨**`;
  }

  if (/essay|paragraph|writing|nibandh/.test(lower)) {
    return `## ✍️ Essay / Paragraph Writing — Complete Guide

---

### 📌 Essay Ki Structure:

**1. Introduction (Parichay):**
- Topic introduce karo
- Main idea (thesis statement) likho
- 3-4 sentences mein

**2. Body Paragraphs (Mukhya Bhaag):**
- Har paragraph mein ek main point
- Topic sentence → Supporting details → Example
- Minimum 2-3 body paragraphs

**3. Conclusion (Nishkars):**
- Main points summarize karo
- Final thought ya recommendation do

---

### 💡 PEEL Method:
- **P** — Point (main idea)
- **E** — Evidence (supporting fact)
- **E** — Explanation (kyun important hai)
- **L** — Link (next point se connect karo)

**Writing practice karte raho — improvement guaranteed! 📝**`;
  }

  if (/grammar|noun|verb|adjective|pronoun|preposition/.test(lower)) {
    return `## 📚 English Grammar — Parts of Speech

---

### 📌 8 Parts of Speech:

| Part | Kaam | Example |
|------|------|--------|
| **Noun** | Naming | boy, Delhi |
| **Pronoun** | Replaces noun | he, she, it |
| **Verb** | Action | run, eat |
| **Adjective** | Describes noun | big, red |
| **Adverb** | Describes verb | quickly, very |
| **Preposition** | Shows relation | in, on, at |
| **Conjunction** | Joins words | and, but, or |
| **Interjection** | Emotion | Oh! Wow! |

---

### 💡 Tip:
Subject-Verb Agreement yaad rakho: Singular subject ke saath singular verb hoti hai.

**Grammar strong ho toh English mein confidence aata hai! 🌟**`;
  }

  return `## 📖 English — Complete Guide

**Tumhara Sawaal:** ${q}

---

### 📌 English Mein Strong Hone Ka Tarika:

- **Reading:** Roz kuch English padho — newspaper, books, stories
- **Writing:** Roz ek paragraph English mein likho, grammar rules follow karo
- **Speaking:** Daro mat — galtiyan hogi, seedhti bhi hongi

---

### 🔑 Grammar Ke Basic Rules:
- Subject-Verb Agreement
- Tense Consistency
- Article Usage (a, an, the)
- Punctuation sahi jagah

**English ek skill hai — practice se perfect hoti hai! 🎯**`;
}

function hindiAnswer(q: string): string {
  const lower = q.toLowerCase();

  if (/nibandh|essay|paragraph|anuchhed/.test(lower)) {
    return `## ✍️ Nibandh Likhne Ka Sahi Tarika

---

### 📌 Achha Nibandh Kaise Likhe?

**1. Prastavana (Introduction):**
- Vishay ka parichay do
- 4-5 vaakya

**2. Mukhya Bhaag (Body):**
- Vishay ke alag-alag pehlu explain karo
- Examples aur facts do

**3. Upsanhar (Conclusion):**
- Mukhya baat ka saar likho
- Apna vichaar do

---

### 💡 Tips:
> **"Achi Hindi, saral shabdon mein, shuddh vyakaran ke saath"**

- Mushkil shabd avoid karo
- Muhaavare use karo toh nibandh sundar lagta hai

**Jo topic poochha hai uska example chahiye toh batao! 📖**`;
  }

  if (/vyakaran|grammar|sandhi|samas|ras|chhand/.test(lower)) {
    return `## 📚 Hindi Vyakaran — Sampoorn Guide

---

### 📌 Hindi Vyakaran Ke Mukhya Bhaag:

**Sandhi:** Swar Sandhi, Vyanjan Sandhi, Visarg Sandhi

**Samas:** Tatpurush, Dvandva, Bahuvrihi, Avyayibhav

**Karak:** Karta (ने), Karma (को), Karan (से), Sampradan (को/के liye), Apadan (से), Sambandh (का/के/की), Adhikaran (में/पर)

**Vachan:** Ekavachan (ek) aur Bahuvachan (anek)

**Ling:** Striling (female) aur Pulling (male)

---

### 💡 Tip:
> **Vyakaran ko rules ki tarah mat padho — use karte hue seekho!**

**Koi specific vyakaran topic mein help chahiye toh batao! 🌟**`;
  }

  return `## 📖 Hindi — Poori Madad

**Tumhara Sawaal:** ${q}

---

### 📌 Hindi Mein Mahir Hone Ka Tarika:

- Roz Hindi akhbaar ya kitaab padho
- Shuddh vartan (spelling) dhyaan se seekho
- Muhaavare aur lokoktiyan seekho
- Roz kuch Hindi mein likho

---

### 🔑 Important Topics:
Vyakaran, Nibandh Lekhan, Patra Lekhan, Kahani Lekhan, Kavita

**Koi specific doubt ho toh zaroor puchho! 🙏**`;
}

function historyGeographyAnswer(q: string, subject: string): string {
  const isHistory = /history|itihas/i.test(subject);
  return `## ${isHistory ? "📜 History (Itihas)" : "🌍 Geography (Bhugol)"} — Detailed Answer

**Tumhara Sawaal:** ${q}

---

### 📌 Topic Overview:
${isHistory ? "History mein hum past ki ghataon, civilizations, aur unke effects study karte hain." : "Geography mein hum Earth ki physical features, climate, aur human activities study karte hain."}

---

### 📝 Key Points:

- ${isHistory ? "Bharat ka itihas 5000+ saal purana hai" : "Prithvi 4.5 billion saal purani hai"}
- ${isHistory ? "Ancient, Medieval, Modern — teen main periods hain" : "7 continents aur 5 oceans hain"}
- ${isHistory ? "Indus Valley Civilization sabse purani civilization thi" : "India ek diverse geography wala desh hai"}

---

### 💡 Study Tip:
> **"${isHistory ? "History ko stories ki tarah padho — boring nahi lagegi!" : "Geography mein maps zaroor dekho — visual learning powerful hai!"}"**

**Specific topic ka detail chahiye toh clearly puchho! 🎓**`;
}

function generalAnswer(q: string, subject: string): string {
  return `## 📚 ${subject} — Detailed Explanation

**Tumhara Sawaal:** ${q}

---

### 📌 Is Sawaal Ko Samjhein:

**Definition aur Explanation:**
Is concept ka fundamental meaning samjhna zaroori hai.

**How It Works:**
- First principle ya rule identify karo
- Examples ke zariye concept clear karo
- Real-life connection dhundho
- Practice ke zariye master karo

---

### ✅ Step-by-Step Approach:

1. Concept ek baar carefully padho
2. Apne words mein short notes banao
3. Examples solve karo
4. Book band karke test karo apne aap ko

---

### 💡 Pro Tip:
> **"Samajhna yaad karne se better hai!"**

**Aur specific doubt ho toh bilkul puchho — main hamesha available hoon! 😊**`;
}

/**
 * Main function: generates an answer based on subject, question, and mode
 * mode "direct" = 2-3 sentence short answer
 * mode "explained" = full detailed explanation (default)
 */
export function autoAnswer(
  subject: string,
  questionText: string,
  mode: "direct" | "explained" = "explained",
): string {
  const subjectLower = subject.toLowerCase();

  if (mode === "direct") {
    if (/math|maths|गणित/.test(subjectLower))
      return mathDirectAnswer(questionText);
    if (/science|vigyan|biology|chemistry|physics|विज्ञान/.test(subjectLower))
      return scienceDirectAnswer(questionText);
    if (/english/.test(subjectLower)) return englishDirectAnswer(questionText);
    if (/hindi|हिंदी/.test(subjectLower)) return hindiDirectAnswer(questionText);
    return generalDirectAnswer(questionText, subject);
  }

  // explained mode
  if (/math|maths|गणित/.test(subjectLower)) return mathAnswer(questionText);
  if (/science|vigyan|biology|chemistry|physics|विज्ञान/.test(subjectLower))
    return scienceAnswer(questionText);
  if (/english/.test(subjectLower)) return englishAnswer(questionText);
  if (/hindi|हिंदी/.test(subjectLower)) return hindiAnswer(questionText);
  if (/history|geography|itihas|bhugol/.test(subjectLower))
    return historyGeographyAnswer(questionText, subject);
  return generalAnswer(questionText, subject);
}
