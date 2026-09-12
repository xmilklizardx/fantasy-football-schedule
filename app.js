const standings = [
  "milklizard", "hailstatetx", "buzzdog", "sorenk", "jklinke", "sgibby",
  "younggunz", "samwill226", "twhitt", "hopkinsdrums", "fitzmagicman", "msmith69"
];

const schedule = [
  { week: 1, type: "rivalry", label: "Rivalry Round", games: [
    ["milklizard","hailstatetx"], ["younggunz","fitzmagicman"], ["msmith69","sgibby"],
    ["hopkinsdrums","samwill226"], ["buzzdog","twhitt"], ["sorenk","jklinke"]
  ]},
  { week: 2, type: "regular", label: "Regular Season", games: [
    ["fitzmagicman","milklizard"], ["younggunz","msmith69"], ["hailstatetx","samwill226"],
    ["jklinke","twhitt"], ["sorenk","hopkinsdrums"], ["sgibby","buzzdog"]
  ]},
  { week: 3, type: "regular", label: "Regular Season", games: [
    ["samwill226","fitzmagicman"], ["milklizard","younggunz"], ["jklinke","msmith69"],
    ["twhitt","sorenk"], ["hopkinsdrums","sgibby"], ["buzzdog","hailstatetx"]
  ]},
  { week: 4, type: "regular", label: "Friendship opponents - first meeting", games: [
    ["msmith69","milklizard"], ["younggunz","hailstatetx"], ["buzzdog","hopkinsdrums"],
    ["sgibby","twhitt"], ["sorenk","samwill226"], ["fitzmagicman","jklinke"]
  ]},
  { week: 5, type: "regular", label: "Regular Season", games: [
    ["hailstatetx","fitzmagicman"], ["jklinke","younggunz"], ["twhitt","msmith69"],
    ["hopkinsdrums","milklizard"], ["samwill226","sgibby"], ["sorenk","buzzdog"]
  ]},
  { week: 6, type: "regular", label: "Regular Season", games: [
    ["fitzmagicman","twhitt"], ["younggunz","hopkinsdrums"], ["msmith69","hailstatetx"],
    ["milklizard","samwill226"], ["buzzdog","jklinke"], ["sgibby","sorenk"]
  ]},
  { week: 7, type: "regular", label: "Standings opponents - first meeting", games: [
    ["milklizard","buzzdog"], ["hailstatetx","sorenk"], ["jklinke","sgibby"],
    ["samwill226","younggunz"], ["twhitt","hopkinsdrums"], ["fitzmagicman","msmith69"]
  ]},
  { week: 8, type: "regular", label: "Regular Season", games: [
    ["sorenk","fitzmagicman"], ["buzzdog","younggunz"], ["msmith69","samwill226"],
    ["twhitt","milklizard"], ["hopkinsdrums","jklinke"], ["sgibby","hailstatetx"]
  ]},
  { week: 9, type: "regular", label: "Regular Season", games: [
    ["fitzmagicman","sgibby"], ["younggunz","twhitt"], ["msmith69","sorenk"],
    ["milklizard","jklinke"], ["samwill226","buzzdog"], ["hailstatetx","hopkinsdrums"]
  ]},
  { week: 10, type: "regular", label: "Regular Season", games: [
    ["hopkinsdrums","fitzmagicman"], ["sgibby","younggunz"], ["buzzdog","msmith69"],
    ["sorenk","milklizard"], ["jklinke","samwill226"], ["twhitt","hailstatetx"]
  ]},
  { week: 11, type: "regular", label: "Regular Season", games: [
    ["fitzmagicman","buzzdog"], ["younggunz","sorenk"], ["msmith69","hopkinsdrums"],
    ["milklizard","sgibby"], ["samwill226","twhitt"], ["hailstatetx","jklinke"]
  ]},
  { week: 12, type: "friendship", label: "Friendship Round", games: [
    ["milklizard","msmith69"], ["hailstatetx","younggunz"], ["hopkinsdrums","buzzdog"],
    ["twhitt","sgibby"], ["samwill226","sorenk"], ["jklinke","fitzmagicman"]
  ]},
  { week: 13, type: "standings", label: "Previous-Standings Round", games: [
    ["buzzdog","milklizard"], ["sorenk","hailstatetx"], ["sgibby","jklinke"],
    ["younggunz","samwill226"], ["hopkinsdrums","twhitt"], ["msmith69","fitzmagicman"]
  ]},
  { week: 14, type: "rivalry", label: "Rivalry Round", games: [
    ["hailstatetx","milklizard"], ["fitzmagicman","younggunz"], ["sgibby","msmith69"],
    ["samwill226","hopkinsdrums"], ["twhitt","buzzdog"], ["jklinke","sorenk"]
  ]}
];

const teams = [...new Set(schedule.flatMap(w => w.games.flat()))].sort((a,b) => a.localeCompare(b));
const teamFilter = document.getElementById("teamFilter");
const weekFilter = document.getElementById("weekFilter");
const scheduleEl = document.getElementById("schedule");
const summaryEl = document.getElementById("selectedTeamSummary");

teams.forEach(team => {
  const option = document.createElement("option");
  option.value = team;
  option.textContent = team;
  teamFilter.appendChild(option);
});

schedule.forEach(({week}) => {
  const option = document.createElement("option");
  option.value = String(week);
  option.textContent = `Week ${week}`;
  weekFilter.appendChild(option);
});

standings.forEach((team, i) => {
  const li = document.createElement("li");
  li.textContent = team;
  document.getElementById("standingsList").appendChild(li);
});

function getTeamSummary(team) {
  const games = schedule.map(w => {
    const game = w.games.find(g => g.includes(team));
    if (!game) return null;
    const isHome = game[0] === team;
    return { week: w.week, isHome, opponent: isHome ? game[1] : game[0], label: w.label };
  }).filter(Boolean);
  const home = games.filter(g => g.isHome).length;
  const away = games.length - home;
  let longest = 1, current = 1;
  for (let i = 1; i < games.length; i++) {
    if (games[i].isHome === games[i-1].isHome) current += 1;
    else current = 1;
    longest = Math.max(longest, current);
  }
  const pattern = games.map(g => g.isHome ? "H" : "A").join("");
  return { home, away, longest, pattern };
}

function render() {
  const team = teamFilter.value;
  const week = weekFilter.value;
  scheduleEl.innerHTML = "";

  const visibleWeeks = schedule.filter(w => week === "all" || String(w.week) === week);
  visibleWeeks.forEach(w => {
    const visibleGames = w.games.filter(g => team === "all" || g.includes(team));
    if (!visibleGames.length) return;

    const card = document.createElement("article");
    card.className = `week-card ${w.type}`;
    card.innerHTML = `
      <div class="week-header">
        <div class="week-title"><strong>Week ${w.week}</strong><span>${w.label}</span></div>
        <span class="badge">${w.type === "regular" ? "Regular" : w.type}</span>
      </div>
      <ul class="matchups"></ul>`;
    const list = card.querySelector(".matchups");

    visibleGames.forEach(([home, away]) => {
      const li = document.createElement("li");
      li.className = `matchup${team !== "all" ? " highlight" : ""}`;
      li.innerHTML = `
        <div class="team home"><div class="team-name">${home}</div><div class="team-meta">Home</div></div>
        <div class="at">vs</div>
        <div class="team away"><div class="team-name">${away}</div><div class="team-meta">Away</div></div>`;
      list.appendChild(li);
    });
    scheduleEl.appendChild(card);
  });

  if (!scheduleEl.children.length) {
    scheduleEl.innerHTML = '<div class="empty-state">No games match the selected filters.</div>';
  }

  if (team !== "all") {
    const s = getTeamSummary(team);
    summaryEl.classList.remove("hidden");
    summaryEl.innerHTML = `<strong>${team}</strong> ${s.home} home / ${s.away} away &nbsp;•&nbsp; H/A pattern: ${s.pattern} &nbsp;•&nbsp; Longest venue streak: ${s.longest}`;
  } else {
    summaryEl.classList.add("hidden");
    summaryEl.innerHTML = "";
  }
}

teamFilter.addEventListener("change", render);
weekFilter.addEventListener("change", render);
document.getElementById("clearFilters").addEventListener("click", () => {
  teamFilter.value = "all";
  weekFilter.value = "all";
  render();
});

render();

// -----------------------------------------------------------------------------
// Weekly Swap High Score workflow
// -----------------------------------------------------------------------------
const swapTeam = document.getElementById("swapTeam");
const swapForm = document.getElementById("swapForm");
const swapSubmit = document.getElementById("swapSubmit");
const swapMessage = document.getElementById("swapMessage");
const swapStatusBadge = document.getElementById("swapStatusBadge");
const swapSetupNotice = document.getElementById("swapSetupNotice");
const swapOpenView = document.getElementById("swapOpenView");
const swapResultsView = document.getElementById("swapResultsView");
const swapPreseasonView = document.getElementById("swapPreseasonView");
const swapCompleteView = document.getElementById("swapCompleteView");

teams.forEach(team => {
  const option = document.createElement("option");
  option.value = team;
  option.textContent = team;
  swapTeam.appendChild(option);
});

const pacificFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short"
});

function formatPacific(value) {
  if (!value) return "-";
  return pacificFormatter.format(new Date(value));
}

function setSwapView(view) {
  [swapOpenView, swapResultsView, swapPreseasonView, swapCompleteView].forEach(el => el.classList.add("hidden"));
  if (view) view.classList.remove("hidden");
}

function showSwapMessage(text, kind = "success") {
  swapMessage.textContent = text;
  swapMessage.className = `submission-message ${kind}`;
  swapMessage.classList.remove("hidden");
}

function clearSwapMessage() {
  swapMessage.textContent = "";
  swapMessage.classList.add("hidden");
}

function getConfig() {
  const config = window.SWAP_CONFIG || {};
  const valid = config.supabaseUrl && config.supabaseAnonKey &&
    !config.supabaseUrl.includes("YOUR_SUPABASE") &&
    !config.supabaseAnonKey.includes("YOUR_SUPABASE");
  return { ...config, valid };
}

const swapConfig = getConfig();
let swapDb = null;
let activeSwapState = null;

if (swapConfig.valid && window.supabase?.createClient) {
  swapDb = window.supabase.createClient(swapConfig.supabaseUrl, swapConfig.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
} else {
  swapSetupNotice.classList.remove("hidden");
  swapStatusBadge.textContent = "Setup needed";
  swapStatusBadge.className = "status-badge setup";
  setSwapView(null);
}

function renderSwapState(state) {
  activeSwapState = state;
  clearSwapMessage();

  if (state.phase === "open") {
    setSwapView(swapOpenView);
    swapStatusBadge.textContent = `Week ${state.week} - Open`;
    swapStatusBadge.className = "status-badge open";
    document.getElementById("swapWeekLabel").textContent = `Week ${state.week}`;
    document.getElementById("swapDeadlineLabel").textContent = formatPacific(state.deadline_at);
    swapForm.querySelectorAll("select, input, button").forEach(el => el.disabled = false);
    restoreLocalSelection(state.week);
    return;
  }

  if (state.phase === "results") {
    setSwapView(swapResultsView);
    swapStatusBadge.textContent = `Week ${state.week} - Locked`;
    swapStatusBadge.className = "status-badge locked";
    document.getElementById("resultsWeekLabel").textContent = `Week ${state.week}`;
    document.getElementById("resultsUntilLabel").textContent = state.week < 14
      ? `Locked until ${formatPacific(state.results_until)}. Week ${state.week + 1} opens Tuesday.`
      : `Locked until ${formatPacific(state.results_until)}. The submission season then ends.`;
    const yesTeams = Array.isArray(state.yes_teams) ? state.yes_teams : [];
    const yesTeamsEl = document.getElementById("yesTeams");
    yesTeamsEl.innerHTML = "";
    if (!yesTeams.length) {
      const none = document.createElement("div");
      none.className = "no-yes-results";
      none.textContent = "No teams selected Yes this week.";
      yesTeamsEl.appendChild(none);
    } else {
      yesTeams.forEach(team => {
        const chip = document.createElement("span");
        chip.className = "team-chip";
        chip.textContent = team;
        yesTeamsEl.appendChild(chip);
      });
    }

    const remainingEl = document.getElementById("remainingUses");
    const remaining = state.remaining_uses && typeof state.remaining_uses === "object"
      ? state.remaining_uses
      : {};
    remainingEl.innerHTML = "";
    teams.forEach(team => {
      const usesLeft = Number.isFinite(Number(remaining[team])) ? Number(remaining[team]) : 3;
      const item = document.createElement("div");
      item.className = `remaining-item${usesLeft === 0 ? " exhausted" : ""}`;
      item.innerHTML = `<span class="remaining-team">${team}</span><strong>${usesLeft}</strong><small>${usesLeft === 1 ? "use left" : "uses left"}</small>`;
      remainingEl.appendChild(item);
    });
    return;
  }

  if (state.phase === "preseason") {
    setSwapView(swapPreseasonView);
    swapStatusBadge.textContent = "Not open yet";
    swapStatusBadge.className = "status-badge setup";
    swapPreseasonView.innerHTML = `<strong>Week 1 is not open yet.</strong> Submissions open ${formatPacific(state.open_at)}.`;
    return;
  }

  setSwapView(swapCompleteView);
  swapStatusBadge.textContent = "Season complete";
  swapStatusBadge.className = "status-badge locked";
}

async function loadSwapState() {
  if (!swapDb) return;
  try {
    const { data, error } = await swapDb.rpc("get_swap_state");
    if (error) throw error;
    const state = Array.isArray(data) ? data[0] : data;
    if (!state) throw new Error("No weekly state returned.");
    renderSwapState(state);
  } catch (error) {
    swapStatusBadge.textContent = "Connection error";
    swapStatusBadge.className = "status-badge error";
    setSwapView(null);
    swapSetupNotice.classList.remove("hidden");
    swapSetupNotice.innerHTML = `<strong>Weekly voting is unavailable.</strong> ${error.message || "Check the Supabase configuration."}`;
  }
}

function localKey(week, team) {
  return `fantasy-swap:${week}:${team}`;
}

function restoreLocalSelection(week) {
  const selectedTeam = swapTeam.value;
  document.querySelectorAll('input[name="swapAnswer"]').forEach(input => input.checked = false);
  if (!selectedTeam) return;
  const saved = localStorage.getItem(localKey(week, selectedTeam));
  if (saved === "yes" || saved === "no") {
    const input = document.querySelector(`input[name="swapAnswer"][value="${saved}"]`);
    if (input) input.checked = true;
    swapSubmit.textContent = "Update response";
    showSwapMessage(`This device last submitted ${saved.toUpperCase()} for ${selectedTeam}. You can update it until the deadline.`, "info");
  } else {
    swapSubmit.textContent = "Submit response";
    clearSwapMessage();
  }
}

swapTeam.addEventListener("change", () => {
  if (activeSwapState?.phase === "open") restoreLocalSelection(activeSwapState.week);
});

swapForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!swapDb || activeSwapState?.phase !== "open") return;

  const team = swapTeam.value;
  const checked = document.querySelector('input[name="swapAnswer"]:checked');
  if (!team || !checked) {
    showSwapMessage("Select your team and choose Yes or No.", "error");
    return;
  }

  const answer = checked.value === "yes";
  swapSubmit.disabled = true;
  swapSubmit.textContent = "Saving...";
  clearSwapMessage();

  try {
    const { data, error } = await swapDb.rpc("submit_swap", { p_team: team, p_answer: answer });
    if (error) throw error;
    const result = data || {};
    localStorage.setItem(localKey(result.week || activeSwapState.week, team), answer ? "yes" : "no");
    const remainingNote = answer && Number.isFinite(Number(result.yes_remaining))
      ? ` ${result.yes_remaining} Yes ${Number(result.yes_remaining) === 1 ? "use" : "uses"} remaining after this selection.`
      : "";
    showSwapMessage(`${team}: ${answer ? "YES" : "NO"} saved for Week ${result.week || activeSwapState.week}.${remainingNote} You can change it until Sunday at 10:00 AM Pacific.`, "success");
    swapSubmit.textContent = "Update response";
  } catch (error) {
    showSwapMessage(error.message || "Your response could not be saved.", "error");
    swapSubmit.textContent = "Submit response";
    await loadSwapState();
  } finally {
    swapSubmit.disabled = false;
  }
});

if (swapDb) {
  loadSwapState();
  // Refresh from the database so the page changes state automatically at cutoff/opening times.
  setInterval(loadSwapState, 60 * 1000);
}
