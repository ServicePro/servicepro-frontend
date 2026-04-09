const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

// Inline SVG placeholder — works offline, no external service needed
export const SERVICE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='520' height='320' viewBox='0 0 520 320'%3E%3Crect width='520' height='320' fill='%23FFE7D4'/%3E%3Crect x='200' y='110' width='120' height='80' rx='10' fill='%23F97316' fill-opacity='0.2'/%3E%3Ccircle cx='260' cy='143' r='26' fill='%23F97316' fill-opacity='0.35'/%3E%3Crect x='215' y='155' width='90' height='2' rx='1' fill='%23F97316' fill-opacity='0.4'/%3E%3Ctext x='260' y='222' font-family='sans-serif' font-size='15' fill='%23F97316' text-anchor='middle' font-weight='600'%3ENo Image%3C/text%3E%3C/svg%3E";

export const resolveAssetUrl = (pathOrUrl) => {
  if (!pathOrUrl) return "";

  if (typeof pathOrUrl !== "string") return "";

  // Already an absolute URL or data URI — use as-is
  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith("data:")) {
    return pathOrUrl;
  }

  // Paths starting with /uploads are served via Vite proxy → backend
  // Keep them relative so the Vite dev server proxy handles forwarding
  if (pathOrUrl.startsWith("/uploads")) {
    return pathOrUrl;
  }

  // Other relative paths — prefix with API origin
  if (pathOrUrl.startsWith("/")) {
    return `${API_ORIGIN}${pathOrUrl}`;
  }

  return `${API_ORIGIN}/${pathOrUrl}`;
};
