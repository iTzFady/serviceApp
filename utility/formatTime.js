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

  const ampm = hours >= 12 ? "م" : "ص";
  hours = hours % 12 || 12;

  const dayMonth = `${day} ${month}`;

  const timePart = `${hours}:${minutes}${` ${ampm}`}`;
  return `${weekday} ${dayMonth} - الساعة ${timePart}`;
}
export function toLocalTimestamp(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);

  const pad = (n) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
