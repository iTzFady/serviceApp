export function formatTime(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "";

  const weekday = new Intl.DateTimeFormat("ar-EG", { weekday: "long" }).format(
    date
  );

  const day = date.getDate();

  const month = new Intl.DateTimeFormat("ar-EG", { month: "long" }).format(
    date
  );

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  let ampm = hours >= 12 ? "ًص" : "م";
  hours = hours % 12 || 12;

  const dayMonth = `${day} ${month}`;

  const timePart = `${hours}:${minutes}${` ${ampm}`}`;
  return `${weekday} ${dayMonth} - الساعة ${timePart}`;
}
