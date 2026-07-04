let showCivilianTime = false;

const evergreenTodayEl = document.getElementById("evergreenToday");
const gregorianTodayEl = document.getElementById("gregorianToday");
const seximalClockEl = document.getElementById("seximalClock");
const standardClockEl = document.getElementById("standardClock");
const toggleCivilianBtn = document.getElementById("toggleCivilian");
const eventForm = document.getElementById("eventForm");
const eventsList = document.getElementById("eventsList");

function getTodayGregorianString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderToday() {
  const todayString = getTodayGregorianString();
  const evergreen = convertGregorianStringToEvergreen(todayString);

  evergreenTodayEl.textContent = evergreen.label;

  const normal = new Date().toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  gregorianTodayEl.textContent = normal;
  gregorianTodayEl.classList.toggle("hidden", !showCivilianTime);
}

function renderClock() {
  const now = new Date();

  seximalClockEl.textContent = getSeximalTime(now);
  standardClockEl.textContent = getStandardTime(now);
  standardClockEl.classList.toggle("hidden", !showCivilianTime);
}

function renderEvents() {
  const events = loadEvents();

  eventsList.innerHTML = "";

  if (events.length === 0) {
    eventsList.innerHTML = "<p>No events yet. Add a deadline.</p>";
    return;
  }

  const sorted = [...events].sort((a, b) => {
    return a.gregorianDate.localeCompare(b.gregorianDate);
  });

  for (const event of sorted) {
    const evergreen = convertGregorianStringToEvergreen(event.gregorianDate);

    const card = document.createElement("div");
    card.className = "event-card";

    const civilianDate = showCivilianTime
      ? `<p class="event-meta">Gregorian: ${event.gregorianDate}${event.time ? ` at ${event.time}` : ""}</p>`
      : "";

    card.innerHTML = `
      <h3>${event.title}</h3>
      <p class="event-meta">${evergreen.label}</p>
      ${civilianDate}
      <p class="event-meta">Domain: ${event.domain}</p>
      <button data-delete="${event.id}">Delete</button>
    `;

    eventsList.appendChild(card);
  }

  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteEvent(button.dataset.delete);
      renderEvents();
    });
  });
}

function renderAll() {
  renderToday();
  renderClock();
  renderEvents();

  toggleCivilianBtn.textContent = showCivilianTime
    ? "Hide Gregorian / Standard Time"
    : "Show Gregorian / Standard Time";
}

toggleCivilianBtn.addEventListener("click", () => {
  showCivilianTime = !showCivilianTime;
  renderAll();
});

eventForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("eventTitle").value.trim();
  const gregorianDate = document.getElementById("eventDate").value;
  const time = document.getElementById("eventTime").value;
  const domain = document.getElementById("eventDomain").value;

  const event = {
    id: crypto.randomUUID(),
    title,
    gregorianDate,
    time,
    domain,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  addEvent(event);
  eventForm.reset();
  renderEvents();
});

renderAll();
setInterval(renderClock, 1000);