import type { Question } from "../types/question";

const STORAGE_KEY = "kuzo_questions";

const SEED_DATA: Question[] = [
  {
    id: "seed-1",
    studentName: "Rahul Sharma",
    subject: "Math",
    questionText:
      "2x + 5 = 15 kaise solve karein? Mujhe algebra samajh nahi aa raha.",
    status: "answered",
    answer: `## 2x + 5 = 15 — Step-by-Step Solution

**Sawaal:** 2x + 5 = 15 ko solve karo

---

### 🧮 Kya hota hai Linear Equation?
Ek linear equation mein ek unknown variable hoti hai (yahan **x**) aur hame uski value dhundni hoti hai.

---

### 📝 Step-by-Step Hal:

**Step 1:** Dono sides se 5 hatao (subtract karo)
$$2x + 5 - 5 = 15 - 5$$
$$2x = 10$$

**Step 2:** Dono sides ko 2 se divide karo
$$\frac{2x}{2} = \frac{10}{2}$$
$$x = 5$$

---

### ✅ Verification (Jaanch karo):
x = 5 wapas equation mein rakhte hain:
- 2(5) + 5 = 10 + 5 = **15** ✓
- LHS = RHS, toh answer sahi hai!

---

### 🔑 Golden Rule:
> **Jo bhi ek side pe karo, wahi dusri side pe bhi karo.**
> Equation ek taraazu (balance) jaisi hoti hai — dono sides hamesha barabar rehni chahiye!

### 💡 Practice Sawaal:
- 3x + 7 = 22 → x = ?
- 5x - 3 = 12 → x = ?

**Agar aur koi doubt ho toh zaroor puchna! 😊**`,
    askedAt: "2026-03-01T10:00:00Z",
    answeredAt: "2026-03-01T11:30:00Z",
  },
  {
    id: "seed-2",
    studentName: "Priya Gupta",
    subject: "Science",
    questionText: "Photosynthesis kya hota hai? Poori process samjhao.",
    status: "answered",
    answer: `## 🌿 Photosynthesis — Poori Explanation

**Photosynthesis** woh process hai jisme **plants (paudhe) sunlight ki energy se apna khana khud banate hain.**

---

### 🔬 Simple Definition:
> Paudhe **carbon dioxide (CO₂)** aur **paani (H₂O)** lekar, **sunlight** ki madad se **glucose (shakkar)** banate hain aur **oxygen (O₂)** chhodte hain.

---

### ⚗️ Chemical Equation:
**6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂**

Mane:
- 6 Carbon Dioxide + 6 Paani + Sunlight → Glucose + 6 Oxygen

---

### 📍 Kahan hota hai?
Paudhon ke **chloroplasts** mein, jo **leaves (pattiyaan)** mein hote hain.
Chloroplasts mein **chlorophyll** hota hai — jo **hara rang (green color)** deta hai.

---

### 🌞 Kya chahiye? (Ingredients)
1. **Sunlight** — energy source
2. **CO₂** — hawa se, pattiyoon ke stomata se aata hai
3. **Water (H₂O)** — jado se (roots se) aata hai

### 🎁 Kya milta hai? (Products)
1. **Glucose** — paudhe ka khana (energy store hoti hai)
2. **Oxygen** — hum yahi saanslete hain! 🌬️

---

### 💡 Yaad rakhne ki trick:
> **"Sun se Sugar, CO₂ se O₂"**
> Sunlight + CO₂ + H₂O → Sugar (Glucose) + O₂

**Photosynthesis hi life ka aadhar hai — bina iske na khana, na oxygen! 🌍**`,
    askedAt: "2026-03-02T09:00:00Z",
    answeredAt: "2026-03-02T10:15:00Z",
  },
  {
    id: "seed-3",
    studentName: "Arjun Singh",
    subject: "English",
    questionText:
      "Tenses kitne prakar ke hote hain? Examples ke saath samjhao.",
    status: "answered",
    answer: `## ⏰ English Tenses — Poori Guide

Angrezi mein **3 main tenses** hote hain, aur har tense ke **4 forms** hote hain.

---

## 1️⃣ PRESENT TENSE (Vartaman Kaal)

| Form | Structure | Example |
|------|-----------|--------|
| **Simple Present** | Subject + V1 | I eat rice. |
| **Present Continuous** | Subject + is/am/are + V-ing | I am eating. |
| **Present Perfect** | Subject + has/have + V3 | I have eaten. |
| **Present Perfect Continuous** | Subject + has/have been + V-ing | I have been eating. |

---

## 2️⃣ PAST TENSE (Bhoot Kaal)

| Form | Structure | Example |
|------|-----------|--------|
| **Simple Past** | Subject + V2 | I ate rice. |
| **Past Continuous** | Subject + was/were + V-ing | I was eating. |
| **Past Perfect** | Subject + had + V3 | I had eaten. |
| **Past Perfect Continuous** | Subject + had been + V-ing | I had been eating. |

---

## 3️⃣ FUTURE TENSE (Bhavishya Kaal)

| Form | Structure | Example |
|------|-----------|--------|
| **Simple Future** | Subject + will + V1 | I will eat rice. |
| **Future Continuous** | Subject + will be + V-ing | I will be eating. |
| **Future Perfect** | Subject + will have + V3 | I will have eaten. |
| **Future Perfect Continuous** | Subject + will have been + V-ing | I will have been eating. |

---

### 🔑 V1, V2, V3 Kya Hota Hai?
- **V1** = Base form (eat, go, run)
- **V2** = Past form (ate, went, ran)
- **V3** = Past participle (eaten, gone, run)

### 💡 Easy Trick:
> **"Present mein is/am/are, Past mein was/were, Future mein will"**

**Tenses practice karo — fluency apne aap aayegi! ✨**`,
    askedAt: "2026-03-03T14:00:00Z",
    answeredAt: "2026-03-03T15:30:00Z",
  },
];

export function getQuestions(): Question[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(stored);
}

export function saveQuestion(q: Question): void {
  const questions = getQuestions();
  const idx = questions.findIndex((x) => x.id === q.id);
  if (idx >= 0) {
    questions[idx] = q;
  } else {
    questions.unshift(q);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function addQuestion(
  data: Omit<Question, "id" | "status" | "answer" | "answeredAt">,
): Question {
  const q: Question = {
    ...data,
    id: `q-${Date.now()}`,
    status: "pending",
    answer: "",
    answeredAt: "",
  };
  const questions = getQuestions();
  questions.unshift(q);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  return q;
}

export function addQuestionWithAnswer(
  data: Omit<Question, "id" | "status" | "answer" | "answeredAt">,
  answer: string,
): Question {
  const q: Question = {
    ...data,
    id: `q-${Date.now()}`,
    status: "answered",
    answer,
    answeredAt: new Date().toISOString(),
  };
  const questions = getQuestions();
  questions.unshift(q);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  return q;
}

export function getQuestionById(id: string): Question | undefined {
  return getQuestions().find((q) => q.id === id);
}
