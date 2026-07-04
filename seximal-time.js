function toBase6Padded(number) {
  return number.toString(6).padStart(2, "0");
}

function getSeximalTime(date = new Date()) {
  const midnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );

  const msSinceMidnight = date.getTime() - midnight.getTime();
  const fractionOfDay = msSinceMidnight / 86400000;

  const totalSeximalSeconds = Math.floor(fractionOfDay * 36 * 36 * 36);

  const hour = Math.floor(totalSeximalSeconds / (36 * 36));
  const minute = Math.floor((totalSeximalSeconds % (36 * 36)) / 36);
  const second = totalSeximalSeconds % 36;

  return `${toBase6Padded(hour)}:${toBase6Padded(minute)}:${toBase6Padded(second)}₆`;
}

function getStandardTime(date = new Date()) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}