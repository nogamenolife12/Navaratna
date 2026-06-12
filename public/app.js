// Navaratna - Client-Side Frontend Controller

// --- Application State ---
const appState = {
  currentScreen: "screen-landing",
  userName: "Arjuna",
  selectedRashi: "Mesha",
  selectedFocus: "wealth",
  selectedBlock: "anxiety",
  quizStep: 1,
  
  // Loaded from API
  gemstones: {},
  
  // Simulator State
  selectedSimStone: null,
  cleanseProgress: 0,
  isCleansed: false,
  chantCount: 0,
  isEnergized: false
};

// --- DOM Cache ---
const screens = document.querySelectorAll(".screen");
const navButtons = {
  home: document.getElementById("nav-home"),
  codex: document.getElementById("nav-codex"),
  quiz: document.getElementById("nav-quiz")
};

// --- View Router ---
function navigateToScreen(screenId) {
  screens.forEach(s => {
    s.classList.remove("active");
  });
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add("active");
    appState.currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Update Navigation Active States
  Object.values(navButtons).forEach(btn => btn.classList.remove("active"));
  if (screenId === "screen-landing") {
    navButtons.home.classList.add("active");
  } else if (screenId === "screen-codex") {
    navButtons.codex.classList.add("active");
  } else if (screenId === "screen-quiz") {
    navButtons.quiz.classList.add("active");
  }
}

// --- Fetch Gemstones from API ---
async function fetchGemstones() {
  try {
    const res = await fetch('/api/gemstones');
    if (!res.ok) throw new Error("API request failed");
    const list = await res.json();
    
    // Map array to object with key ids for easy client referencing
    appState.gemstones = {};
    list.forEach(stone => {
      appState.gemstones[stone.id] = stone;
    });
    console.log("Navaratna gemstones loaded successfully.");
  } catch (err) {
    console.error("Error loading gemstones database from API:", err);
    alert("Could not connect to Navaratna Astrological Services. Please check if the server is running.");
  }
}

// --- Event Handlers Initialization ---
function initNavigation() {
  document.getElementById("logo-button").addEventListener("click", () => navigateToScreen("screen-landing"));
  navButtons.home.addEventListener("click", () => navigateToScreen("screen-landing"));
  navButtons.codex.addEventListener("click", () => {
    renderCodexGrid();
    navigateToScreen("screen-codex");
  });
  navButtons.quiz.addEventListener("click", () => {
    resetQuiz();
    navigateToScreen("screen-quiz");
  });
  
  document.getElementById("btn-start-quiz").addEventListener("click", () => {
    resetQuiz();
    navigateToScreen("screen-quiz");
  });
  document.getElementById("btn-view-codex").addEventListener("click", () => {
    renderCodexGrid();
    navigateToScreen("screen-codex");
  });
  document.getElementById("btn-rec-to-codex").addEventListener("click", () => {
    renderCodexGrid();
    navigateToScreen("screen-codex");
  });
  document.getElementById("btn-retake-quiz").addEventListener("click", () => {
    resetQuiz();
    navigateToScreen("screen-quiz");
  });
  
  // Landing Orbit showcase clicks
  document.querySelectorAll(".orbiting-gem").forEach(el => {
    el.addEventListener("click", (e) => {
      const stoneKey = e.currentTarget.getAttribute("data-gem");
      openCodexDialog(stoneKey);
    });
  });
}

// --- Quiz State Controller ---
function resetQuiz() {
  appState.quizStep = 1;
  document.getElementById("user-name").value = "";
  document.getElementById("rashi-mesha").checked = true;
  document.getElementById("focus-wealth").checked = true;
  document.getElementById("block-anxiety").checked = true;
  updateQuizUI();
}

function updateQuizUI() {
  const steps = document.querySelectorAll(".quiz-step");
  steps.forEach(s => s.classList.remove("active"));
  
  const currentStepEl = document.querySelector(`.quiz-step[data-step="${appState.quizStep}"]`);
  if (currentStepEl) {
    currentStepEl.classList.add("active");
  }
  
  const progressPercent = (appState.quizStep / 4) * 100;
  document.getElementById("quiz-progress").style.width = `${progressPercent}%`;
}

function initQuizHandlers() {
  // Next Step triggers
  document.querySelectorAll(".btn-next-step").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const nextStep = parseInt(e.currentTarget.getAttribute("data-next"));
      
      if (appState.quizStep === 1) {
        const nameInput = document.getElementById("user-name").value.trim();
        if (!nameInput) {
          alert("Please enter your name to align your energies.");
          return;
        }
        appState.userName = nameInput;
      }
      
      appState.quizStep = nextStep;
      updateQuizUI();
    });
  });
  
  // Prev Step triggers
  document.querySelectorAll(".btn-prev-step").forEach(btn => {
    btn.addEventListener("click", (e) => {
      appState.quizStep = parseInt(e.currentTarget.getAttribute("data-prev"));
      updateQuizUI();
    });
  });
  
  // Submit Quiz trigger -> Calls API for recommendation
  document.getElementById("btn-submit-quiz").addEventListener("click", async () => {
    appState.selectedRashi = document.querySelector('input[name="user-rashi"]:checked').value;
    appState.selectedFocus = document.querySelector('input[name="user-focus"]:checked').value;
    appState.selectedBlock = document.querySelector('input[name="user-block"]:checked').value;
    
    // Set loading indicator
    const submitBtn = document.getElementById("btn-submit-quiz");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Consulting the Stars...";
    submitBtn.disabled = true;
    
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rashi: appState.selectedRashi,
          focus: appState.selectedFocus,
          block: appState.selectedBlock
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to retrieve recommendations from the backend.");
      }
      
      const recommendations = await response.json();
      
      // Render computed outputs
      renderRecommendations(recommendations);
      navigateToScreen("screen-recommendation");
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      alert("The astrological alignment server is currently unresponsive. Please try again.");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// --- Render Recommendation Screen ---
function renderRecommendations(recs) {
  // Set Profile labels
  document.getElementById("rec-user-name").textContent = appState.userName;
  document.getElementById("rec-rashi").textContent = appState.selectedRashi;
  
  // Primary gemstone details
  const pCard = document.getElementById("rec-primary-card");
  pCard.className = `rec-card primary-gem-card glass-card ${recs.primary.themeClass}`;
  document.getElementById("rec-primary-name").textContent = recs.primary.name;
  document.getElementById("rec-primary-sub").textContent = `Ruler: ${recs.primary.planet}`;
  document.getElementById("rec-primary-role").textContent = recs.primary.benefits;
  document.getElementById("rec-primary-mitigates").textContent = recs.primary.caution;
  
  const pVisual = document.getElementById("rec-primary-visual");
  pVisual.querySelector(".visual-gem-icon").textContent = recs.primary.icon;
  pVisual.querySelector(".visual-glow").style.backgroundColor = `var(--gem-${recs.primary.id})`;
  
  document.getElementById("btn-primary-details").setAttribute("data-stone", recs.primary.id);
  document.getElementById("btn-primary-activate").setAttribute("data-stone", recs.primary.id);
  
  // Secondary gemstone details
  const sCard = document.getElementById("rec-secondary-card");
  sCard.className = `rec-card secondary-gem-card glass-card ${recs.secondary.themeClass}`;
  document.getElementById("rec-secondary-name").textContent = recs.secondary.name;
  document.getElementById("rec-secondary-sub").textContent = `Ruler: ${recs.secondary.planet}`;
  document.getElementById("rec-secondary-role").textContent = `Specifically strengthens your focus on ${appState.selectedFocus.toUpperCase()} and clears blockages.`;
  document.getElementById("rec-secondary-mitigates").textContent = recs.secondary.benefits;
  
  const sVisual = document.getElementById("rec-secondary-visual");
  sVisual.querySelector(".visual-gem-icon").textContent = recs.secondary.icon;
  sVisual.querySelector(".visual-glow").style.backgroundColor = `var(--gem-${recs.secondary.id})`;
  
  document.getElementById("btn-secondary-details").setAttribute("data-stone", recs.secondary.id);
  document.getElementById("btn-secondary-activate").setAttribute("data-stone", recs.secondary.id);
  
  // Bind handlers
  document.querySelectorAll(".rec-card .btn-view-details").forEach(btn => {
    btn.onclick = (e) => {
      const stoneKey = e.currentTarget.getAttribute("data-stone");
      openCodexDialog(stoneKey);
    };
  });
  
  document.querySelectorAll(".rec-card .btn-activate-gem").forEach(btn => {
    btn.onclick = (e) => {
      const stoneKey = e.currentTarget.getAttribute("data-stone");
      startRitualSimulator(stoneKey);
    };
  });
}

// --- Render Navaratna Codex Grid ---
let activeFilter = "all";
let activeSearchQuery = "";

function renderCodexGrid() {
  const container = document.getElementById("codex-grid-container");
  container.innerHTML = "";
  
  const stones = Object.values(appState.gemstones);
  if (stones.length === 0) {
    container.innerHTML = `<div class="no-results glass-card"><p>Loading Codex assets...</p></div>`;
    return;
  }
  
  stones.forEach(stone => {
    const searchMatch = stone.name.toLowerCase().includes(activeSearchQuery) || 
                        stone.planet.toLowerCase().includes(activeSearchQuery) ||
                        stone.description.toLowerCase().includes(activeSearchQuery);
    
    let categoryMatch = true;
    if (activeFilter === "benefic") {
      categoryMatch = stone.category === "benefic";
    } else if (activeFilter === "shadow") {
      categoryMatch = stone.category === "shadow";
    } else if (activeFilter === "powerful") {
      categoryMatch = stone.powerful === true;
    }
    
    if (searchMatch && categoryMatch) {
      const card = document.createElement("div");
      card.className = `codex-card glass-card ${stone.themeClass}`;
      card.style.setProperty("--gem-color", `var(--gem-${stone.id})`);
      
      card.innerHTML = `
        <div class="codex-card-header">
          <div class="codex-card-title">
            <h3>${stone.name}</h3>
            <span>Ruler: ${stone.planet}</span>
          </div>
          <div class="codex-card-icon">${stone.icon}</div>
        </div>
        <p class="codex-card-desc">${stone.description}</p>
        <div class="codex-card-meta">
          <div class="meta-item">
            <span class="meta-lbl">Auspicious Day</span>
            <span class="meta-val">${stone.day}</span>
          </div>
          <div class="meta-item">
            <span class="meta-lbl">Metal Setting</span>
            <span class="meta-val">${stone.metal}</span>
          </div>
        </div>
        <button class="btn btn-gold btn-card-details" data-stone="${stone.id}">View Details</button>
      `;
      
      card.querySelector(".btn-card-details").onclick = () => openCodexDialog(stone.id);
      container.appendChild(card);
    }
  });
  
  if (container.children.length === 0) {
    container.innerHTML = `<div class="no-results glass-card"><p>No gemstones align with your query. Try resetting filters.</p></div>`;
  }
}

function initCodexControls() {
  const searchInput = document.getElementById("codex-search");
  searchInput.addEventListener("input", (e) => {
    activeSearchQuery = e.target.value.toLowerCase().trim();
    renderCodexGrid();
  });
  
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      activeFilter = e.currentTarget.getAttribute("data-filter");
      renderCodexGrid();
    });
  });
}

// --- Native Dialog (Modal) Controller ---
const codexDialog = document.getElementById("codex-dialog");

function openCodexDialog(stoneId) {
  const stone = appState.gemstones[stoneId];
  if (!stone) return;
  
  codexDialog.className = `codex-detail-dialog glass-card ${stone.themeClass}`;
  codexDialog.style.setProperty("--gem-color", `var(--gem-${stone.id})`);
  
  document.getElementById("dialog-gem-name").textContent = stone.name;
  document.getElementById("dialog-gem-icon").textContent = stone.icon;
  document.getElementById("dialog-fact-planet").textContent = stone.planet;
  document.getElementById("dialog-fact-day").textContent = stone.day;
  document.getElementById("dialog-fact-metal").textContent = stone.metal;
  document.getElementById("dialog-fact-finger").textContent = stone.finger;
  
  // Set zodiac compatibility
  // Rashi list matching the stone id
  const compatibleRashis = [
    { name: "Mesha", stone: "coral" },
    { name: "Vrishabha", stone: "diamond" },
    { name: "Mithuna", stone: "emerald" },
    { name: "Karka", stone: "pearl" },
    { name: "Simha", stone: "ruby" },
    { name: "Kanya", stone: "emerald" },
    { name: "Tula", stone: "diamond" },
    { name: "Vrishchika", stone: "coral" },
    { name: "Dhanu", stone: "yellow-sapphire" },
    { name: "Makara", stone: "blue-sapphire" },
    { name: "Kumbha", stone: "blue-sapphire" },
    { name: "Meena", stone: "yellow-sapphire" }
  ].filter(r => r.stone === stone.id).map(r => r.name).join(", ");
  
  document.getElementById("dialog-fact-rashi").textContent = compatibleRashis || "Remedial Alignment";
  document.getElementById("dialog-gem-benefits").textContent = stone.benefits;
  document.getElementById("dialog-gem-mythology").textContent = stone.mythology;
  document.getElementById("dialog-gem-mantra").textContent = stone.mantraSanskrit;
  document.getElementById("dialog-gem-caution").textContent = stone.caution;
  
  const actBtn = document.getElementById("btn-dialog-activate");
  actBtn.onclick = () => {
    codexDialog.close();
    startRitualSimulator(stone.id);
  };
  
  codexDialog.showModal();
}

function initDialogControls() {
  document.getElementById("btn-close-dialog").addEventListener("click", () => {
    codexDialog.close();
  });
  
  codexDialog.addEventListener("click", (e) => {
    const rect = codexDialog.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      codexDialog.close();
    }
  });
}

// --- Ritual Simulator Controller ---
function startRitualSimulator(stoneId) {
  const stone = appState.gemstones[stoneId];
  if (!stone) return;
  
  appState.selectedSimStone = stone;
  navigateToScreen("screen-simulator");
  
  const simLayout = document.getElementById("screen-simulator");
  simLayout.className = `screen active ${stone.themeClass}`;
  simLayout.style.setProperty("--gem-color", `var(--gem-${stone.id})`);
  
  const simGem = document.getElementById("sim-gemstone");
  simGem.querySelector(".sim-gem-icon").textContent = stone.icon;
  simGem.querySelector(".sim-glow-effect").style.backgroundColor = `var(--gem-${stone.id})`;
  
  document.getElementById("sim-info-name").textContent = stone.name;
  document.getElementById("sim-info-ruler").textContent = `Planetary Lord: ${stone.planet}`;
  document.getElementById("sim-info-myth").textContent = stone.mythology;
  document.getElementById("sim-info-caution").textContent = stone.caution;
  
  document.getElementById("sim-mantra-sanskrit").textContent = stone.mantraSanskrit;
  document.getElementById("sim-mantra-translit").textContent = `"${stone.mantraTranslit}"`;
  
  document.getElementById("sim-wear-day").textContent = `${stone.day} Morning (at Sunrise)`;
  document.getElementById("sim-wear-finger").textContent = stone.finger;
  document.getElementById("sim-wear-metal").textContent = stone.metal;
  
  resetSimulatorRitual();
}

function resetSimulatorRitual() {
  appState.cleanseProgress = 0;
  appState.isCleansed = false;
  appState.chantCount = 0;
  appState.isEnergized = false;
  
  document.getElementById("cleansing-progress").style.width = "0%";
  document.getElementById("cleansing-status").textContent = "Awaiting Purification";
  document.getElementById("btn-finish-step1").disabled = true;
  document.getElementById("cleanse-liquid").className = "cleanse-liquid";
  
  document.getElementById("chant-count").textContent = "0";
  document.getElementById("btn-finish-step2").disabled = true;
  document.getElementById("btn-chant").disabled = false;
  document.getElementById("chant-prompt-msg").textContent = "Tap the button to recite the mantra. Feel the vibration.";
  document.getElementById("sim-gemstone").style.transform = "scale(1)";
  document.getElementById("sim-gemstone").querySelector(".sim-glow-effect").style.filter = "blur(18px)";
  
  switchSimulatorPane(1);
}

function switchSimulatorPane(stepNum) {
  document.querySelectorAll(".rit-step-dot").forEach(dot => {
    dot.classList.remove("active");
  });
  document.querySelector(`.rit-step-dot[data-step="${stepNum}"]`).classList.add("active");
  
  document.querySelectorAll(".ritual-pane").forEach(pane => {
    pane.classList.remove("active");
  });
  if (stepNum === 1) {
    document.getElementById("pane-purification").classList.add("active");
  } else if (stepNum === 2) {
    document.getElementById("pane-energize").classList.add("active");
  } else if (stepNum === 3) {
    document.getElementById("pane-wear").classList.add("active");
  }
}

function initSimulatorControls() {
  const pourMilkBtn = document.getElementById("btn-pour-milk");
  const pourWaterBtn = document.getElementById("btn-pour-water");
  const liquidEl = document.getElementById("cleanse-liquid");
  const step1Proceed = document.getElementById("btn-finish-step1");
  
  pourMilkBtn.addEventListener("click", () => {
    liquidEl.className = "cleanse-liquid pour-milk";
    simulateCleansing("purified in Raw Milk");
  });
  
  pourWaterBtn.addEventListener("click", () => {
    liquidEl.className = "cleanse-liquid pour-water";
    simulateCleansing("cleansed with Ganga Water");
  });
  
  function simulateCleansing(liquidType) {
    document.getElementById("cleansing-status").textContent = `Pouring, purifying...`;
    pourMilkBtn.disabled = true;
    pourWaterBtn.disabled = true;
    
    let width = 0;
    const interval = setInterval(() => {
      width += 10;
      document.getElementById("cleansing-progress").style.width = `${width}%`;
      if (width >= 100) {
        clearInterval(interval);
        document.getElementById("cleansing-status").textContent = `Gemstone successfully ${liquidType}!`;
        appState.isCleansed = true;
        step1Proceed.disabled = false;
        pourMilkBtn.disabled = false;
        pourWaterBtn.disabled = false;
      }
    }, 150);
  }
  
  step1Proceed.addEventListener("click", () => {
    liquidEl.className = "cleanse-liquid";
    switchSimulatorPane(2);
  });
  
  const chantBtn = document.getElementById("btn-chant");
  const step2Proceed = document.getElementById("btn-finish-step2");
  
  chantBtn.addEventListener("click", () => {
    if (appState.chantCount >= 9) return;
    
    appState.chantCount++;
    document.getElementById("chant-count").textContent = appState.chantCount;
    
    const scale = 1 + (appState.chantCount * 0.04);
    const blurGlow = 18 + (appState.chantCount * 2);
    const gemVisual = document.getElementById("sim-gemstone");
    gemVisual.style.transform = `scale(${scale})`;
    gemVisual.querySelector(".sim-glow-effect").style.filter = `blur(${blurGlow}px)`;
    
    gemVisual.style.transition = "transform 0.15s ease";
    setTimeout(() => {
      gemVisual.style.transition = "transform 0.5s ease";
    }, 150);
    
    const promptMsg = document.getElementById("chant-prompt-msg");
    if (appState.chantCount === 3) {
      promptMsg.textContent = "Planetary frequencies alignment in progress... Chant again.";
    } else if (appState.chantCount === 6) {
      promptMsg.textContent = "The gemstone is absorbing the seed mantra energy. Almost fully charged!";
    } else if (appState.chantCount === 9) {
      promptMsg.textContent = "Mantra recitation complete. The gemstone glows with divine cosmic force!";
      chantBtn.disabled = true;
      appState.isEnergized = true;
      step2Proceed.disabled = false;
    }
  });
  
  step2Proceed.addEventListener("click", () => {
    switchSimulatorPane(3);
  });
  
  const wearGemBtn = document.getElementById("btn-wear-gem");
  const successOverlay = document.getElementById("success-overlay");
  
  wearGemBtn.addEventListener("click", () => {
    const stone = appState.selectedSimStone;
    if (!stone) return;
    
    const msg = `The ${stone.name} is now purified, fully energized, and metaphysically aligned with your aura. May the planetary ruler, ${stone.planet}, guide you with auspicious energy, clear your blockages, and light your path, ${appState.userName}!`;
    document.getElementById("success-message").textContent = msg;
    
    successOverlay.classList.add("active");
  });
  
  document.getElementById("btn-close-success").addEventListener("click", () => {
    successOverlay.classList.remove("active");
    navigateToScreen("screen-codex");
    renderCodexGrid();
  });
}

// --- App Bootstrap ---
document.addEventListener("DOMContentLoaded", async () => {
  initNavigation();
  initQuizHandlers();
  initCodexControls();
  initDialogControls();
  initSimulatorControls();
  
  // Fetch gemstones from database backend first
  await fetchGemstones();
  
  // Render default landing page
  navigateToScreen("screen-landing");
});
