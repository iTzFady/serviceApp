import { Icons } from "../data/speciality";

export default function DynamicIcon({ path, size = 40, color = "#000" }) {
  const SvgIcon = Icons[path];
  if (!SvgIcon) return null;

  return <SvgIcon width={size} height={size} fill={color} />;
}
