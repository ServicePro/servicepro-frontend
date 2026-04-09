const THEME_EVENT = "sp_theme_change";

export const getInitialDarkMode = () => {
  const saved = localStorage.getItem("sp_dark");
  if (saved !== null) return saved === "true";
  return localStorage.getItem("theme") === "dark";
};

export const applyGlobalTheme = (isDark) => {
  document.body.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark-theme", isDark);
  localStorage.setItem("sp_dark", String(isDark));
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

export const emitThemeChange = (isDark) => {
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: isDark }));
};

export const onThemeChange = (handler) => {
  const listener = (event) => handler(Boolean(event.detail));
  window.addEventListener(THEME_EVENT, listener);
  return () => window.removeEventListener(THEME_EVENT, listener);
};
