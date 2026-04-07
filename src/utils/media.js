const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export const resolveAssetUrl = (pathOrUrl) => {
  if (!pathOrUrl) return "";

  if (typeof pathOrUrl !== "string") return "";

  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith("data:")) {
    return pathOrUrl;
  }

  if (pathOrUrl.startsWith("/")) {
    return `${API_ORIGIN}${pathOrUrl}`;
  }

  return `${API_ORIGIN}/${pathOrUrl}`;
};
