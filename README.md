# Navaratna - Vedic Gemstone Recommendation App

A premium full-stack Vedic Astrology (Jyotish) gemstone recommendation engine. The application determines compatible primary and secondary gemstones (Navaratnas) based on the user's birth moon sign (Rashi), aspirations, and energetic blocks while filtering out hostile planetary enmities. It also features a fully interactive gemstone activation ritual simulator.

---

## 🌟 Features

- **Astrological Recommendation Engine**: Server-side calculator that determines:
  - *Primary Stone*: Linked directly to your birth Moon Sign (Rashi) to protect your core life force.
  - *Secondary Remedial Stone*: Aligned with your specific desires (Wealth, Health, Love, Peace, Protection) and emotional blocks.
  - *Planetary Enmity Filter*: Automatically detects and replaces stones that share hostility with the primary ruling planet (e.g. replacing Blue Sapphire with Yellow Sapphire if your primary is Ruby).
- **The Navaratna Codex**: An interactive encyclopedia containing details on all 9 sacred stones, their ruling planets, deities, auspicious metal settings, correct finger positions, caution guidelines, and deep mythological origin stories.
- **Activation Ritual Simulator**: An immersive, 3-step guided simulation to spiritually "awaken" the gemstone before wearing:
  1. *Purification (Shuddhikaran)*: Cleanse the gem by pouring raw milk or Ganga water.
  2. *Energization (Prana Pratishtha)*: Recite the Sanskrit Beej Mantra. The gemstone grows and shines brighter with each chant.
  3. *Wearing (Dharan Vidhi)*: Tells you the precise day, hand finger, and metal setting required to wear the stone.
- **Cosmic Glassmorphic Design**: Custom-curated dark indigo and gold color schemes with glowing breathing gemstone lights, floating particles, star-fields, and smooth micro-animations.

---

## 🛠️ Tech Stack

- **Frontend**: Semantic HTML5, Vanilla CSS3 (Custom Variables, Flexbox/Grid, Glassmorphism, Keyframes), Modern Client-Side JavaScript (Fetch APIs, state controllers).
- **Backend**: Node.js, Express.js (static file serving, JSON parsing, API routing).
- **Database**: Local JSON storage model (`data/gemstones.json`).

---

## 📁 Project Structure

```
Hum_Pan_GemStone/
├── package.json              # Node.js configurations and dependencies
├── server.js                 # Express server boot and middleware
├── PROJECT_NOTES.md          # Architectural notes and roadmap
├── AI_USAGE.md               # AI assistance declaration
├── data/
│   └── gemstones.json        # Static JSON profiles of the 9 Navaratnas
├── routes/
│   └── api.js                # API endpoints and server-side calculation engine
└── public/                   # Static Frontend client
    ├── index.html            # Core HTML structure
    ├── style.css             # Ambient cosmic CSS styling
    └── app.js                # Frontend router and API requester
```

---

## 🚀 Installation & Local Run

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Steps
1. **Clone or navigate** to the project directory:
   ```bash
   cd Hum_Pan_GemStone
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the Express server**:
   ```bash
   npm start
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## 🔮 Astrological Mapping Guide

| Gemstone | Sanskrit Name | Planetary Lord | Primary Rashi Compatibility | Auspicious Day | Metal Setting |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ruby** | Manikya | Sun (Surya) | Leo (Simha) | Sunday | Gold / Copper |
| **Pearl** | Moti | Moon (Chandra) | Cancer (Karka) | Monday | Silver |
| **Red Coral** | Moonga | Mars (Mangala) | Aries (Mesha), Scorpio (Vrishchika) | Tuesday | Copper / Gold |
| **Emerald** | Panna | Mercury (Budha) | Gemini (Mithuna), Virgo (Kanya) | Wednesday | Gold / Silver |
| **Yellow Sapphire** | Pukhraj | Jupiter (Guru) | Sagittarius (Dhanu), Pisces (Meena) | Thursday | Gold |
| **Diamond** | Heera | Venus (Shukra) | Taurus (Vrishabha), Libra (Tula) | Friday | Platinum / Gold / Silver |
| **Blue Sapphire** | Neelam | Saturn (Shani) | Capricorn (Makara), Aquarius (Kumbha) | Saturday | Iron / Silver |
| **Hessonite** | Gomed | Rahu (North Node) | Shadow alignment | Saturday (Sunset) | Silver |
| **Cat's Eye** | Lehsuniya | Ketu (South Node) | Shadow alignment | Thursday / Tuesday | Silver |
