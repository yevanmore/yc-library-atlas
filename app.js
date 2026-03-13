(function () {
  const STORAGE_KEY = "yc-library-atlas-state-v1";
  const HISTORY_LIMIT = 240;

  const PHASES = [
    {
      id: "orientation",
      name: "Phase 1",
      title: "Orientation",
      summary: "Why startups work, how YC thinks, and how founders frame the game.",
      categories: [
        "Becoming a Founder",
        "Founder Psychology",
        "Founder Stories",
        "Company Stages",
        "Getting Started",
        "Working at a Startup",
        "YC",
        "Applying to YC",
        "College Students",
        "Academia to Startup",
        "Women Founders",
        "Non-Technical Founders",
      ],
    },
    {
      id: "ideas",
      name: "Phase 2",
      title: "Ideas and Markets",
      summary: "Problem choice, startup ideas, co-founders, and market selection.",
      categories: [
        "Startup Ideas",
        "Business Models",
        "Company Categories",
        "Co-Founders",
        "Problems to Solve",
        "Consumer",
        "B2B",
        "Real Estate",
        "Monetization",
      ],
    },
    {
      id: "build",
      name: "Phase 3",
      title: "Build the Product",
      summary: "Product craft, design taste, technical execution, and building speed.",
      categories: [
        "Product",
        "Building Product",
        "Design",
        "Technical",
        "Artificial Intelligence",
        "Feature Prioritization",
        "Engineering",
        "UX + Design",
        "MVP",
        "Launch",
      ],
    },
    {
      id: "users",
      name: "Phase 4",
      title: "Users and Growth",
      summary: "Talking to users, finding product market fit, distribution, and growth.",
      categories: [
        "Customers",
        "Talking to Users",
        "Product Market Fit",
        "Growth",
        "International",
        "Retention",
        "Experimentation",
        "Enterprise Sales",
        "Marketing",
        "KPI",
        "Growth Stage",
        "Press",
      ],
    },
    {
      id: "money",
      name: "Phase 5",
      title: "Fundraise and Survive",
      summary: "Fundraising, finance, legal basics, and staying alive long enough to learn.",
      categories: [
        "Fundraising + Investors",
        "Fundraising",
        "Finance",
        "Legal",
        "Unit Economics",
        "Early Stage",
        "Staying Alive",
        "Investors",
        "Pitch Deck",
        "Series A",
        "Seed Round",
        "Fundraising Docs",
        "Safes",
        "Valuations",
        "Stock Equity",
        "Cash Burn",
      ],
    },
    {
      id: "company",
      name: "Phase 6",
      title: "Build the Company",
      summary: "Hiring, management, people ops, and turning a startup into a team.",
      categories: [
        "People",
        "Management",
        "Office Hours",
        "Hiring",
        "Leadership",
        "Motivation",
        "Decision Making",
        "Culture",
        "Recruiting",
        "Board Management",
        "CEO",
        "CTO",
        "Compensation",
        "Diversity + Inclusion",
        "Mental Health",
        "Time Management",
        "Advisers",
        "Negotiation",
      ],
    },
    {
      id: "special",
      name: "Phase 7",
      title: "Special Topics",
      summary: "Everything else in the library that does not fit one clean operating lane.",
      categories: [],
    },
  ];

  const MEDIA_LABEL = {
    Video: "Watch",
    Blog: "Read",
    External: "Open",
  };

  const MEDIA_CLASS = {
    Video: "is-video",
    Blog: "is-blog",
    External: "is-external",
  };

  const ORDERING_LABEL = {
    "video-first": "Video first",
    "curriculum-first": "Curriculum first",
    balanced: "Balanced",
  };

  const MOODS = [
    {
      id: "surprise",
      title: "Surprise Me",
      description: "No syllabus. Just pull something sharp from anywhere in the library.",
      phaseWeights: {
        orientation: 1.2,
        ideas: 1.1,
        build: 1.1,
        users: 1.1,
        money: 1,
        company: 1,
        special: 1.05,
      },
      mediaWeights: { Video: 1.2, Blog: 1.05, External: 0.9 },
      revisitMultiplier: 0.42,
      curriculumBonus: 0.35,
      featureMultiplier: 0.2,
    },
    {
      id: "big-picture",
      title: "Big Picture",
      description: "Founder energy, mental models, and stories that widen the frame.",
      phaseWeights: {
        orientation: 1.8,
        ideas: 1.1,
        build: 0.9,
        users: 1,
        money: 0.95,
        company: 1,
        special: 1.25,
      },
      mediaWeights: { Video: 1.1, Blog: 1.2, External: 1 },
      revisitMultiplier: 0.38,
      curriculumBonus: 0.2,
      featureMultiplier: 0.16,
    },
    {
      id: "build",
      title: "Build Mode",
      description: "Product, engineering, design, and getting from idea to something real.",
      phaseWeights: {
        orientation: 0.9,
        ideas: 1,
        build: 1.9,
        users: 1.1,
        money: 0.75,
        company: 0.8,
        special: 0.9,
      },
      mediaWeights: { Video: 1.18, Blog: 0.95, External: 0.9 },
      revisitMultiplier: 0.35,
      curriculumBonus: 0.25,
      featureMultiplier: 0.18,
    },
    {
      id: "users",
      title: "Find Users",
      description: "Customers, PMF, growth, and the messier parts of distribution.",
      phaseWeights: {
        orientation: 0.95,
        ideas: 1.05,
        build: 1.05,
        users: 1.9,
        money: 0.85,
        company: 0.85,
        special: 0.9,
      },
      mediaWeights: { Video: 1.12, Blog: 1.05, External: 0.95 },
      revisitMultiplier: 0.35,
      curriculumBonus: 0.25,
      featureMultiplier: 0.18,
    },
    {
      id: "money",
      title: "Money Brain",
      description: "Fundraising, survival, finance, and the practical side of staying alive.",
      phaseWeights: {
        orientation: 0.85,
        ideas: 0.95,
        build: 0.8,
        users: 0.95,
        money: 2,
        company: 0.95,
        special: 0.95,
      },
      mediaWeights: { Video: 1.05, Blog: 1.12, External: 1.1 },
      revisitMultiplier: 0.36,
      curriculumBonus: 0.22,
      featureMultiplier: 0.16,
    },
    {
      id: "people",
      title: "People Day",
      description: "Management, hiring, team dynamics, and startup-life tradeoffs.",
      phaseWeights: {
        orientation: 1.25,
        ideas: 0.85,
        build: 0.8,
        users: 0.9,
        money: 0.85,
        company: 1.95,
        special: 0.95,
      },
      mediaWeights: { Video: 1.14, Blog: 1.02, External: 0.92 },
      revisitMultiplier: 0.35,
      curriculumBonus: 0.2,
      featureMultiplier: 0.16,
    },
    {
      id: "light",
      title: "Light Browse",
      description: "Lower-friction reading, clean hits, and easier entry points for low-energy days.",
      phaseWeights: {
        orientation: 1.15,
        ideas: 1,
        build: 0.95,
        users: 1,
        money: 0.95,
        company: 1,
        special: 1.2,
      },
      mediaWeights: { Video: 0.85, Blog: 1.7, External: 1.25 },
      revisitMultiplier: 0.28,
      curriculumBonus: 0.15,
      featureMultiplier: 0.12,
    },
  ];

  const EMPTY_DATA = {
    items: [],
    counts: { items: 0, videos: 0, blogs: 0, external: 0, categories: 0 },
    generatedAt: "",
    sourceUrl: "https://www.ycombinator.com/library/search",
  };

  const rawData = window.YC_LIBRARY_DATA || EMPTY_DATA;
  const phaseLookup = new Map();
  const phaseMap = new Map(PHASES.map((phase, index) => [phase.id, { ...phase, index }]));
  const moodMap = new Map(MOODS.map((mood) => [mood.id, mood]));
  const CATEGORY_WEIGHTS = {
    "Becoming a Founder": 2,
    "Founder Psychology": 1,
    "Founder Stories": 1,
    "Company Stages": 1,
    "Working at a Startup": 2,
    YC: 1,
    "Applying to YC": 1,
    "College Students": 2,
    "Academia to Startup": 2,
    "Women Founders": 1,
    "Non-Technical Founders": 2,
  };

  PHASES.forEach((phase) => {
    phase.categories.forEach((category) => {
      phaseLookup.set(category, phase.id);
    });
  });

  const items = (rawData.items || []).map((item, index) => {
    const phaseId = resolvePhase(item.categories || []);
    const phase = phaseMap.get(phaseId);
    return {
      ...item,
      phaseId,
      phaseIndex: phase.index,
      phaseTitle: phase.title,
      phaseName: `${phase.name} · ${phase.title}`,
      resourceUrl: item.resourceUrl || item.ycUrl,
      catalogIndex: index + 1,
      searchBlob: [
        item.title,
        item.author,
        ...(item.categories || []),
        ...(item.subcategories || []),
        item.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  });
  const itemById = new Map(items.map((item) => [item.id, item]));

  const state = loadState();
  const runtime = {
    remoteAvailable: false,
    saveStatus: "Loading saved history…",
    captureFeedback: "",
  };
  let saveTimer = 0;
  const els = getElements();

  fillPhaseOptions();
  syncControls();
  bindEvents();
  render();
  hydrateRemoteState().finally(() => {
    consumeExternalCapture();
  });

  function resolvePhase(categories) {
    let bestPhaseId = "special";
    let bestScore = 0;
    let bestStrongestWeight = 0;

    for (const phase of PHASES) {
      if (phase.id === "special") {
        continue;
      }

      let score = 0;
      let strongestWeight = 0;

      for (const category of categories) {
        if (phaseLookup.get(category) !== phase.id) {
          continue;
        }

        const weight = CATEGORY_WEIGHTS[category] || 3;
        score += weight;
        strongestWeight = Math.max(strongestWeight, weight);
      }

      if (
        score > bestScore ||
        (score === bestScore &&
          strongestWeight > bestStrongestWeight) ||
        (score === bestScore &&
          strongestWeight === bestStrongestWeight &&
          score > 0 &&
          phaseMap.get(phase.id).index < phaseMap.get(bestPhaseId).index)
      ) {
        bestPhaseId = phase.id;
        bestScore = score;
        bestStrongestWeight = strongestWeight;
      }
    }

    return bestPhaseId;
  }

  function getElements() {
    return {
      heroStats: document.getElementById("heroStats"),
      buildStamp: document.getElementById("buildStamp"),
      startDate: document.getElementById("startDate"),
      itemsPerDay: document.getElementById("itemsPerDay"),
      orderingMode: document.getElementById("orderingMode"),
      weekdaysOnly: document.getElementById("weekdaysOnly"),
      overviewGrid: document.getElementById("overviewGrid"),
      todayPanel: document.getElementById("todayPanel"),
      englishPanel: document.getElementById("englishPanel"),
      phaseGrid: document.getElementById("phaseGrid"),
      scheduleMap: document.getElementById("scheduleMap"),
      scheduleSummary: document.getElementById("scheduleSummary"),
      catalogSearch: document.getElementById("catalogSearch"),
      catalogMedia: document.getElementById("catalogMedia"),
      catalogPhase: document.getElementById("catalogPhase"),
      catalogStatus: document.getElementById("catalogStatus"),
      catalogCount: document.getElementById("catalogCount"),
      catalogList: document.getElementById("catalogList"),
      resetProgress: document.getElementById("resetProgress"),
      jumpToActiveDay: document.getElementById("jumpToActiveDay"),
      saveStatus: document.getElementById("saveStatus"),
    };
  }

  function fillPhaseOptions() {
    const options = ['<option value="all">All phases</option>']
      .concat(
        PHASES.map(
          (phase) =>
            `<option value="${phase.id}">${escapeHtml(phase.name)} · ${escapeHtml(
              phase.title
            )}</option>`
        )
      )
      .join("");
    els.catalogPhase.innerHTML = options;
  }

  function syncControls() {
    els.startDate.value = state.startDate;
    els.itemsPerDay.value = String(state.itemsPerDay);
    els.orderingMode.value = state.orderingMode;
    els.weekdaysOnly.checked = state.weekdaysOnly;
    els.catalogSearch.value = state.catalogSearch;
    els.catalogMedia.value = state.catalogMedia;
    els.catalogPhase.value = state.catalogPhase;
    els.catalogStatus.value = state.catalogStatus;
  }

  function bindEvents() {
    els.startDate.addEventListener("change", (event) => {
      state.startDate = event.target.value || dateToISO(todayLocal());
      persistState();
      render();
    });

    els.itemsPerDay.addEventListener("change", (event) => {
      state.itemsPerDay = clampNumber(event.target.value, 1, 4, 1);
      state.wanderDeckIds = [];
      persistState();
      render();
    });

    els.orderingMode.addEventListener("change", (event) => {
      state.orderingMode = event.target.value;
      persistState();
      render();
    });

    els.weekdaysOnly.addEventListener("change", (event) => {
      state.weekdaysOnly = event.target.checked;
      persistState();
      render();
    });

    els.catalogSearch.addEventListener("input", (event) => {
      state.catalogSearch = event.target.value;
      persistState();
      render();
    });

    els.catalogMedia.addEventListener("change", (event) => {
      state.catalogMedia = event.target.value;
      persistState();
      render();
    });

    els.catalogPhase.addEventListener("change", (event) => {
      state.catalogPhase = event.target.value;
      persistState();
      render();
    });

    els.catalogStatus.addEventListener("change", (event) => {
      state.catalogStatus = event.target.value;
      persistState();
      render();
    });

    els.resetProgress.addEventListener("click", () => {
      const confirmed = window.confirm("Reset completed, seen, and saved wandering history for this page?");
      if (!confirmed) {
        return;
      }
      state.completedIds = [];
      state.sampledIds = [];
      state.wanderDeckIds = [];
      state.history = [];
      state.captureQuery = "";
      persistState();
      render();
    });

    els.jumpToActiveDay.addEventListener("click", () => {
      const target = document.querySelector(".day-card.is-active") || document.querySelector(".day-card");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    document.body.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-item-checkbox]");
      if (!checkbox) {
        return;
      }

      const itemId = Number(checkbox.dataset.itemId);
      if (checkbox.checked) {
        if (!markItemDone(itemId)) {
          return;
        }
      } else {
        if (!clearDone(itemId)) {
          return;
        }
      }

      persistState();
      render();
    });

    document.body.addEventListener("click", (event) => {
      const openLink = event.target.closest("[data-item-open]");
      if (openLink) {
        const itemId = Number(openLink.dataset.itemId);
        if (markItemSampled(itemId)) {
          persistState();
          render();
        }
        return;
      }

      const moodButton = event.target.closest("[data-mood-id]");
      if (moodButton) {
        state.moodId = moodButton.dataset.moodId;
        state.wanderDeckIds = [];
        persistState();
        render();
        return;
      }

      const shuffleButton = event.target.closest("[data-wander-shuffle]");
      if (shuffleButton) {
        state.wanderDeckIds = [];
        persistState();
        render();
        return;
      }

      const surpriseButton = event.target.closest("[data-wander-surprise]");
      if (surpriseButton) {
        state.moodId = "surprise";
        state.wanderDeckIds = [];
        persistState();
        render();
        return;
      }

      const captureFind = event.target.closest("[data-capture-find]");
      if (captureFind) {
        render();
        return;
      }

      const captureAction = event.target.closest("[data-capture-action]");
      if (captureAction) {
        const itemId = Number(captureAction.dataset.itemId);
        const action = captureAction.dataset.captureAction;
        applyCaptureAction(itemId, action);
        return;
      }

      const phaseButton = event.target.closest("[data-phase-filter]");
      if (phaseButton) {
        state.catalogPhase = phaseButton.dataset.phaseFilter;
        els.catalogPhase.value = state.catalogPhase;
        persistState();
        render();
        document.getElementById("catalogList").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    document.body.addEventListener("input", (event) => {
      const captureInput = event.target.closest("[data-capture-input]");
      if (!captureInput) {
        return;
      }

      state.captureQuery = captureInput.value;
      runtime.captureFeedback = "";
      persistState();
      if (!state.captureQuery.trim()) {
        render();
      }
    });
  }

  function loadState() {
    const today = dateToISO(todayLocal());
    const fallback = {
      startDate: today,
      itemsPerDay: 1,
      orderingMode: "video-first",
      weekdaysOnly: false,
      completedIds: [],
      sampledIds: [],
      moodId: "surprise",
      wanderDeckIds: [],
      wanderDeckMood: "surprise",
      history: [],
      captureQuery: "",
      catalogSearch: "",
      catalogMedia: "all",
      catalogPhase: "all",
      catalogStatus: "all",
    };

    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      return sanitizePersistedState(parsed, fallback);
    } catch (error) {
      return fallback;
    }
  }

  function persistState() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(extractPersistedState(state)));
    queueRemoteSave();
  }

  function sanitizePersistedState(parsed, fallback) {
    if (!parsed || typeof parsed !== "object") {
      return { ...fallback };
    }

    return {
      ...fallback,
      ...parsed,
      startDate: isISODate(parsed.startDate) ? parsed.startDate : fallback.startDate,
      itemsPerDay: clampNumber(parsed.itemsPerDay, 1, 4, fallback.itemsPerDay),
      orderingMode: ORDERING_LABEL[parsed.orderingMode] ? parsed.orderingMode : fallback.orderingMode,
      weekdaysOnly: Boolean(parsed.weekdaysOnly),
      completedIds: sanitizeIdArray(parsed.completedIds),
      sampledIds: sanitizeIdArray(parsed.sampledIds),
      moodId: moodMap.has(parsed.moodId) ? parsed.moodId : fallback.moodId,
      wanderDeckIds: sanitizeIdArray(parsed.wanderDeckIds),
      wanderDeckMood: moodMap.has(parsed.wanderDeckMood) ? parsed.wanderDeckMood : fallback.wanderDeckMood,
      history: sanitizeHistory(parsed.history),
      captureQuery: typeof parsed.captureQuery === "string" ? parsed.captureQuery : fallback.captureQuery,
      catalogSearch: typeof parsed.catalogSearch === "string" ? parsed.catalogSearch : fallback.catalogSearch,
      catalogMedia:
        parsed.catalogMedia === "Video" || parsed.catalogMedia === "Blog" || parsed.catalogMedia === "External"
          ? parsed.catalogMedia
          : fallback.catalogMedia,
      catalogPhase: parsed.catalogPhase === "all" || phaseMap.has(parsed.catalogPhase)
        ? parsed.catalogPhase
        : fallback.catalogPhase,
      catalogStatus: ["all", "fresh", "sampled", "todo", "done"].includes(parsed.catalogStatus)
        ? parsed.catalogStatus
        : fallback.catalogStatus,
    };
  }

  function sanitizeIdArray(value) {
    return Array.isArray(value)
      ? value.map((entry) => Number(entry)).filter((entry) => Number.isFinite(entry))
      : [];
  }

  function sanitizeHistory(value) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((entry) => {
        if (!entry || typeof entry !== "object") {
          return null;
        }

        const itemId = Number(entry.itemId);
        const action = entry.action;
        const timestamp = entry.timestamp;
        if (
          !Number.isFinite(itemId) ||
          (action !== "sampled" && action !== "done") ||
          typeof timestamp !== "string" ||
          Number.isNaN(new Date(timestamp).getTime())
        ) {
          return null;
        }

        return {
          itemId,
          action,
          timestamp,
        };
      })
      .filter(Boolean)
      .slice(0, HISTORY_LIMIT);
  }

  function extractPersistedState(value) {
    return {
      startDate: value.startDate,
      itemsPerDay: value.itemsPerDay,
      orderingMode: value.orderingMode,
      weekdaysOnly: value.weekdaysOnly,
      completedIds: value.completedIds,
      sampledIds: value.sampledIds,
      moodId: value.moodId,
      wanderDeckIds: value.wanderDeckIds,
      wanderDeckMood: value.wanderDeckMood,
      history: value.history,
      captureQuery: value.captureQuery,
      catalogSearch: value.catalogSearch,
      catalogMedia: value.catalogMedia,
      catalogPhase: value.catalogPhase,
      catalogStatus: value.catalogStatus,
    };
  }

  async function hydrateRemoteState() {
    if (!window.location.protocol.startsWith("http")) {
      runtime.saveStatus = "Local browser memory only. Use server.py for file-backed saves.";
      updateSaveStatus();
      return;
    }

    try {
      const response = await fetch("./api/progress", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Remote load failed: ${response.status}`);
      }

      const remote = sanitizePersistedState(await response.json(), state);
      Object.assign(state, remote);
      runtime.remoteAvailable = true;
      runtime.saveStatus = "Saved to progress.json";
      syncControls();
      render();
    } catch (error) {
      runtime.remoteAvailable = false;
      runtime.saveStatus = "Server not available. Using browser memory only.";
      updateSaveStatus();
    }
  }

  function consumeExternalCapture() {
    const capture = readExternalCapture();
    if (!capture.query) {
      return;
    }

    state.captureQuery = capture.query;
    const matches = getCaptureMatches(capture.query, getOrderedItems());
    const item = matches[0];
    if (item) {
      const changed = capture.action === "done" ? markItemDone(item.id) : markItemSampled(item.id);
      runtime.captureFeedback = changed
        ? capture.action === "done"
          ? `Logged from bookmark: ${item.title}`
          : `Logged as seen from bookmark: ${item.title}`
        : capture.action === "done"
          ? `Already marked done: ${item.title}`
          : `Already logged as seen: ${item.title}`;
      persistState();
    } else {
      runtime.captureFeedback = "No exact match found from the bookmarked page yet. Refine it in Quick capture.";
    }

    clearExternalCapture();
    render();
  }

  function readExternalCapture() {
    const sources = [window.location.hash.replace(/^#/, ""), window.location.search.replace(/^\?/, "")];
    for (const source of sources) {
      if (!source) {
        continue;
      }

      const params = new URLSearchParams(source);
      const query = (params.get("capture") || "").trim();
      if (!query) {
        continue;
      }

      const action = params.get("action") === "done" ? "done" : "sampled";
      return { query, action };
    }

    return { query: "", action: "sampled" };
  }

  function clearExternalCapture() {
    if (!window.location.hash && !window.location.search.includes("capture=")) {
      return;
    }

    const nextUrl = `${window.location.pathname}`;
    window.history.replaceState(null, "", nextUrl);
  }

  function queueRemoteSave() {
    updateSaveStatus("Saving…");
    if (!runtime.remoteAvailable) {
      updateSaveStatus(
        window.location.protocol.startsWith("http")
          ? "Server offline. Saved in this browser only."
          : "Local browser memory only. Use server.py for file-backed saves."
      );
      return;
    }

    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      saveRemoteState();
    }, 220);
  }

  async function saveRemoteState() {
    if (!runtime.remoteAvailable) {
      return;
    }

    try {
      const response = await fetch("./api/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(extractPersistedState(state)),
      });

      if (!response.ok) {
        throw new Error(`Remote save failed: ${response.status}`);
      }

      runtime.saveStatus = "Saved to progress.json";
      updateSaveStatus();
    } catch (error) {
      runtime.remoteAvailable = false;
      runtime.saveStatus = "Server save failed. Browser copy is still intact.";
      updateSaveStatus();
    }
  }

  function updateSaveStatus(nextValue) {
    if (typeof nextValue === "string") {
      runtime.saveStatus = nextValue;
    }

    if (els.saveStatus) {
      els.saveStatus.textContent = runtime.saveStatus;
    }
  }

  function render() {
    const orderedItems = getOrderedItems();
    const schedule = buildSchedule(orderedItems);
    const context = buildContext(orderedItems, schedule);

    updateSaveStatus();
    renderHero(context);
    renderOverview(context);
    renderToday(context);
    renderEnglishPanel(context);
    renderPhases(context);
    renderSchedule(context);
    renderCatalog(context);
  }

  function getOrderedItems() {
    return [...items].sort((left, right) => compareItems(left, right, state.orderingMode));
  }

  function compareItems(left, right, orderingMode) {
    if (left.phaseIndex !== right.phaseIndex) {
      return left.phaseIndex - right.phaseIndex;
    }

    if (orderingMode === "video-first") {
      const mediaDifference = mediaRank(left.mediaType) - mediaRank(right.mediaType);
      if (mediaDifference) {
        return mediaDifference;
      }
    }

    const curriculumDifference = Number(right.susCurriculum) - Number(left.susCurriculum);
    if (curriculumDifference) {
      return curriculumDifference;
    }

    const scoreDifference = (right.featureScore || 0) - (left.featureScore || 0);
    if (scoreDifference) {
      return scoreDifference;
    }

    if (orderingMode === "curriculum-first") {
      const mediaDifference = mediaRank(left.mediaType) - mediaRank(right.mediaType);
      if (mediaDifference) {
        return mediaDifference;
      }
    }

    return left.title.localeCompare(right.title);
  }

  function mediaRank(mediaType) {
    return mediaType === "Video" ? 0 : mediaType === "Blog" ? 1 : 2;
  }

  function buildSchedule(orderedItems) {
    const schedule = [];
    let cursor = normalizeStartDate(parseISODate(state.startDate), state.weekdaysOnly);

    for (let index = 0; index < orderedItems.length; index += state.itemsPerDay) {
      schedule.push({
        dayNumber: schedule.length + 1,
        date: cursor,
        items: orderedItems.slice(index, index + state.itemsPerDay),
      });
      cursor = nextStudyDate(cursor, state.weekdaysOnly);
    }

    return schedule;
  }

  function buildContext(orderedItems, schedule) {
    const completed = new Set(state.completedIds);
    const sampled = new Set(state.sampledIds);
    const totalItems = orderedItems.length;
    const completedItems = orderedItems.filter((item) => completed.has(item.id)).length;
    const sampledItems = orderedItems.filter((item) => sampled.has(item.id)).length;
    const remainingItems = totalItems - completedItems;
    const unseenItems = totalItems - sampledItems;
    const startDate = schedule[0] ? schedule[0].date : parseISODate(state.startDate);
    const finishDate = schedule.length ? schedule[schedule.length - 1].date : startDate;
    const today = todayLocal();
    const beforeStart = compareDates(today, startDate) < 0;
    const firstIncomplete = orderedItems.find((item) => !completed.has(item.id)) || null;
    const currentPhase = firstIncomplete ? phaseMap.get(firstIncomplete.phaseId) : null;
    const activeDay =
      getCurrentCalendarDay(schedule, today) ||
      schedule.find((day) => day.items.some((item) => !completed.has(item.id))) ||
      schedule[0] ||
      null;
    const overdueCount = schedule
      .filter((day) => compareDates(day.date, today) < 0)
      .reduce((count, day) => {
        return count + day.items.filter((item) => !completed.has(item.id)).length;
      }, 0);
    const wanderMood = moodMap.get(state.moodId) || MOODS[0];
    const wanderDeck = ensureWanderDeck(orderedItems, completed, sampled);
    const captureMatches = getCaptureMatches(state.captureQuery, orderedItems);
    const historyEntries = getHistoryEntries();

    return {
      orderedItems,
      schedule,
      completed,
      sampled,
      startDate,
      finishDate,
      totalItems,
      completedItems,
      sampledItems,
      unseenItems,
      remainingItems,
      completionRate: totalItems ? Math.round((completedItems / totalItems) * 100) : 0,
      activeDay,
      currentPhase,
      beforeStart,
      overdueCount,
      today,
      wanderMood,
      wanderDeck,
      captureMatches,
      historyEntries,
    };
  }

  function ensureWanderDeck(orderedItems, completed, sampled) {
    const expectedSize = Math.min(state.itemsPerDay, Math.max(orderedItems.length, 1));
    const currentDeck = (state.wanderDeckIds || []).map((id) => itemById.get(id)).filter(Boolean);

    if (
      currentDeck.length &&
      state.wanderDeckMood === state.moodId &&
      currentDeck.length === expectedSize
    ) {
      return currentDeck;
    }

    return regenerateWanderDeck(orderedItems, completed, sampled);
  }

  function regenerateWanderDeck(orderedItems, completed, sampled) {
    const mood = moodMap.get(state.moodId) || MOODS[0];
    const available = orderedItems.filter((item) => !completed.has(item.id));
    const candidates = available.length ? available : orderedItems;
    const size = Math.min(state.itemsPerDay, candidates.length);

    const weighted = candidates
      .map((item) => {
        const weight = getWanderWeight(item, mood, sampled, completed);
        if (weight <= 0) {
          return null;
        }

        return {
          item,
          key: Math.pow(Math.random(), 1 / weight),
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.key - left.key)
      .slice(0, size)
      .map((entry) => entry.item);

    const chosen = weighted.length ? weighted : candidates.slice(0, size);
    state.wanderDeckIds = chosen.map((item) => item.id);
    state.wanderDeckMood = state.moodId;
    persistState();
    return chosen;
  }

  function getHistoryEntries() {
    return sanitizeHistory(state.history)
      .map((entry) => {
        const item = itemById.get(entry.itemId);
        if (!item) {
          return null;
        }

        return {
          ...entry,
          item,
        };
      })
      .filter(Boolean)
      .slice(0, 8);
  }

  function markItemSampled(itemId) {
    const item = itemById.get(itemId);
    if (!item) {
      return false;
    }

    const sampled = new Set(state.sampledIds);
    if (sampled.has(itemId)) {
      return false;
    }

    sampled.add(itemId);
    state.sampledIds = Array.from(sampled).sort((left, right) => left - right);
    pushHistory(itemId, "sampled");
    return true;
  }

  function markItemDone(itemId) {
    const item = itemById.get(itemId);
    if (!item) {
      return false;
    }

    const completed = new Set(state.completedIds);
    if (completed.has(itemId)) {
      return false;
    }

    const sampled = new Set(state.sampledIds);
    sampled.add(itemId);
    completed.add(itemId);
    state.sampledIds = Array.from(sampled).sort((left, right) => left - right);
    state.completedIds = Array.from(completed).sort((left, right) => left - right);
    pushHistory(itemId, "done");
    return true;
  }

  function clearDone(itemId) {
    const completed = new Set(state.completedIds);
    if (!completed.has(itemId)) {
      return false;
    }

    completed.delete(itemId);
    state.completedIds = Array.from(completed).sort((left, right) => left - right);
    return true;
  }

  function pushHistory(itemId, action) {
    state.history = [
      { itemId, action, timestamp: new Date().toISOString() },
      ...sanitizeHistory(state.history),
    ].slice(0, HISTORY_LIMIT);
  }

  function getWanderWeight(item, mood, sampled, completed) {
    if (completed.has(item.id)) {
      return 0;
    }

    let weight = mood.phaseWeights[item.phaseId] || 1;
    weight *= mood.mediaWeights[item.mediaType] || 1;
    weight += item.susCurriculum ? mood.curriculumBonus || 0 : 0;
    weight += Math.min((item.featureScore || 0) / 500, 1.6) * (mood.featureMultiplier || 0);

    if (sampled.has(item.id)) {
      weight *= mood.revisitMultiplier || 0.4;
    }

    return Math.max(weight, 0.01);
  }

  function getCaptureMatches(query, orderedItems) {
    const trimmed = (query || "").trim();
    if (!trimmed) {
      return [];
    }

    const normalizedQuery = normalizeMatchToken(trimmed);
    const exact = orderedItems.filter((item) =>
      [item.ycUrl, item.resourceUrl, item.slug, item.title].some((value) =>
        normalizeMatchToken(value || "").includes(normalizedQuery)
      )
    );

    if (exact.length) {
      return exact.slice(0, 4);
    }

    return orderedItems
      .filter((item) => item.searchBlob.includes(trimmed.toLowerCase()))
      .slice(0, 6);
  }

  function applyCaptureAction(itemId, action) {
    const item = itemById.get(itemId);
    if (!item) {
      return;
    }

    const changed = action === "done" ? markItemDone(itemId) : markItemSampled(itemId);
    runtime.captureFeedback = changed
      ? action === "done"
        ? `Logged as done: ${item.title}`
        : `Logged as seen: ${item.title}`
      : action === "done"
        ? `Already marked done: ${item.title}`
        : `Already logged as seen: ${item.title}`;
    persistState();
    render();
  }

  function renderHero(context) {
    const stats = [
      { value: rawData.counts.items, label: "resources" },
      { value: rawData.counts.videos, label: "videos" },
      { value: context.sampledItems, label: "seen" },
      { value: context.completedItems, label: "finished" },
    ];

    els.heroStats.innerHTML = stats
      .map(
        (stat) =>
          `<div class="stat-chip"><strong>${formatNumber(stat.value)}</strong><span>${escapeHtml(
            stat.label
          )}</span></div>`
      )
      .join("");

    const generatedAt = rawData.generatedAt ? formatDateTime(rawData.generatedAt) : "Unknown build time";
    els.buildStamp.innerHTML = `Snapshot from ${escapeHtml(
      generatedAt
    )}. Source: <a href="${escapeAttribute(rawData.sourceUrl)}" target="_blank" rel="noreferrer">YC Library</a>.`;
  }

  function renderOverview(context) {
    const finishLabel = context.schedule.length
      ? `${formatDate(context.finishDate)} with ${state.itemsPerDay} item${
          state.itemsPerDay > 1 ? "s" : ""
        } a day`
      : "No items found";

    const overviewCards = [
      {
        value: `${context.completionRate}%`,
        label: `${formatNumber(context.completedItems)} of ${formatNumber(context.totalItems)} done`,
      },
      {
        value: `${formatNumber(context.sampledItems)} seen`,
        label: `${formatNumber(context.unseenItems)} still untouched in the library`,
      },
      {
        value: context.wanderMood.title,
        label: context.wanderMood.description,
      },
      {
        value: finishLabel,
        label: state.weekdaysOnly
          ? "Optional spine with weekdays only"
          : "Optional spine, only when you want structure",
      },
    ];

    els.overviewGrid.innerHTML = overviewCards
      .map(
        (card) =>
          `<article class="overview-card"><strong>${escapeHtml(card.value)}</strong><span>${escapeHtml(
            card.label
          )}</span></article>`
      )
      .join("");
  }

  function renderToday(context) {
    const deck = context.wanderDeck;

    if (!context.totalItems) {
      els.todayPanel.innerHTML = `
        <div class="section-heading">
          <div>
            <p class="kicker">Wander Log</p>
            <h2>No library data yet</h2>
          </div>
        </div>
        <p class="micro-copy">The data build is empty, so there is nothing to schedule.</p>
      `;
      return;
    }

    els.todayPanel.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="kicker">Wander Log</p>
          <h2>Follow today's curiosity</h2>
        </div>
        <div class="wander-actions">
          <button class="ghost-button" type="button" data-wander-shuffle>
            New draw
          </button>
          <button class="secondary-button" type="button" data-wander-surprise>
            Surprise me
          </button>
        </div>
      </div>
      <div class="wander-shell">
        <p class="wander-meter">
          Random is the point. Open anything you want on YC, then paste the YC
          page or resource link here so this atlas can remember what you touched.
        </p>
        <div class="capture-box">
          <h3>Quick capture</h3>
          <p class="capture-hint">
            Paste a YC Library URL, a YouTube link, a Spotify episode, or just a
            title fragment. Then log it as seen or done.
          </p>
          <div class="capture-row">
            <label class="control-field" for="captureQuery">
              <span>Link or title</span>
              <input
                id="captureQuery"
                name="captureQuery"
                data-capture-input
                type="search"
                value="${escapeAttribute(state.captureQuery || "")}"
                placeholder="Paste a YC link or type a title"
              />
            </label>
            <div class="capture-actions">
              <button class="ghost-button" type="button" data-capture-find>
                Find match
              </button>
              <span class="status-pill is-sampled">${formatNumber(context.sampledItems)} seen</span>
              <span class="status-pill is-done">${formatNumber(context.completedItems)} done</span>
            </div>
          </div>
          ${runtime.captureFeedback ? `<p class="capture-hint">${escapeHtml(runtime.captureFeedback)}</p>` : ""}
          ${
            state.captureQuery
              ? `<div class="capture-results">
                  ${
                    context.captureMatches.length
                      ? context.captureMatches.map((item) => renderCaptureResult(item, context)).join("")
                      : '<div class="empty-state">No match yet. Try a cleaner YC or YouTube link, or search by title.</div>'
                  }
                </div>`
              : ""
          }
        </div>
        <div class="mood-grid">
          ${MOODS.map((mood) => renderMoodButton(mood, context.wanderMood)).join("")}
        </div>
        <p class="wander-meter">
          Current mood: <strong>${escapeHtml(context.wanderMood.title)}</strong>.
          ${escapeHtml(context.wanderMood.description)}
        </p>
        <div class="today-stack">
          ${
            deck.length
              ? deck.map((item) => renderResourceCard(item, context.completed, context.sampled)).join("")
              : '<div class="empty-state">Everything is done in this current slice. Shuffle again or switch moods.</div>'
          }
        </div>
      </div>
    `;
  }

  function renderEnglishPanel(context) {
    const activeDeck = context.wanderDeck;
    const mix = { video: 0, reading: 0 };

    if (activeDeck.length) {
      activeDeck.forEach((item) => {
        if (item.mediaType === "Video") {
          mix.video += 1;
        } else {
          mix.reading += 1;
        }
      });
    }

    const prompts = [];

    if (mix.video) {
      prompts.push(
        "First watch: play once with no captions and only catch the big idea.",
        "Second watch: turn on English captions, pause, and collect 5 phrases worth stealing.",
        "Output: shadow one short segment for 30 to 60 seconds and record yourself.",
        "Finish: write a 3 sentence recap in English before you leave the page."
      );
    }

    if (mix.reading) {
      prompts.push(
        "Read aloud the title and first two paragraphs to train pace and pronunciation.",
        "Mark 3 lines you would actually use in conversation or work writing.",
        "Summarize the piece in plain English with one opinion sentence of your own."
      );
    }

    if (!prompts.length) {
      prompts.push(
        "Pick a mood or paste a resource link and the English prompts will adapt to that draw."
      );
    }

    els.englishPanel.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="kicker">English Layer</p>
          <h2>Use YC as speaking material</h2>
        </div>
        <p class="section-meta">${escapeHtml(
          mix.video
            ? `${mix.video} video${mix.video > 1 ? "s" : ""} in the active batch`
            : mix.reading
            ? "Reading-focused batch"
            : "Waiting for a draw"
        )}</p>
      </div>
      <div class="today-stack">
        ${prompts
          .map(
            (prompt, index) => `
              <article class="today-card">
                <header>
                  <div>
                    <h3>Drill ${index + 1}</h3>
                    <p>${escapeHtml(prompt)}</p>
                  </div>
                </header>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderMoodButton(mood, activeMood) {
    const active = mood.id === activeMood.id;
    return `
      <button
        class="mood-button ${active ? "is-active" : ""}"
        type="button"
        data-mood-id="${escapeAttribute(mood.id)}"
      >
        <strong>${escapeHtml(mood.title)}</strong>
        <span>${escapeHtml(mood.description)}</span>
      </button>
    `;
  }

  function renderCaptureResult(item, context) {
    const sampled = context.sampled.has(item.id);
    const done = context.completed.has(item.id);

    return `
      <article class="capture-result">
        <div class="capture-result-head">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.author)} · ${escapeHtml(item.phaseName)} · ${escapeHtml(
              item.mediaType
            )}</small>
          </div>
          <div class="capture-result-actions">
            <button
              class="ghost-button"
              type="button"
              data-capture-action="sampled"
              data-item-id="${item.id}"
            >
              ${sampled ? "Seen" : "Log seen"}
            </button>
            <button
              class="secondary-button"
              type="button"
              data-capture-action="done"
              data-item-id="${item.id}"
            >
              ${done ? "Done" : "Log done"}
            </button>
          </div>
        </div>
        <div class="capture-pills">
          <span class="status-pill ${sampled ? "is-sampled" : ""}">
            ${sampled ? "seen" : "fresh"}
          </span>
          <span class="status-pill ${done ? "is-done" : ""}">
            ${done ? "done" : "not done"}
          </span>
          <span class="badge ${MEDIA_CLASS[item.mediaType] || ""}">${escapeHtml(item.mediaType)}</span>
        </div>
      </article>
    `;
  }

  function renderPhases(context) {
    els.phaseGrid.innerHTML = PHASES.map((phase) => {
      const phaseItems = context.orderedItems.filter((item) => item.phaseId === phase.id);
      const completeCount = phaseItems.filter((item) => context.completed.has(item.id)).length;
      const ratio = phaseItems.length ? Math.round((completeCount / phaseItems.length) * 100) : 0;
      const videoCount = phaseItems.filter((item) => item.mediaType === "Video").length;
      const blogCount = phaseItems.length - videoCount;

      return `
        <article class="phase-card">
          <div class="phase-meta">
            <div>
              <small>${escapeHtml(phase.name)}</small>
              <h3>${escapeHtml(phase.title)}</h3>
            </div>
            <button class="link-button" type="button" data-phase-filter="${escapeAttribute(phase.id)}">
              Filter
            </button>
          </div>
          <p>${escapeHtml(phase.summary)}</p>
          <div class="phase-bar"><span style="width:${ratio}%"></span></div>
          <div class="phase-meta">
            <strong>${formatNumber(phaseItems.length)}</strong>
            <small>${formatNumber(completeCount)} done · ${videoCount} video · ${blogCount} read</small>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderSchedule(context) {
    const activeDayNumber = context.activeDay ? context.activeDay.dayNumber : null;

    els.scheduleSummary.textContent = context.schedule.length
      ? `${context.schedule.length} route days from ${formatDate(context.startDate)} to ${formatDate(
          context.finishDate
        )}. Ignore it when your mood wants something else.`
      : "No route available.";

    if (!context.schedule.length) {
      els.scheduleMap.innerHTML = `<div class="empty-state">No schedule could be generated from the current data snapshot.</div>`;
      return;
    }

    const monthGroups = groupByMonth(context.schedule);
    const currentMonthKey = getMonthKey(context.activeDay ? context.activeDay.date : context.startDate);

    els.scheduleMap.innerHTML = monthGroups
      .map((group) => {
        const isOpen = group.key === currentMonthKey || group.index === 0;
        return `
          <details class="month-block" ${isOpen ? "open" : ""}>
            <summary>
              <div class="month-summary">
                <strong>${escapeHtml(group.label)}</strong>
                <span>${group.days.length} study day${group.days.length > 1 ? "s" : ""}</span>
              </div>
              <div class="month-meta">${escapeHtml(group.meta)}</div>
            </summary>
            <div class="month-grid">
              ${group.days
                .map((day) => renderDayCard(day, context.completed, activeDayNumber, context.today))
                .join("")}
            </div>
          </details>
        `;
      })
      .join("");
  }

  function renderDayCard(day, completed, activeDayNumber, today) {
    const completeCount = day.items.filter((item) => completed.has(item.id)).length;
    const isFinished = completeCount === day.items.length;
    const isActive = day.dayNumber === activeDayNumber;
    const isOverdue = compareDates(day.date, today) < 0 && !isFinished;
    const classes = [
      "day-card",
      isActive ? "is-active" : "",
      isFinished ? "is-finished" : "",
      isOverdue ? "is-overdue" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <article class="${classes}" id="day-${day.dayNumber}">
        <div class="day-heading">
          <div>
            <span class="day-label">Day ${day.dayNumber}</span>
            <h4>${escapeHtml(formatDate(day.date))}</h4>
          </div>
          <div class="micro-copy">${completeCount}/${day.items.length} done</div>
        </div>
        <div class="day-list">
          ${day.items.map((item) => renderDayItem(item, completed)).join("")}
        </div>
      </article>
    `;
  }

  function renderDayItem(item, completed) {
    const done = completed.has(item.id);
    return `
      <div class="day-item ${done ? "is-complete" : ""}">
        <label class="checkline">
          <input
            class="resource-check"
            type="checkbox"
            data-item-checkbox
            data-item-id="${item.id}"
            ${done ? "checked" : ""}
          />
          <span>
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.author)} · ${escapeHtml(item.phaseTitle)} · ${escapeHtml(
              item.mediaType
            )}</small>
          </span>
        </label>
      </div>
    `;
  }

  function renderCatalog(context) {
    const filtered = getFilteredCatalog(context.orderedItems, context.completed, context.sampled);

    els.catalogCount.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"} visible`;

    if (!filtered.length) {
      els.catalogList.innerHTML = `<div class="empty-state">No library items match the current filters.</div>`;
      return;
    }

    els.catalogList.innerHTML = filtered
      .map((item) => renderCatalogCard(item, context.completed, context.sampled))
      .join("");
  }

  function renderCatalogCard(item, completed, sampled) {
    const done = completed.has(item.id);
    const surfaced = sampled.has(item.id);
    const badges = [
      `<span class="badge ${MEDIA_CLASS[item.mediaType] || ""}">${escapeHtml(item.mediaType)}</span>`,
      `<span class="badge">${escapeHtml(item.phaseName)}</span>`,
      surfaced ? '<span class="badge">Seen</span>' : '<span class="badge">Unseen</span>',
      ...(item.categories || []).slice(0, 3).map((category) => `<span class="badge">${escapeHtml(category)}</span>`),
    ].join("");

    const description = item.description || "No description supplied in the YC Library search index.";

    return `
      <article class="catalog-card ${done ? "is-complete" : ""}">
        <header>
          <label class="checkline">
            <input
              class="catalog-check"
              type="checkbox"
              data-item-checkbox
              data-item-id="${item.id}"
              ${done ? "checked" : ""}
            />
            <span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.author)}</p>
            </span>
          </label>
          <div class="catalog-actions">
            <a
              class="resource-link"
              href="${escapeAttribute(item.resourceUrl)}"
              target="_blank"
              rel="noreferrer"
              data-item-open
              data-item-id="${item.id}"
            >${escapeHtml(MEDIA_LABEL[item.mediaType] || "Open")}</a>
            ${
              item.ycUrl && item.resourceUrl !== item.ycUrl
                ? `<a class="resource-link secondary" href="${escapeAttribute(
                    item.ycUrl
                  )}" target="_blank" rel="noreferrer" data-item-open data-item-id="${item.id}">YC page</a>`
                : ""
            }
          </div>
        </header>
        <div class="catalog-body">
          <p>${escapeHtml(description)}</p>
          <div class="badge-row">${badges}</div>
        </div>
      </article>
    `;
  }

  function renderResourceCard(item, completed, sampled) {
    const done = completed.has(item.id);
    const surfaced = sampled.has(item.id);
    const categories = (item.categories || []).slice(0, 4);

    return `
      <article class="today-card ${done ? "is-complete" : ""}">
        <div class="resource-header">
          <div>
            <div class="resource-meta">
              <span class="badge ${MEDIA_CLASS[item.mediaType] || ""}">${escapeHtml(item.mediaType)}</span>
              <p>${escapeHtml(item.phaseName)}</p>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.author)}</p>
          </div>
          <label class="checkline">
            <input
              class="resource-check"
              type="checkbox"
              data-item-checkbox
              data-item-id="${item.id}"
              ${done ? "checked" : ""}
            />
            <span>
              <strong>${done ? "Done" : "Mark done"}</strong>
            </span>
          </label>
        </div>
        <p>${escapeHtml(item.description || "No description supplied in the YC Library search index.")}</p>
        <div class="badge-row">
          ${categories.map((category) => `<span class="badge">${escapeHtml(category)}</span>`).join("")}
          ${surfaced ? '<span class="badge">Seen</span>' : '<span class="badge">Unseen</span>'}
          ${item.susCurriculum ? '<span class="badge">Startup School core</span>' : ""}
        </div>
        <div class="resource-actions">
          <a
            class="resource-link"
            href="${escapeAttribute(item.resourceUrl)}"
            target="_blank"
            rel="noreferrer"
            data-item-open
            data-item-id="${item.id}"
          >
            ${escapeHtml(MEDIA_LABEL[item.mediaType] || "Open")} now
          </a>
          ${
            item.ycUrl && item.resourceUrl !== item.ycUrl
              ? `<a class="resource-link secondary" href="${escapeAttribute(
                  item.ycUrl
                )}" target="_blank" rel="noreferrer" data-item-open data-item-id="${item.id}">YC page</a>`
              : ""
          }
        </div>
      </article>
    `;
  }

  function getFilteredCatalog(orderedItems, completed, sampled) {
    return orderedItems.filter((item) => {
      if (state.catalogMedia !== "all" && item.mediaType !== state.catalogMedia) {
        return false;
      }

      if (state.catalogPhase !== "all" && item.phaseId !== state.catalogPhase) {
        return false;
      }

      if (state.catalogStatus === "done" && !completed.has(item.id)) {
        return false;
      }

      if (state.catalogStatus === "todo" && completed.has(item.id)) {
        return false;
      }

      if (state.catalogStatus === "sampled" && !sampled.has(item.id)) {
        return false;
      }

      if (state.catalogStatus === "fresh" && sampled.has(item.id)) {
        return false;
      }

      if (state.catalogSearch.trim() && !item.searchBlob.includes(state.catalogSearch.trim().toLowerCase())) {
        return false;
      }

      return true;
    });
  }

  function getTodayTitle(context, activeDay) {
    if (context.beforeStart) {
      return `Starts on ${formatDate(context.startDate)}`;
    }

    if (context.remainingItems === 0) {
      return "Library complete";
    }

    if (compareDates(activeDay.date, context.today) > 0) {
      return `Next session: ${formatDate(activeDay.date)}`;
    }

    if (compareDates(activeDay.date, context.today) < 0 && context.overdueCount) {
      return "Catch-up day";
    }

    return `Day ${activeDay.dayNumber} · ${formatDate(activeDay.date)}`;
  }

  function getTodayDescription(context, activeDay) {
    if (context.beforeStart) {
      return `Your route begins with ${activeDay.items.length} item${
        activeDay.items.length > 1 ? "s" : ""
      }.`;
    }

    if (context.remainingItems === 0) {
      return "Everything in the current snapshot is marked complete.";
    }

    if (compareDates(activeDay.date, context.today) > 0) {
      return "Nothing is scheduled for today, so the next study block is shown.";
    }

    if (context.overdueCount) {
      return `${context.overdueCount} unfinished item${
        context.overdueCount > 1 ? "s" : ""
      } are already behind schedule.`;
    }

    return `${activeDay.items.length} item${activeDay.items.length > 1 ? "s" : ""} in the active batch.`;
  }

  function groupByMonth(schedule) {
    const formatter = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });
    const groups = [];
    const indexMap = new Map();

    schedule.forEach((day) => {
      const key = getMonthKey(day.date);
      if (!indexMap.has(key)) {
        indexMap.set(key, groups.length);
        groups.push({
          key,
          index: groups.length,
          label: formatter.format(day.date),
          days: [],
          meta: "",
        });
      }

      groups[indexMap.get(key)].days.push(day);
    });

    groups.forEach((group) => {
      const first = group.days[0];
      const last = group.days[group.days.length - 1];
      group.meta = `${formatShortDate(first.date)} to ${formatShortDate(last.date)}`;
    });

    return groups;
  }

  function getCurrentCalendarDay(schedule, today) {
    return schedule.find((day) => compareDates(day.date, today) === 0) || null;
  }

  function normalizeStartDate(date, weekdaysOnly) {
    let cursor = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    while (weekdaysOnly && isWeekend(cursor)) {
      cursor = addDays(cursor, 1);
    }
    return cursor;
  }

  function nextStudyDate(date, weekdaysOnly) {
    let cursor = addDays(date, 1);
    while (weekdaysOnly && isWeekend(cursor)) {
      cursor = addDays(cursor, 1);
    }
    return cursor;
  }

  function addDays(date, days) {
    const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function formatShortDate(date) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(date);
  }

  function formatDateTime(value) {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(value));
  }

  function formatNumber(value) {
    return new Intl.NumberFormat().format(value);
  }

  function todayLocal() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function parseISODate(value) {
    if (!isISODate(value)) {
      return todayLocal();
    }
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function dateToISO(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function isISODate(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  function compareDates(left, right) {
    const leftValue = Date.UTC(left.getFullYear(), left.getMonth(), left.getDate());
    const rightValue = Date.UTC(right.getFullYear(), right.getMonth(), right.getDate());
    return Math.sign(leftValue - rightValue);
  }

  function clampNumber(value, min, max, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.max(min, Math.min(max, numeric));
  }

  function getMonthKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function normalizeMatchToken(value) {
    const text = String(value || "").trim().toLowerCase();
    if (!text) {
      return "";
    }

    try {
      const url = new URL(text.startsWith("http://") || text.startsWith("https://") ? text : `https://${text}`);
      const host = url.hostname.replace(/^www\./, "");

      if (host === "youtu.be") {
        return url.pathname.replace(/\//g, "");
      }

      if (host.includes("youtube.com")) {
        return url.searchParams.get("v") || `${host}${url.pathname}`;
      }

      return `${host}${url.pathname}`.replace(/\/+$/, "");
    } catch (error) {
      return decodeURIComponent(text).replace(/\s+/g, " ").trim();
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
})();
