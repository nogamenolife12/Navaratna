const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper to read gemstones from JSON database
function getGemstonesData() {
  const filePath = path.join(__dirname, '../data/gemstones.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Map Rashi to their ruling planets and corresponding gemstone keys
const rashiPlanets = {
  Mesha: { planet: "Mars", stone: "coral" },
  Vrishabha: { planet: "Venus", stone: "diamond" },
  Mithuna: { planet: "Mercury", stone: "emerald" },
  Karka: { planet: "Moon", stone: "pearl" },
  Simha: { planet: "Sun", stone: "ruby" },
  Kanya: { planet: "Mercury", stone: "emerald" },
  Tula: { planet: "Venus", stone: "diamond" },
  Vrishchika: { planet: "Mars", stone: "coral" },
  Dhanu: { planet: "Jupiter", stone: "yellow-sapphire" },
  Makara: { planet: "Saturn", stone: "blue-sapphire" },
  Kumbha: { planet: "Saturn", stone: "blue-sapphire" },
  Meena: { planet: "Jupiter", stone: "yellow-sapphire" }
};

// Map life focus to primary planets and their gemstones
const focusStones = {
  wealth: ["yellow-sapphire", "emerald", "diamond"],
  health: ["ruby", "coral", "cats-eye"],
  love: ["diamond", "pearl"],
  peace: ["pearl", "yellow-sapphire", "cats-eye"],
  protection: ["blue-sapphire", "hessonite", "cats-eye"]
};

// Map current energy blocks to remedial gemstones
const blockStones = {
  anxiety: "pearl",
  fatigue: "coral",
  miscommunication: "emerald",
  misfortune: "blue-sapphire",
  isolation: "cats-eye"
};

// List of planetary enmities to prevent conflicting recommendations
const gemstoneEnmities = {
  ruby: ["blue-sapphire", "diamond", "hessonite", "cats-eye"],
  pearl: ["hessonite", "cats-eye"],
  coral: ["emerald"],
  emerald: ["pearl"],
  "yellow-sapphire": ["diamond", "blue-sapphire"],
  diamond: ["ruby", "pearl", "yellow-sapphire"],
  "blue-sapphire": ["ruby", "pearl", "coral", "yellow-sapphire"],
  hessonite: ["ruby", "pearl"],
  "cats-eye": ["ruby", "pearl"]
};

/**
 * Astrological Recommendation Engine
 */
function calculateRecommendations(rashi, focus, block, db) {
  // 1. Primary Stone is strictly based on Zodiac / Rashi
  const primaryId = rashiPlanets[rashi].stone;
  
  // 2. Select potential secondary stones based on focus and block
  const focusList = focusStones[focus];
  const blockStoneId = blockStones[block];
  
  // Combine candidates, prioritizing blockStone, then focusList
  let candidates = [blockStoneId, ...focusList];
  
  // 3. Filter candidates to find the first one that has NO enmity with the primary stone
  let secondaryId = "yellow-sapphire"; // default fallback
  const primaryEnmities = gemstoneEnmities[primaryId] || [];
  
  for (let cand of candidates) {
    if (cand !== primaryId && !primaryEnmities.includes(cand)) {
      secondaryId = cand;
      break;
    }
  }
  
  // Double check in case of emergency fallback conflicts
  if (secondaryId === primaryId || primaryEnmities.includes(secondaryId)) {
    const safeStones = ["emerald", "yellow-sapphire", "pearl", "coral"];
    for (let safe of safeStones) {
      if (safe !== primaryId && !primaryEnmities.includes(safe)) {
        secondaryId = safe;
        break;
      }
    }
  }
  
  return {
    primary: db[primaryId],
    secondary: db[secondaryId]
  };
}

// --- API Endpoints ---

// GET: All gemstones (Codex)
router.get('/gemstones', (req, res) => {
  try {
    const db = getGemstonesData();
    res.json(Object.values(db));
  } catch (err) {
    res.status(500).json({ error: "Failed to read gemstone database." });
  }
});

// GET: Specific gemstone details
router.get('/gemstones/:id', (req, res) => {
  try {
    const db = getGemstonesData();
    const stone = db[req.params.id];
    if (!stone) {
      return res.status(404).json({ error: `Gemstone with id '${req.params.id}' not found.` });
    }
    res.json(stone);
  } catch (err) {
    res.status(500).json({ error: "Failed to read gemstone database." });
  }
});

// POST: Recommend gemstones based on quiz input
router.post('/recommend', (req, res) => {
  const { rashi, focus, block } = req.body;
  
  if (!rashi || !focus || !block) {
    return res.status(400).json({ error: "Missing required parameters: rashi, focus, or block." });
  }
  
  if (!rashiPlanets[rashi]) {
    return res.status(400).json({ error: `Invalid rashi option: '${rashi}'` });
  }
  
  if (!focusStones[focus]) {
    return res.status(400).json({ error: `Invalid focus option: '${focus}'` });
  }
  
  if (!blockStones[block]) {
    return res.status(400).json({ error: `Invalid energy block option: '${block}'` });
  }
  
  try {
    const db = getGemstonesData();
    const result = calculateRecommendations(rashi, focus, block, db);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to compute gemstone recommendation." });
  }
});

module.exports = router;
