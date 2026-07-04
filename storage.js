const STORAGE_KEY = "evergreen-life-events";

function loadEvents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function addEvent(event) {
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
}

function deleteEvent(id) {
  const events = loadEvents().filter((event) => event.id !== id);
  saveEvents(events);
}