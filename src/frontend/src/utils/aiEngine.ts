export interface AIResponse {
  text: string;
  category: string;
}

const KB: { keywords: string[]; answer: string; category: string }[] = [
  // Identity
  {
    keywords: [
      "who are you",
      "what are you",
      "who made you",
      "who created you",
      "about you",
      "what is kuzo",
    ],
    answer:
      "I am **Kuzo AI**, created by **Kush Ranjan**. I answer questions about education, jobs, technology, science, and general knowledge.",
    category: "greeting",
  },
  // Greetings
  {
    keywords: ["hello", "hi", "hey", "howdy", "greetings"],
    answer: "Hello! 👋 I'm Kuzo AI. Ask me anything!",
    category: "greeting",
  },
  {
    keywords: ["how are you", "how r you", "how are u"],
    answer: "I'm doing great! Ready to answer your questions.",
    category: "greeting",
  },
  {
    keywords: ["thank you", "thanks", "thankyou", "thank u", "thx"],
    answer: "You're welcome! 😊",
    category: "greeting",
  },
  {
    keywords: ["bye", "goodbye", "good bye", "see you", "ttyl", "farewell"],
    answer: "Goodbye! 👋 Come back whenever you have questions!",
    category: "greeting",
  },

  // Science — Biology
  {
    keywords: ["photosynthesis"],
    answer:
      "Photosynthesis is the process by which green plants use sunlight, water, and CO₂ to produce glucose and oxygen.\n\n**Equation:** 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\nIt happens in chloroplasts using chlorophyll.",
    category: "science",
  },
  {
    keywords: [
      "what is dna",
      "dna",
      "genes",
      "genetics",
      "chromosome",
      "genome",
    ],
    answer:
      "DNA (Deoxyribonucleic Acid) carries the genetic instructions for all living organisms. It has a double helix structure made of 4 bases: A, T, G, C. Humans have 46 chromosomes.",
    category: "science",
  },

  // Science — Physics
  {
    keywords: ["newton", "laws of motion", "newton's laws", "inertia"],
    answer:
      "**Newton's Three Laws of Motion:**\n\n1. An object stays at rest or in motion unless acted on by a force.\n2. F = ma (Force = mass × acceleration)\n3. Every action has an equal and opposite reaction.",
    category: "science",
  },
  {
    keywords: ["gravity", "gravitational force", "gravitation"],
    answer:
      "Gravity is the force that pulls objects toward the Earth. On Earth, gravitational acceleration = 9.8 m/s².",
    category: "science",
  },
  {
    keywords: ["speed of light", "light speed", "velocity of light"],
    answer:
      "The speed of light is **299,792,458 m/s** (approximately 300,000 km/s).",
    category: "science",
  },
  {
    keywords: [
      "atom",
      "atomic structure",
      "proton",
      "neutron",
      "electron",
      "nucleus",
    ],
    answer:
      "An atom is the smallest unit of a chemical element. It has protons and neutrons in the nucleus, with electrons orbiting around it.",
    category: "science",
  },
  {
    keywords: ["pythagorean theorem", "pythagoras"],
    answer:
      "The Pythagorean theorem: **a² + b² = c²**, where c is the hypotenuse of a right triangle.",
    category: "science",
  },
  {
    keywords: ["quadratic formula", "quadratic equation"],
    answer:
      "The quadratic formula: **x = (-b ± √(b²-4ac)) / 2a**, used to solve ax² + bx + c = 0.",
    category: "science",
  },
  {
    keywords: ["area of circle", "circle area"],
    answer:
      "Area of a circle = **πr²** (where r is the radius and π ≈ 3.14159).",
    category: "science",
  },
  {
    keywords: ["area of triangle", "triangle area"],
    answer: "Area of a triangle = **(base × height) / 2**.",
    category: "science",
  },
  {
    keywords: ["value of pi", "what is pi", "pi value"],
    answer:
      "Pi (π) = **3.14159265358979...** — the ratio of a circle's circumference to its diameter.",
    category: "science",
  },
  {
    keywords: ["prime number", "prime numbers"],
    answer:
      "A prime number is a number greater than 1 that is divisible only by 1 and itself. Examples: 2, 3, 5, 7, 11, 13...",
    category: "science",
  },
  {
    keywords: ["periodic table", "elements", "chemical elements"],
    answer:
      "The periodic table has **118 elements** arranged by atomic number. First element: **Hydrogen (H)**. Created by **Dmitri Mendeleev** in 1869.",
    category: "science",
  },
  {
    keywords: ["what is electricity", "electricity"],
    answer:
      "Electricity is the flow of electric charge. **Ohm's Law:** V = IR (Voltage = Current × Resistance).",
    category: "science",
  },
  {
    keywords: ["sound speed", "speed of sound"],
    answer:
      "Speed of sound in air = **343 m/s** at 20°C. Faster in water (~1,480 m/s) and even faster in solids.",
    category: "science",
  },
  {
    keywords: ["black hole", "what is black hole"],
    answer:
      "A black hole is a region where gravity is so strong nothing can escape, not even light. They form when massive stars collapse.",
    category: "science",
  },
  {
    keywords: ["largest planet", "biggest planet"],
    answer:
      "The largest planet is **Jupiter**. All other planets could fit inside it.",
    category: "science",
  },
  {
    keywords: ["closest star", "nearest star", "proxima centauri"],
    answer:
      "Closest star (after Sun) is **Proxima Centauri**, about **4.24 light-years** away.",
    category: "science",
  },

  // Space
  {
    keywords: ["neil armstrong", "first man on moon", "moon landing"],
    answer:
      "Neil Armstrong was the first human to walk on the Moon on **July 20, 1969** (Apollo 11 mission).",
    category: "general",
  },
  {
    keywords: ["longest river", "nile river"],
    answer:
      "The longest river in the world is the **Nile** at **6,650 km** long, flowing through Africa.",
    category: "general",
  },
  {
    keywords: ["deepest point", "mariana trench", "deepest ocean"],
    answer:
      "The deepest point on Earth is the **Mariana Trench** at **11,034 meters** below sea level.",
    category: "general",
  },
  {
    keywords: ["distance to moon", "moon distance", "how far is moon"],
    answer:
      "The average distance from Earth to the Moon is approximately **384,400 km**.",
    category: "general",
  },
  {
    keywords: ["sun", "solar system", "planets", "solar"],
    answer:
      "The Solar System has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. The Sun is a star at the center, 150 million km from Earth.",
    category: "general",
  },
  {
    keywords: [
      "tallest mountain",
      "mount everest",
      "highest mountain",
      "highest peak",
      "everest",
    ],
    answer:
      "The tallest mountain is **Mount Everest** — **8,848.86 meters** above sea level, on the Nepal–Tibet border.",
    category: "general",
  },
  {
    keywords: ["largest country", "biggest country", "largest nation"],
    answer: "The largest country by area is **Russia** — 17.1 million km².",
    category: "general",
  },

  // World Capitals
  {
    keywords: ["capital of india", "capital india", "india capital"],
    answer: "New Delhi",
    category: "general",
  },
  {
    keywords: [
      "capital of usa",
      "usa capital",
      "capital america",
      "capital of america",
      "united states capital",
    ],
    answer: "Washington, D.C.",
    category: "general",
  },
  {
    keywords: [
      "capital of uk",
      "capital of england",
      "uk capital",
      "england capital",
    ],
    answer: "London",
    category: "general",
  },
  {
    keywords: ["capital of china", "china capital"],
    answer: "Beijing",
    category: "general",
  },
  {
    keywords: ["capital of japan", "japan capital"],
    answer: "Tokyo",
    category: "general",
  },
  {
    keywords: ["capital of france", "france capital"],
    answer: "Paris",
    category: "general",
  },
  {
    keywords: ["capital of australia", "australia capital"],
    answer: "Canberra",
    category: "general",
  },
  {
    keywords: ["capital of russia", "russia capital"],
    answer: "Moscow",
    category: "general",
  },
  {
    keywords: ["capital of germany", "germany capital"],
    answer: "Berlin",
    category: "general",
  },
  {
    keywords: ["capital of italy", "italy capital"],
    answer: "Rome",
    category: "general",
  },
  {
    keywords: ["capital of pakistan", "pakistan capital"],
    answer: "Islamabad",
    category: "general",
  },
  {
    keywords: ["capital of bangladesh", "bangladesh capital"],
    answer: "Dhaka",
    category: "general",
  },
  {
    keywords: ["capital of canada", "canada capital"],
    answer: "Ottawa",
    category: "general",
  },
  {
    keywords: ["capital of brazil", "brazil capital"],
    answer: "Brasília",
    category: "general",
  },
  {
    keywords: ["capital of spain", "spain capital"],
    answer: "Madrid",
    category: "general",
  },
  {
    keywords: ["capital of mexico", "mexico capital"],
    answer: "Mexico City",
    category: "general",
  },
  {
    keywords: ["capital of turkey", "turkey capital"],
    answer: "Ankara",
    category: "general",
  },
  {
    keywords: [
      "capital of uae",
      "uae capital",
      "capital of united arab emirates",
    ],
    answer: "Abu Dhabi",
    category: "general",
  },
  {
    keywords: [
      "capital of saudi arabia",
      "saudi capital",
      "saudi arabia capital",
    ],
    answer: "Riyadh",
    category: "general",
  },
  {
    keywords: ["capital of sweden", "sweden capital"],
    answer: "Stockholm",
    category: "general",
  },
  {
    keywords: ["capital of norway", "norway capital"],
    answer: "Oslo",
    category: "general",
  },
  {
    keywords: [
      "capital of south korea",
      "south korea capital",
      "korea capital",
    ],
    answer: "Seoul",
    category: "general",
  },
  {
    keywords: ["capital of thailand", "thailand capital"],
    answer: "Bangkok",
    category: "general",
  },
  {
    keywords: ["capital of malaysia", "malaysia capital"],
    answer: "Kuala Lumpur",
    category: "general",
  },
  {
    keywords: ["capital of egypt", "egypt capital"],
    answer: "Cairo",
    category: "general",
  },
  {
    keywords: ["capital of nigeria", "nigeria capital"],
    answer: "Abuja",
    category: "general",
  },
  {
    keywords: ["capital of south africa", "south africa capital"],
    answer: "Pretoria",
    category: "general",
  },
  {
    keywords: ["capital of argentina", "argentina capital"],
    answer: "Buenos Aires",
    category: "general",
  },
  {
    keywords: ["capital of nepal", "nepal capital"],
    answer: "Kathmandu",
    category: "general",
  },
  {
    keywords: ["capital of sri lanka", "sri lanka capital"],
    answer: "Colombo",
    category: "general",
  },
  {
    keywords: ["capital of afghanistan", "afghanistan capital"],
    answer: "Kabul",
    category: "general",
  },
  {
    keywords: ["capital of iran", "iran capital"],
    answer: "Tehran",
    category: "general",
  },
  {
    keywords: ["capital of iraq", "iraq capital"],
    answer: "Baghdad",
    category: "general",
  },
  {
    keywords: ["capital of indonesia", "indonesia capital"],
    answer: "Jakarta (new capital: Nusantara)",
    category: "general",
  },
  {
    keywords: ["capital of kenya", "kenya capital"],
    answer: "Nairobi",
    category: "general",
  },
  {
    keywords: ["capital of ukraine", "ukraine capital"],
    answer: "Kyiv",
    category: "general",
  },
  {
    keywords: ["capital of poland", "poland capital"],
    answer: "Warsaw",
    category: "general",
  },
  {
    keywords: ["capital of portugal", "portugal capital"],
    answer: "Lisbon",
    category: "general",
  },
  {
    keywords: ["capital of greece", "greece capital"],
    answer: "Athens",
    category: "general",
  },
  {
    keywords: ["capital of switzerland", "switzerland capital"],
    answer: "Bern",
    category: "general",
  },

  // World Leaders
  {
    keywords: [
      "president of usa",
      "us president",
      "president of america",
      "american president",
    ],
    answer:
      "The President of the United States is **Donald Trump** (47th President, since January 20, 2025).",
    category: "general",
  },
  {
    keywords: [
      "narendra modi",
      "pm of india",
      "prime minister india",
      "prime minister of india",
      "who is prime minister",
      "india pm",
      "modi",
    ],
    answer:
      "The Prime Minister of India is **Narendra Modi**.\n\n**Full name:** Narendra Damodardas Modi\n**Born:** September 17, 1950, Vadnagar, Gujarat\n**Party:** Bharatiya Janata Party (BJP)\n**In office:** May 26, 2014 (re-elected 2019 and 2024)\n**Before PM:** Chief Minister of Gujarat (2001–2014)\n**Key achievements:** Digital India, Make in India, Swachh Bharat, Ayushman Bharat, UPI revolution, Chandrayaan-3 success.",
    category: "general",
  },
  {
    keywords: ["president of india", "rashtrapati", "india president"],
    answer:
      "The President of India is **Droupadi Murmu** (15th President, in office since July 25, 2022).",
    category: "general",
  },
  {
    keywords: [
      "vice president of india",
      "uprashtrapati",
      "india vice president",
    ],
    answer:
      "The Vice President of India is **Jagdeep Dhankhar** (since August 2022).",
    category: "general",
  },
  {
    keywords: ["chief justice of india", "cji", "india chief justice"],
    answer:
      "The Chief Justice of India is **Sanjiv Khanna** (since November 11, 2024).",
    category: "general",
  },
  {
    keywords: [
      "pm of uk",
      "prime minister of uk",
      "uk prime minister",
      "uk pm",
    ],
    answer:
      "The Prime Minister of the United Kingdom is **Keir Starmer** (since July 2024).",
    category: "general",
  },
  {
    keywords: ["president of russia", "russia president"],
    answer: "The President of Russia is **Vladimir Putin**.",
    category: "general",
  },
  {
    keywords: ["president of china", "china president"],
    answer: "The President of China is **Xi Jinping**.",
    category: "general",
  },
  {
    keywords: ["pm of pakistan", "pakistan prime minister"],
    answer:
      "The Prime Minister of Pakistan is **Shehbaz Sharif** (since March 2024).",
    category: "general",
  },
  {
    keywords: ["president of france", "france president"],
    answer: "The President of France is **Emmanuel Macron** (since May 2017).",
    category: "general",
  },
  {
    keywords: ["chancellor of germany", "germany chancellor"],
    answer:
      "The Chancellor of Germany is **Olaf Scholz** (since December 2021).",
    category: "general",
  },
  {
    keywords: ["pm of japan", "japan prime minister"],
    answer:
      "The Prime Minister of Japan is **Shigeru Ishiba** (since October 2024).",
    category: "general",
  },

  // Indian Facts
  {
    keywords: ["how many states in india", "states of india", "india states"],
    answer: "India has **28 states** and **8 Union Territories**.",
    category: "general",
  },
  {
    keywords: ["population of india", "india population"],
    answer:
      "India's population is approximately **1.44 billion** (world's most populous country).",
    category: "general",
  },
  {
    keywords: ["world population", "population of world"],
    answer: "The world population is approximately **8.1 billion**.",
    category: "general",
  },
  {
    keywords: ["national animal of india", "india national animal"],
    answer: "The national animal of India is the **Bengal Tiger**.",
    category: "general",
  },
  {
    keywords: ["national bird of india", "india national bird"],
    answer: "The national bird of India is the **Peacock**.",
    category: "general",
  },
  {
    keywords: ["national flower of india", "india national flower"],
    answer: "The national flower of India is the **Lotus**.",
    category: "general",
  },
  {
    keywords: ["national tree of india", "india national tree"],
    answer: "The national tree of India is the **Banyan tree**.",
    category: "general",
  },
  {
    keywords: ["national fruit of india", "india national fruit"],
    answer: "The national fruit of India is the **Mango**.",
    category: "general",
  },
  {
    keywords: ["national sport of india", "india national sport"],
    answer: "India's national sport is **Hockey** (field hockey).",
    category: "general",
  },
  {
    keywords: ["national anthem of india", "jana gana mana"],
    answer:
      "India's national anthem is **Jana Gana Mana**, written by **Rabindranath Tagore**. Adopted on January 24, 1950.",
    category: "general",
  },
  {
    keywords: ["national song of india", "vande mataram"],
    answer:
      "India's national song is **Vande Mataram**, written by **Bankim Chandra Chatterjee** from the novel Anandamath.",
    category: "general",
  },
  {
    keywords: ["national currency of india", "indian rupee", "rupee symbol"],
    answer:
      "India's currency is the **Indian Rupee (₹)**. The symbol was designed by **D. Udaya Kumar** and adopted in 2010.",
    category: "general",
  },
  {
    keywords: ["national river of india", "ganga", "ganges"],
    answer:
      "India's national river is the **Ganges (Ganga)**. Originates from **Gangotri Glacier** in Uttarakhand.",
    category: "general",
  },
  {
    keywords: [
      "constitution of india",
      "who wrote constitution",
      "dr ambedkar",
      "ambedkar",
    ],
    answer:
      "The Constitution of India was drafted by **Dr. B.R. Ambedkar**. Adopted November 26, 1949, came into force January 26, 1950. Longest written constitution in the world.",
    category: "general",
  },
  {
    keywords: ["first prime minister of india", "jawaharlal nehru", "nehru"],
    answer:
      "**Jawaharlal Nehru** was the first Prime Minister of India (1947–1964). Called **Chacha Nehru**. Children's Day is on his birthday, **November 14**.",
    category: "general",
  },
  {
    keywords: ["first president of india", "rajendra prasad"],
    answer:
      "**Dr. Rajendra Prasad** was the first President of India (1950–1962).",
    category: "general",
  },
  {
    keywords: ["iron man of india", "sardar patel", "patel"],
    answer:
      "**Sardar Vallabhbhai Patel** is called the Iron Man of India. He united 562 princely states into the Indian Union after independence.",
    category: "general",
  },
  {
    keywords: [
      "missile man of india",
      "apj abdul kalam",
      "kalam",
      "abdul kalam",
    ],
    answer:
      "**Dr. A.P.J. Abdul Kalam** is the Missile Man of India. Also the 11th President of India (2002–2007) and renowned aerospace scientist.",
    category: "general",
  },
  {
    keywords: ["chandrayaan", "chandrayaan 3", "moon mission india"],
    answer:
      "**Chandrayaan-3** landed on the Moon's south pole on **August 23, 2023**. India became the **first country** to land near the lunar south pole and the **4th country** to land on the Moon.",
    category: "general",
  },
  {
    keywords: ["mangalyaan", "mars mission india", "mom india"],
    answer:
      "**Mangalyaan (MOM)** was launched by ISRO on November 5, 2013. India became the **first country to reach Mars on its first attempt** (September 24, 2014).",
    category: "general",
  },
  {
    keywords: ["upi", "what is upi", "unified payment interface"],
    answer:
      "**UPI (Unified Payments Interface)** is India's real-time payment system by NPCI. Launched 2016. India handles the most UPI transactions in the world.",
    category: "general",
  },
  {
    keywords: ["largest state of india", "biggest state india"],
    answer:
      "The largest state of India by area is **Rajasthan** (342,239 km²). Most populous state is **Uttar Pradesh**.",
    category: "general",
  },
  {
    keywords: ["smallest state of india"],
    answer: "The smallest state of India by area is **Goa**.",
    category: "general",
  },
  {
    keywords: ["longest river in india", "india longest river"],
    answer:
      "The longest river in India is the **Ganga (Ganges)** — about 2,525 km long.",
    category: "general",
  },
  {
    keywords: ["highest peak in india", "highest mountain india"],
    answer:
      "The highest peak in India is **Kangchenjunga** (8,586 m) — on the border of Sikkim and Nepal.",
    category: "general",
  },
  {
    keywords: ["republic day india", "26 january", "india republic"],
    answer:
      "India became a Republic on **January 26, 1950** when the Constitution came into force. Republic Day is celebrated every year on January 26.",
    category: "general",
  },
  {
    keywords: ["isro full form", "what is isro"],
    answer: "ISRO stands for **Indian Space Research Organisation**.",
    category: "general",
  },
  {
    keywords: ["nasa full form", "what is nasa"],
    answer:
      "NASA stands for **National Aeronautics and Space Administration** (USA).",
    category: "general",
  },
  {
    keywords: [
      "independence day india",
      "15 august",
      "india independence",
      "indian independence",
    ],
    answer:
      "India gained independence from British rule on **August 15, 1947**.",
    category: "general",
  },
  {
    keywords: ["india gdp", "gdp of india", "india economy"],
    answer:
      "India is the **5th largest economy** with a GDP of about **$3.7 trillion** (2024).",
    category: "general",
  },
  {
    keywords: ["taj mahal", "who built taj mahal"],
    answer:
      "The **Taj Mahal** is in **Agra, UP**. Built by **Shah Jahan** for wife **Mumtaz Mahal** (1632–1653). UNESCO World Heritage Site and one of the Seven Wonders.",
    category: "general",
  },
  {
    keywords: ["india gate", "who built india gate"],
    answer:
      "**India Gate** is a war memorial in New Delhi, designed by Sir Edwin Lutyens to honor 70,000 Indian soldiers who died in WWI.",
    category: "general",
  },
  {
    keywords: ["red fort", "lal quila"],
    answer:
      "The **Red Fort (Lal Qila)** is in Delhi, built by **Shah Jahan** in 1648. PM hoists national flag here on Independence Day.",
    category: "general",
  },

  // Inventions
  {
    keywords: ["who invented telephone", "invention of telephone"],
    answer:
      "The telephone was invented by **Alexander Graham Bell** in **1876**.",
    category: "general",
  },
  {
    keywords: [
      "who invented computer",
      "invention of computer",
      "father of computer",
    ],
    answer:
      "**Charles Babbage** is known as the father of the computer. He designed the first mechanical computer (Analytical Engine).",
    category: "general",
  },
  {
    keywords: [
      "who invented internet",
      "invention of internet",
      "who created internet",
    ],
    answer:
      "The World Wide Web was invented by **Tim Berners-Lee** in **1989**.",
    category: "general",
  },
  {
    keywords: ["who invented electricity", "thomas edison"],
    answer:
      "**Thomas Edison** invented the practical electric light bulb in **1879**.",
    category: "general",
  },
  {
    keywords: ["who invented airplane", "wright brothers"],
    answer:
      "**Wright Brothers** made the first powered flight on **December 17, 1903** at Kitty Hawk, North Carolina.",
    category: "general",
  },
  {
    keywords: ["who invented radio", "marconi"],
    answer:
      "**Guglielmo Marconi** invented radio in 1895. Indian scientist **Jagadish Chandra Bose** also demonstrated wireless transmission in 1895.",
    category: "general",
  },
  {
    keywords: ["printing press", "gutenberg"],
    answer:
      "**Johannes Gutenberg** invented the printing press around **1440**.",
    category: "general",
  },

  // Famous People
  {
    keywords: ["albert einstein", "who is einstein"],
    answer:
      "Albert Einstein (1879–1955) was a German-born theoretical physicist who developed the **Theory of Relativity** (E=mc²). He won the Nobel Prize in Physics in 1921.",
    category: "general",
  },
  {
    keywords: ["isaac newton", "who is newton"],
    answer:
      "Sir Isaac Newton (1643–1727) was an English physicist who formulated the Laws of Motion and the Law of Universal Gravitation.",
    category: "general",
  },
  {
    keywords: ["bill gates", "who is bill gates"],
    answer:
      "Bill Gates is the co-founder of **Microsoft** and one of the world's wealthiest people. Born October 28, 1955.",
    category: "general",
  },
  {
    keywords: ["steve jobs", "who is steve jobs"],
    answer:
      "Steve Jobs (1955–2011) was the co-founder and CEO of **Apple Inc.** He revolutionized personal computers, smartphones (iPhone), and digital music (iPod).",
    category: "general",
  },
  {
    keywords: ["virat kohli", "who is virat kohli"],
    answer:
      "Virat Kohli is an Indian cricketer and one of the greatest batsmen of all time. Born November 5, 1988, Delhi.",
    category: "general",
  },
  {
    keywords: ["sachin tendulkar", "who is sachin"],
    answer:
      "Sachin Tendulkar is an Indian cricket legend, known as the 'God of Cricket'. He holds the record for most runs in international cricket.",
    category: "general",
  },
  {
    keywords: ["elon musk", "who is elon musk"],
    answer:
      "Elon Musk is the CEO of **Tesla** and **SpaceX**, and owner of **X** (formerly Twitter). Born June 28, 1971, South Africa.",
    category: "general",
  },
  {
    keywords: ["mahatma gandhi", "gandhi", "father of nation india"],
    answer:
      "Mahatma Gandhi (1869–1948) led India's independence movement through non-violence (Ahimsa). He is called the 'Father of the Nation'.",
    category: "general",
  },
  {
    keywords: ["rabindranath tagore", "tagore"],
    answer:
      "**Rabindranath Tagore** (1861–1941) was an Indian poet who wrote India's national anthem. Won Nobel Prize in Literature in **1913**.",
    category: "general",
  },
  {
    keywords: ["mother teresa", "who is mother teresa"],
    answer:
      "**Mother Teresa** (1910–1997) served the poor in Kolkata. Won **Nobel Peace Prize** in 1979. Canonized as a Saint in 2016.",
    category: "general",
  },
  {
    keywords: ["bhagat singh"],
    answer:
      "**Bhagat Singh** (1907–1931) was a great freedom fighter. Hanged by the British on March 23, 1931 at age 23. Called Shaheed-e-Azam.",
    category: "general",
  },
  {
    keywords: ["subhash chandra bose", "netaji", "bose"],
    answer:
      "**Subhash Chandra Bose** (Netaji) founded the Indian National Army (INA). Slogan: **'Give me blood and I will give you freedom!'**",
    category: "general",
  },

  // World History
  {
    keywords: ["world war 1", "world war i", "ww1", "first world war"],
    answer:
      "World War I lasted from **1914 to 1918**. It was fought between the Allies (UK, France, Russia, USA) and Central Powers (Germany, Austria-Hungary, Ottoman Empire). About 20 million people died.",
    category: "general",
  },
  {
    keywords: ["world war 2", "world war ii", "ww2", "second world war"],
    answer:
      "World War II lasted from **1939 to 1945**. The Allies (USA, UK, USSR) defeated the Axis (Germany, Italy, Japan). About 70–85 million people died.",
    category: "general",
  },
  {
    keywords: ["french revolution", "france revolution"],
    answer:
      "The French Revolution (1789–1799) overthrew the French monarchy. Slogan: **Liberté, Égalité, Fraternité**. Led to Napoleon Bonaparte's rise.",
    category: "general",
  },
  {
    keywords: ["cold war", "what is cold war"],
    answer:
      "The Cold War (1947–1991) was a rivalry between **USA** and **USSR**. Ended with the Soviet Union's collapse in 1991.",
    category: "general",
  },

  // Sports
  {
    keywords: ["ms dhoni", "dhoni", "who is dhoni", "mahendra singh dhoni"],
    answer:
      "**MS Dhoni** is a legendary Indian cricketer. Born July 7, 1981, Ranchi. Led India to World Cup wins: 2007 (T20), 2011 (ODI), 2013 (Champions Trophy). Called 'Captain Cool'.",
    category: "general",
  },
  {
    keywords: ["rohit sharma", "who is rohit", "hitman cricket"],
    answer:
      "**Rohit Sharma** is the current captain of Indian cricket team. Born April 30, 1987, Nagpur. Called 'The Hitman'. Only player to score 3 double centuries in ODIs.",
    category: "general",
  },
  {
    keywords: ["cristiano ronaldo", "ronaldo", "who is ronaldo"],
    answer:
      "**Cristiano Ronaldo** (CR7) is a Portuguese footballer. Born February 5, 1985. Won 5 Ballon d'Or awards. Scored 800+ career goals.",
    category: "general",
  },
  {
    keywords: ["lionel messi", "messi", "who is messi"],
    answer:
      "**Lionel Messi** is an Argentine footballer (GOAT). Born June 24, 1987. Won 8 Ballon d'Or awards and the 2022 FIFA World Cup with Argentina.",
    category: "general",
  },
  {
    keywords: ["fifa world cup 2022", "world cup 2022"],
    answer:
      "**FIFA World Cup 2022** was held in **Qatar**. **Argentina** won, defeating France 3-3 (4-2 on penalties) in the final. Messi won Golden Ball.",
    category: "general",
  },
  {
    keywords: ["icc cricket world cup 2023", "cricket world cup 2023"],
    answer:
      "**ICC Cricket World Cup 2023** was held in **India**. **Australia** won, defeating India by 6 wickets in the final at Ahmedabad.",
    category: "general",
  },
  {
    keywords: ["ipl", "indian premier league", "what is ipl"],
    answer:
      "**IPL (Indian Premier League)** is India's T20 cricket league, founded **2008** by BCCI. 10 teams. Most successful team: **Mumbai Indians** (5 titles).",
    category: "general",
  },
  {
    keywords: ["olympic games", "olympics", "olympic"],
    answer:
      "Olympic Games are held every 4 years. **Summer Olympics 2024** were in **Paris, France**. India won 6 medals.",
    category: "general",
  },

  // Technology
  {
    keywords: ["operating system", "what is os", "what is operating system"],
    answer:
      "An operating system (OS) is software that manages hardware and software resources of a computer. Examples: **Windows**, **macOS**, **Linux**, **Android**, **iOS**.",
    category: "technology",
  },
  {
    keywords: ["cloud computing", "what is cloud"],
    answer:
      "Cloud computing means storing and accessing data and programs over the internet instead of your local computer. Examples: AWS, Google Cloud, Microsoft Azure.",
    category: "technology",
  },
  {
    keywords: ["blockchain", "what is blockchain"],
    answer:
      "Blockchain is a distributed digital ledger that records transactions securely across multiple computers. It is decentralized, transparent, and tamper-proof. Used in cryptocurrency, smart contracts, and more.",
    category: "technology",
  },
  {
    keywords: ["bitcoin", "what is bitcoin", "cryptocurrency", "crypto"],
    answer:
      "Bitcoin is a decentralized digital currency created in 2009 by **Satoshi Nakamoto**. It uses blockchain technology and has a maximum supply of 21 million coins.",
    category: "technology",
  },
  {
    keywords: [
      "programming",
      "coding",
      "learn to code",
      "how to code",
      "start programming",
    ],
    answer:
      "**Best languages to start:**\n- **Python** – easiest, used in AI/data science\n- **JavaScript** – web development\n- **Java** – enterprise and Android\n\n**Free resources:** freeCodeCamp, Khan Academy, CS50 (Harvard on edX)",
    category: "technology",
  },
  {
    keywords: ["python"],
    answer:
      "Python is the world's most popular programming language. Used for Data Science, Machine Learning, Web Development (Django), and Automation.",
    category: "technology",
  },
  {
    keywords: ["javascript", "js"],
    answer:
      "JavaScript is the language of the web. Used for frontend (React), backend (Node.js), and mobile (React Native).",
    category: "technology",
  },
  {
    keywords: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "deep learning",
      "what is ai",
    ],
    answer:
      "AI (Artificial Intelligence) is the simulation of human intelligence by computers. It includes Machine Learning (learns from data), Deep Learning (neural networks), and NLP (understands language).",
    category: "technology",
  },
  {
    keywords: ["chatgpt", "what is chatgpt", "gpt"],
    answer:
      "**ChatGPT** is an AI chatbot by **OpenAI**. Uses GPT technology. Launched November 2022.",
    category: "technology",
  },
  {
    keywords: ["5g", "what is 5g", "5g technology"],
    answer:
      "**5G** is the 5th generation mobile network. Speeds up to **10 Gbps** (100x faster than 4G).",
    category: "technology",
  },

  // Full forms / Abbreviations
  {
    keywords: ["full form of pdf", "pdf full form"],
    answer: "**PDF** = Portable Document Format",
    category: "general",
  },
  {
    keywords: ["full form of wifi", "wifi full form"],
    answer: "**WiFi** = Wireless Fidelity",
    category: "general",
  },
  {
    keywords: ["full form of http", "http full form"],
    answer: "**HTTP** = HyperText Transfer Protocol. HTTPS = HTTP Secure.",
    category: "general",
  },
  {
    keywords: ["full form of rbi", "rbi full form", "what is rbi"],
    answer:
      "**RBI** = Reserve Bank of India. India's central bank, established April 1, 1935. Governor: Sanjay Malhotra (since December 2024).",
    category: "general",
  },
  {
    keywords: ["full form of un", "united nations", "what is un"],
    answer:
      "**UN** = United Nations. Founded 1945. 193 member countries. HQ: New York. Secretary-General: **António Guterres**.",
    category: "general",
  },
  {
    keywords: ["full form of who", "world health organization"],
    answer:
      "**WHO** = World Health Organization. UN health agency. HQ: Geneva, Switzerland.",
    category: "general",
  },
  {
    keywords: ["full form of nato", "nato full form", "what is nato"],
    answer:
      "**NATO** = North Atlantic Treaty Organization. Military alliance formed 1949.",
    category: "general",
  },
  {
    keywords: ["full form of brics", "brics full form", "what is brics"],
    answer:
      "**BRICS** = Brazil, Russia, India, China, South Africa. Forum of major emerging economies.",
    category: "general",
  },
  {
    keywords: ["full form of g20", "g20 full form", "what is g20"],
    answer:
      "**G20** = Group of Twenty. India held **G20 Presidency in 2023**, hosted summit in New Delhi.",
    category: "general",
  },
  {
    keywords: ["full form of upsc", "upsc", "what is upsc"],
    answer:
      "**UPSC** = Union Public Service Commission. Conducts Civil Services Exam (IAS, IPS, IFS). 3 stages: Prelims, Mains, Interview.",
    category: "general",
  },
  {
    keywords: ["full form of ias", "ias", "what is ias"],
    answer:
      "**IAS** = Indian Administrative Service. Top civil service of India, selected through UPSC.",
    category: "general",
  },
  {
    keywords: ["full form of neet", "neet exam", "what is neet"],
    answer:
      "**NEET** = National Eligibility cum Entrance Test. Entrance exam for medical (MBBS/BDS) admissions in India.",
    category: "general",
  },
  {
    keywords: ["full form of jee", "jee exam", "iit entrance"],
    answer:
      "**JEE** = Joint Entrance Examination. Entrance exam for IITs and engineering colleges in India.",
    category: "general",
  },

  // Education
  {
    keywords: [
      "study tips",
      "how to study",
      "study methods",
      "study better",
      "study technique",
      "study habits",
    ],
    answer:
      "**Effective Study Tips:**\n1. Pomodoro Technique: 25 min study, 5 min break\n2. Active Recall: test yourself instead of re-reading\n3. Spaced Repetition: review at increasing intervals\n4. Teach it: explaining deepens understanding\n5. Sleep well: memory consolidates during sleep",
    category: "education",
  },

  // Health
  {
    keywords: ["health", "healthy", "fitness", "be healthy", "health tips"],
    answer:
      "**Daily health habits:**\n- Exercise 30 min/day\n- Sleep 7–9 hours\n- Drink 2L water\n- Eat balanced meals (protein, carbs, veggies)\n- Meditate 10 min/day",
    category: "general",
  },
  {
    keywords: ["water", "h2o", "about water"],
    answer:
      "Water (H₂O) has 2 hydrogen atoms and 1 oxygen atom. Boiling point: 100°C, Freezing point: 0°C. 71% of Earth's surface is water.",
    category: "general",
  },

  // Climate
  {
    keywords: [
      "climate change",
      "global warming",
      "greenhouse",
      "greenhouse gas",
    ],
    answer:
      "Climate change refers to long-term shifts in global temperatures and weather patterns, mainly caused by burning fossil fuels which increase CO₂ levels. Earth has warmed ~1.2°C since pre-industrial times.",
    category: "science",
  },
];

export function getAIAnswer(question: string): AIResponse {
  const q = question.toLowerCase().trim();

  // Try math evaluation first
  let mathExpr = q
    .replace(/what is|calculate|solve|find|evaluate|the|value of/gi, "")
    .replace(/x/g, "*")
    .replace(/÷/g, "/")
    .replace(/[^0-9+\-*/().\s]/g, "")
    .trim();

  if (mathExpr.length > 0 && /[0-9]/.test(mathExpr)) {
    try {
      const result = new Function(`return ${mathExpr}`)();
      if (typeof result === "number" && Number.isFinite(result)) {
        return { text: String(result), category: "math" };
      }
    } catch {
      // not a valid math expression, continue to KB
    }
  }

  for (const entry of KB) {
    for (const kw of entry.keywords) {
      if (q.includes(kw)) {
        return { text: entry.answer, category: entry.category };
      }
    }
  }

  return {
    text: "I don't have enough information to answer this.",
    category: "default",
  };
}
