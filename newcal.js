const SEASONS = ["Winter", "Spring", "Summer", "Autumn", "Fall"];

const DAYS_OF_WEEK = [
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
];

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function dayOfWeek(day) {
  if (day === -1) return "Leap Day";
  if (day === 37) return "Mid Season";

  let adjustedDay = day;
  if (adjustedDay > 37) adjustedDay--;

  return DAYS_OF_WEEK[(adjustedDay - 1) % 9];
}

function monthWithModifier(day, season) {
  if (day === -1) return "Leap Day";
  if (day === 37) return `Mid ${season}`;
  if (day > 37) return `Late ${season}`;
  return `Early ${season}`;
}

function evergreenToString(date) {
  if (date.day === -1) {
    return `Leap Day, ${date.year}`;
  }

  const dow = date.day === 37 ? "" : `${dayOfWeek(date.day)}, `;
  return `${dow}${date.day} ${monthWithModifier(date.day, date.season)}, ${date.year}`;
}

function gregorianToEvergreen(year, month, day) {
  // month is 1-12
  const ms = Date.UTC(year, month - 1, day);
  let days = Math.floor(ms / 86400000);

  // This matches your Go repo's FromUnix logic.
  days += 11;

  let evergreenYear = 1970;

  while (days < 0) {
    evergreenYear--;
    days += isLeapYear(evergreenYear) ? 366 : 365;
  }

  while (days > 365) {
    if (isLeapYear(evergreenYear)) {
      if (days >= 366) {
        days -= 366;
        evergreenYear++;
      } else {
        break;
      }
    } else {
      days -= 365;
      evergreenYear++;
    }
  }

  if (isLeapYear(evergreenYear)) {
    if (days === 70) {
      return {
        year: evergreenYear,
        season: "Leap Day",
        day: -1,
      };
    }

    if (days > 70) {
      days--;
    }
  }

  const seasonIndex = Math.floor(days / 73);
  const dayInSeason = (days % 73) + 1;

  return {
    year: evergreenYear,
    season: SEASONS[seasonIndex],
    day: dayInSeason,
  };
}

function parseGregorianDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
}

function convertGregorianStringToEvergreen(dateString) {
  const { year, month, day } = parseGregorianDate(dateString);
  const evergreen = gregorianToEvergreen(year, month, day);
  return {
    ...evergreen,
    label: evergreenToString(evergreen),
  };
}